"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Menu, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

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

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e?: React.FormEvent | React.KeyboardEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false);
            setIsSearchOpen(false);
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Movies", href: "/movies" },
        { name: "TV Shows", href: "/tv" },
        { name: "My List", href: "/watchlist" },
        { name: "Categories", href: "/categories" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out px-4 md:px-12 py-3",
                isScrolled ? "bg-prime-dark/95 backdrop-blur-sm shadow-xl" : "bg-transparent prime-nav-gradient"
            )}
        >
            <div className="flex items-center justify-between h-14">
                <AnimatePresence mode="wait">
                    {isSearchOpen ? (
                        <motion.div
                            key="search-bar"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex-1 flex items-center bg-prime-card/95 border border-white/10 rounded-full px-4 py-2"
                        >
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="mr-2 text-gray-400 hover:text-white"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search movies, TV shows..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="bg-transparent border-none outline-none text-white text-base w-full placeholder-gray-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="ml-2 text-gray-400 hover:text-white"
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
                            className="flex items-center justify-between w-full"
                        >
                            <div className="flex items-center space-x-12">
                                <Link href="/" className="group flex items-center space-x-1">
                                    <span className="text-2xl font-bold tracking-tighter text-white group-hover:scale-105 transition-transform duration-300">
                                        meow<span className="text-prime-blue italic">ly</span>
                                    </span>
                                </Link>

                                <div className="hidden lg:flex items-center space-x-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="text-[17px] font-medium text-gray-300 hover:text-white px-4 py-2 rounded-md hover:bg-white/10 transition-all duration-300"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 md:space-x-4">
                                {/* Desktop Search */}
                                <div className="relative group hidden md:block">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-prime-blue transition-colors duration-300" />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearch}
                                        className="bg-prime-card/80 border border-gray-700/50 focus:border-white/50 rounded-lg py-2 pl-11 pr-4 text-[15px] text-white placeholder-gray-400 outline-none w-64 lg:w-72 transition-all duration-300 focus:bg-prime-hover focus:shadow-lg focus:ring-1 focus:ring-white/10"
                                    />
                                </div>

                                {/* Mobile Search Toggle */}
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <Search className="h-6 w-6" />
                                </button>

                                <button
                                    className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
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
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-prime-dark/95 backdrop-blur-md absolute top-full left-0 w-full overflow-hidden border-t border-gray-800/50"
                    >
                        <div className="flex flex-col space-y-6 p-6">
                            {/* Mobile Search In Menu */}
                            <form 
                                onSubmit={handleSearch}
                                className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                            >
                                <Search className="h-5 w-5 text-gray-400 mr-3" />
                                <input
                                    type="text"
                                    placeholder="Search everything..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none outline-none text-white text-lg w-full placeholder-gray-500"
                                />
                            </form>

                            {/* Mobile Links */}
                            <div className="flex flex-col space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={cn(
                                            "text-xl font-semibold px-4 py-3 rounded-xl transition-all duration-300",
                                            pathname === link.href 
                                                ? "bg-prime-blue text-white shadow-lg shadow-prime-blue/20" 
                                                : "text-gray-300 hover:bg-white/5 hover:text-white"
                                        )}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
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
