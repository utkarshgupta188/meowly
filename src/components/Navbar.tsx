"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Menu, X, ArrowLeft, Dices, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { surpriseMe } from "@/app/actions";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollYRef = React.useRef(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = React.useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const mobileInputRef = React.useRef<HTMLInputElement>(null);
    const desktopInputRef = React.useRef<HTMLInputElement>(null);

    const [pwaPrompt, setPwaPrompt] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleInstallReady = () => {
                setPwaPrompt(window.deferredPrompt);
            };
            const handleInstalled = () => {
                setPwaPrompt(null);
            };

            window.addEventListener("pwa-install-ready", handleInstallReady);
            window.addEventListener("pwa-installed", handleInstalled);

            if (window.deferredPrompt) {
                setPwaPrompt(window.deferredPrompt);
            }

            return () => {
                window.removeEventListener("pwa-install-ready", handleInstallReady);
                window.removeEventListener("pwa-installed", handleInstalled);
            };
        }
    }, []);

    const handlePwaInstall = async () => {
        const promptEvent = pwaPrompt || window.deferredPrompt;
        if (!promptEvent) return;

        promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        console.log(`[PWA Navbar] Install choice: ${outcome}`);
        
        try {
            if (outcome === "accepted") {
                localStorage.setItem("pwa-installed", "true");
            } else {
                localStorage.setItem("pwa-prompt-dismissed-time", Date.now().toString());
            }
        } catch (e) {
            console.warn("localStorage set item failed in Navbar:", e);
        }

        setPwaPrompt(null);
        window.deferredPrompt = null;
        window.dispatchEvent(new CustomEvent("pwa-installed"));
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const lastScrollY = lastScrollYRef.current;

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsVisible(prev => prev ? false : prev);
            } else {
                setIsVisible(prev => !prev ? true : prev);
            }

            lastScrollYRef.current = currentScrollY;

            if (currentScrollY > 0) {
                setIsScrolled(prev => prev ? prev : true);
            } else {
                setIsScrolled(prev => !prev ? prev : false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Sync search query with URL (for back/forward navigation or direct links)
    useEffect(() => {
        const q = searchParams.get("q") || "";

        // Only update searchQuery state from the URL if they differ,
        // and we aren't currently focused on a search input (which means the user is typing)
        const activeEl = document.activeElement;
        const isInputFocused = activeEl && (
            activeEl.tagName === "INPUT" &&
            (activeEl.getAttribute("placeholder")?.includes("Search") || activeEl.getAttribute("type") === "text")
        );

        if (q !== searchQuery && !isInputFocused) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSearchQuery(q);
        }
        if (pathname === "/search" && q) {
            if (typeof window !== "undefined" && window.innerWidth < 768) {
                setIsSearchOpen(true);
            }
        }
    }, [searchParams, pathname, searchQuery]);

    // Preserve focus during route transitions or layout shifts
    useEffect(() => {
        const activeEl = document.activeElement;
        const isMobileActive = activeEl && mobileInputRef.current && (activeEl === mobileInputRef.current || mobileInputRef.current.contains(activeEl));
        const isDesktopActive = activeEl && desktopInputRef.current && (activeEl === desktopInputRef.current || desktopInputRef.current.contains(activeEl));

        if (isMobileActive || isDesktopActive) {
            const focusTarget = isMobileActive ? mobileInputRef.current : desktopInputRef.current;
            if (focusTarget) {
                const handleFocus = () => {
                    if (focusTarget && document.activeElement !== focusTarget) {
                        focusTarget.focus();
                        // Maintain cursor position at the end of text
                        const val = focusTarget.value;
                        focusTarget.value = "";
                        focusTarget.value = val;
                    }
                };

                requestAnimationFrame(handleFocus);
                setTimeout(handleFocus, 50);
                setTimeout(handleFocus, 150);
            }
        }
    }, [pathname, searchParams]);

    // Close search/menu on route change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMobileMenuOpen(false);
        // Only close search if we're not on the search page
        if (pathname !== "/search") {
            setIsSearchOpen(false);
        }
    }, [pathname]);

    // Debounce updating the URL query param while typing to prevent race conditions
    useEffect(() => {
        const q = searchParams.get("q") || "";
        const queryVal = searchQuery.trim();

        if (queryVal === q.trim()) return;

        const timer = setTimeout(() => {
            if (queryVal) {
                if (pathname !== "/search") {
                    router.push(`/search?q=${encodeURIComponent(queryVal)}`, { scroll: false });
                } else {
                    router.replace(`/search?q=${encodeURIComponent(queryVal)}`, { scroll: false });
                }
            } else {
                if (pathname === "/search") {
                    router.replace("/search", { scroll: false });
                }
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, pathname, router, searchParams]);

    const handleSearch = (e?: React.FormEvent | React.MouseEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { scroll: false });
            setIsMobileMenuOpen(false);
            setIsSearchOpen(false);
        }
    };

    const handleSearchInputChange = (value: string) => {
        setSearchQuery(value);
        if (!value.trim()) {
            if (pathname === "/search") {
                router.replace("/search", { scroll: false });
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Movies", href: "/movies" },
        { name: "TV Shows", href: "/tv" },
        { name: "People", href: "/people" },
        { name: "Companies", href: "/companies" },
        { name: "Categories", href: "/categories" },
        { name: "Awards", href: "/awards" },
        { name: "My List", href: "/watchlist" },
    ];

    if (
        pathname?.startsWith("/person/") ||
        pathname?.startsWith("/watch/") ||
        pathname?.startsWith("/company/") ||
        pathname?.startsWith("/network/")
    ) {
        return null;
    }

    return (
        <nav
            className={cn(
                "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-fit transition-all duration-500 ease-in-out px-3 md:px-6 py-2 glass-pill",
                isScrolled ? "bg-black/60 shadow-2xl" : "bg-black/20",
                !isVisible && "-top-24"
            )}
        >
            <div className="flex items-center justify-between h-14">
                <AnimatePresence mode="wait">
                    {isSearchOpen ? (
                        <motion.div
                            key="search-bar"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex-1 flex items-center bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-2"
                        >
                            <button
                                onClick={() => {
                                    setIsSearchOpen(false);
                                    if (pathname === "/search") {
                                        router.back();
                                    }
                                }}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <input
                                ref={mobileInputRef}
                                autoFocus
                                type="text"
                                placeholder="Search titles, people, studios..."
                                value={searchQuery}
                                onChange={(e) => handleSearchInputChange(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="bg-transparent border-none outline-none text-white text-base w-full placeholder-gray-500 py-2"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => handleSearchInputChange("")}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="navbar-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-between w-full gap-4 md:gap-6 lg:gap-8 xl:gap-10"
                        >
                            <div className="flex items-center gap-2 md:gap-3.5 lg:gap-6 xl:gap-8 min-w-0">
                                <Link href="/" className="group flex-shrink-0 flex items-center">
                                    <span className="text-xl font-black tracking-tighter text-white">
                                        MEOW<span className="text-accent italic">LY</span>
                                    </span>
                                </Link>

                                <div className="hidden md:flex items-center gap-0.5 lg:gap-1 xl:gap-1.5 min-w-0 overflow-x-auto scrollbar-none py-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={cn(
                                                "text-[11px] lg:text-[13px] xl:text-[14px] font-semibold text-gray-400 hover:text-white px-1.5 lg:px-2 xl:px-3 py-1.5 rounded-full transition-all duration-300 whitespace-nowrap flex-shrink-0",
                                                pathname === link.href ? "bg-white/10 text-white" : ""
                                            )}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                                {/* Desktop Search */}
                                <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-2.5 md:px-3.5 py-1.5 focus-within:ring-1 focus-within:ring-accent/50 transition-all">
                                    <input
                                        ref={desktopInputRef}
                                        type="text"
                                        placeholder="Search titles, people, studios..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearchInputChange(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="bg-transparent border-none py-1 text-[13px] text-white placeholder-gray-500 outline-none w-20 md:w-24 lg:w-32 focus:w-40 lg:focus:w-48 transition-all duration-300"
                                    />
                                    <Search className="h-4 w-4 text-gray-500 cursor-pointer hover:text-white transition-colors ml-2" onClick={() => handleSearch()} />
                                </div>

                                {/* Surprise Me Button */}
                                <button
                                    disabled={isPending}
                                    onClick={() => startTransition(() => surpriseMe())}
                                    className={cn(
                                        "p-2 text-gray-400 hover:text-accent transition-all duration-300 rounded-full hover:bg-white/10 flex items-center justify-center",
                                        isPending && "animate-pulse opacity-50"
                                    )}
                                    title="Surprise Me"
                                >
                                    <Dices className={cn("h-5 w-5", isPending && "animate-spin-slow")} />
                                </button>

                                {/* PWA Install Action Icon */}
                                {pwaPrompt && (
                                    <button
                                        onClick={handlePwaInstall}
                                        className="p-2 text-gray-400 hover:text-accent transition-all duration-300 rounded-full hover:bg-white/10 flex items-center justify-center relative group"
                                        title="Install Meowly"
                                    >
                                        <Download className="h-5 w-5 animate-pulse text-amber-400" />
                                        <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-teal-400" />
                                    </button>
                                )}

                                {/* Mobile Search Toggle */}
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
                                >
                                    <Search className="h-5 w-5" />
                                </button>

                                <button
                                    className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="md:hidden absolute top-[calc(100%+12px)] left-0 w-full overflow-hidden bg-black/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-50 origin-top"
                    >
                        <div className="flex flex-col p-4 space-y-2">
                            {/* Mobile Links */}
                            <div className="grid grid-cols-1 gap-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={cn(
                                            "text-[16px] font-bold px-5 py-4 rounded-2xl transition-all duration-300 flex items-center justify-between group",
                                            pathname === link.href
                                                ? "bg-accent text-black"
                                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        )}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span>{link.name}</span>
                                        {pathname === link.href && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                                    </Link>
                                ))}

                                {/* PWA Install Button in Drawer */}
                                {pwaPrompt && (
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            handlePwaInstall();
                                        }}
                                        className="mt-3 text-[16px] font-bold px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-amber-400 hover:bg-white/10 hover:text-amber-300 transition-all duration-300 flex items-center justify-between group cursor-pointer"
                                    >
                                        <span>Install App Extension</span>
                                        <Download className="h-5 w-5 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
