
import React from 'react';
import Link from 'next/link';
import { Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="mt-12 py-6 border-t border-gray-800 bg-prime-dark text-center text-sm text-gray-400">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Left: Brand & Links */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                    <span className="font-bold tracking-tighter text-prime-blue uppercase">
                        Meow<span className="text-white">flix</span>
                    </span>
                    <nav className="flex gap-4">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <Link href="/dmca" className="hover:text-white transition-colors">DMCA</Link>
                    </nav>
                </div>

                {/* Middle: Disclaimer (Hidden on very small screens or abbreviated) */}
                <p className="text-xs text-gray-600 max-w-md hidden md:block text-center mx-auto leading-tight">
                    Meowflix does not host any content on our servers.
                </p>

                {/* Right: Credits */}
                <div className="flex items-center gap-2 text-xs">
                    <span>
                        &copy; {new Date().getFullYear()} <span className="hidden sm:inline">•</span> Made by <span className="text-gray-300 font-medium">Utkarsh Gupta</span>
                    </span>
                    <a
                        href="https://github.com/utkarshgupta188"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                        aria-label="GitHub"
                    >
                        <Github className="w-4 h-4 ml-1" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
