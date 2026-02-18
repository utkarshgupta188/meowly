"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

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

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false);
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Movies", href: "/movies" },
        { name: "TV Shows", href: "/tv" },
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
                <div className="flex items-center space-x-12">
                    <Link href="/" className="group flex items-center space-x-1">
                        <span className="text-2xl font-bold tracking-tighter text-white group-hover:scale-105 transition-transform duration-300">
                            meow<span className="text-prime-blue italic">flix</span>
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

                <div className="flex items-center space-x-4">
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

                    <div className="flex items-center">
                        <button
                            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-prime-dark absolute top-full left-0 w-full p-4 border-t border-gray-800 animate-in fade-in slide-in-from-top-1">
                    <div className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-medium text-gray-300 hover:text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
