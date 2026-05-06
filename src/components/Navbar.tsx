"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Menu, X, ArrowLeft, Dices } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { surpriseMe } from "@/app/actions";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = React.useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            
            setLastScrollY(currentScrollY);
            
            if (currentScrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Sync search query with URL
    useEffect(() => {
        const q = searchParams.get("q");
        if (q) {
            setSearchQuery(q);
        }
    }, [searchParams]);

    // Close search/menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        // Only close search if we're not on the search page
        if (pathname !== "/search") {
            setIsSearchOpen(false);
        }
    }, [pathname]);

    const handleSearch = (e?: React.FormEvent | React.MouseEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false);
            setIsSearchOpen(false);
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
        { name: "My List", href: "/watchlist" },
        { name: "Categories", href: "/categories" },
        { name: "Awards", href: "/awards" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-500 ease-in-out px-6 py-2 glass-pill",
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
                                onClick={() => setIsSearchOpen(false)}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search titles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="bg-transparent border-none outline-none text-white text-base w-full placeholder-gray-500 py-2"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
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
                            className="flex items-center justify-between w-full gap-4"
                        >
                            <div className="flex items-center gap-4 lg:gap-8 min-w-0">
                                <Link href="/" className="group flex-shrink-0 flex items-center">
                                    <span className="text-xl font-black tracking-tighter text-white">
                                        MEOW<span className="text-accent italic">LY</span>
                                    </span>
                                </Link>

                                <div className="hidden md:flex items-center gap-0.5 lg:gap-1 min-w-0 overflow-hidden">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={cn(
                                                "text-[13px] lg:text-[14px] font-semibold text-gray-400 hover:text-white px-2 lg:px-3 py-1.5 rounded-full transition-all duration-300 whitespace-nowrap flex-shrink-0",
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
                                <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 focus-within:ring-1 focus-within:ring-accent/50 transition-all">
                                    <input
                                        type="text"
                                        placeholder="Search Meowly..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="bg-transparent border-none py-1 text-[13px] text-white placeholder-gray-500 outline-none w-32 focus:w-48 transition-all duration-300"
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
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
