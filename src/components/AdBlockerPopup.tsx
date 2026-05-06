"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, ExternalLink, Sparkles, Check, Monitor, Smartphone, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
const AdGuardLogo = () => (
    <svg className="w-7 h-7" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="adguard-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2cb36c" />
                <stop offset="100%" stopColor="#1a8c50" />
            </linearGradient>
        </defs>
        <path 
            d="M50 12 L82 24 C82 52, 68 76, 50 88 C32 76, 18 52, 18 24 Z" 
            fill="url(#adguard-grad)" 
        />
        <path 
            d="M36 48 L46 58 L64 36" 
            stroke="white" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
        />
    </svg>
);

export default function AdBlockerPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"desktop" | "mobile">("desktop");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // 1. Detect Device Type (Desktop vs Mobile)
        if (typeof window !== "undefined") {
            const ua = navigator.userAgent.toLowerCase();
            const isMobileUA = /mobile|android|iphone|ipad|phone/i.test(ua);
            const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
            
            if (isMobileUA || (isTouch && window.innerWidth < 1024)) {
                setActiveTab("mobile");
            } else {
                setActiveTab("desktop");
            }
        }

        // 2. Check if the user has already dismissed the popup
        const isDismissed = localStorage.getItem("meowly_adblock_dismissed");
        if (isDismissed !== "true") {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 2500); // Elegant delay of 2.5s after site loads
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsOpen(false);
        localStorage.setItem("meowly_adblock_dismissed", "true");
    };

    const copyDNS = () => {
        navigator.clipboard.writeText("dns.adguard.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Premium dark backdrop to dim background content and pull intense focus */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleDismiss}
                        className="fixed inset-0 bg-black/75 backdrop-blur-md z-[9998]"
                    />

                    {/* Centered Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999] pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            className={cn(
                                "pointer-events-auto w-full max-w-[420px] relative overflow-hidden",
                                "bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] p-6 z-[9999]"
                            )}
                        >
                            {/* Glowing Accent Ring */}
                            <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none ring-1 ring-white/10" />

                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/15 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0 relative">
                                        <Shield className="w-5 h-5" />
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 leading-tight">
                                            AdBlocker Advisory
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                                        </h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Recommended Setup</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDismiss}
                                    className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                                    aria-label="Dismiss warning"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Introduction Message */}
                            <p className="text-xs text-gray-300 leading-relaxed mb-4 text-left">
                                External video servers show aggressive popup ads. We highly recommend using <span className="text-emerald-400 font-semibold">AdGuard</span> to block them completely.
                            </p>

                            {/* Conditional Instruction Content */}
                            <div className="space-y-3.5">
                                {activeTab === "desktop" ? (
                                    <div className="space-y-3">
                                        <div className="text-[10px] font-black uppercase text-gray-500 tracking-wider text-left">Highly Recommended Extension</div>
                                        
                                        <a
                                            href="https://chromewebstore.google.com/detail/adguard-adblocker/bgnkhhnnamicmpeenaelnjfhikgbkllg?hl=en"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex flex-col p-4 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/15 hover:border-emerald-500/30 rounded-2xl transition-all duration-300 active:scale-[0.98] text-left gap-3 relative overflow-hidden"
                                        >
                                            {/* Decorative glowing corner */}
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-300 pointer-events-none" />

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="shrink-0 drop-shadow-[0_4px_10px_rgba(44,179,108,0.25)] group-hover:scale-105 transition-transform duration-300">
                                                        <AdGuardLogo />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-white leading-tight">AdGuard AdBlocker</span>
                                                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">Official Chrome extension</span>
                                                    </div>
                                                </div>
                                                <div className="p-2 bg-white/5 group-hover:bg-emerald-500/10 text-gray-400 group-hover:text-emerald-400 rounded-xl border border-white/5 group-hover:border-emerald-500/10 transition-all">
                                                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </div>

                                            <p className="text-xs text-gray-400 leading-normal border-t border-white/5 pt-2.5">
                                                Blocks all video ads, redirects, and aggressive popup windows on your browser.
                                            </p>
                                        </a>
                                    </div>
                                ) : (
                                    <div className="space-y-3 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Private DNS Setup</span>
                                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-extrabold uppercase px-1.5 py-0.5 rounded border border-emerald-500/15">
                                                No Apps Needed
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-300 leading-normal text-left">
                                            Block redirects and popup ads system-wide on mobile with zero app installations.
                                        </p>
                                        
                                        {/* Copy Block */}
                                        <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-lg p-2">
                                            <div className="flex flex-col text-left">
                                                <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">DNS Server Address</span>
                                                <span className="text-xs font-mono font-bold text-white tracking-wide selection:bg-emerald-500/20">dns.adguard.com</span>
                                            </div>
                                            <button
                                                onClick={copyDNS}
                                                className={cn(
                                                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all active:scale-95 cursor-pointer",
                                                    copied ? "bg-emerald-500 text-black font-black" : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                                )}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="w-3 h-3" />
                                                        <span>Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3 text-gray-400" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Instruction Steps */}
                                        <div className="space-y-2 border-t border-white/5 pt-2.5 text-left">
                                            <div className="flex gap-2.5 items-start">
                                                <div className="w-4 h-4 rounded bg-white/5 flex items-center justify-center text-[10px] font-black text-emerald-400 shrink-0 mt-0.5">A</div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-gray-200">Android Setup</span>
                                                    <p className="text-[10px] text-gray-400 leading-relaxed">
                                                        Connections &rarr; Private DNS &rarr; select Hostname &rarr; Paste DNS.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2.5 items-start mt-2">
                                                <div className="w-4 h-4 rounded bg-white/5 flex items-center justify-center text-[10px] font-black text-emerald-400 shrink-0 mt-0.5">I</div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-gray-200">iOS (iPhone / iPad) Setup</span>
                                                    <p className="text-[10px] text-gray-400 leading-relaxed">
                                                        Visit <a href="https://adguard-dns.io/en/public-dns.html" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-semibold inline-flex items-center gap-0.5">adguard-dns.io<ExternalLink className="w-2.5 h-2.5 inline" /></a> &rarr; Public DNS &rarr; iOS &rarr; Download & enable Profile.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CTA Footer Actions */}
                            <div className="flex items-center gap-3 mt-5">
                                <button
                                    onClick={handleDismiss}
                                    className="flex-1 px-4 py-2.5 bg-white text-black hover:bg-gray-100 active:scale-[0.98] rounded-xl font-bold text-xs transition-all cursor-pointer text-center"
                                >
                                    I have an AdBlocker
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
