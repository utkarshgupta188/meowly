"use client";

import React, { useState, useEffect } from "react";
import { Keyboard, X, Play, RefreshCcw, Share2, Maximize2, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShortcutsHUD() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener("openShortcutsHUD", handleOpen);
        return () => window.removeEventListener("openShortcutsHUD", handleOpen);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Do not trigger shortcuts when user is typing in inputs or textareas
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLSelectElement
            ) {
                return;
            }

            if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            } else if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            } else if (e.key === "Space" || e.code === "Space") {
                // Let VideoPlayer focus logic handle space, but we list it in shortcuts
            } else {
                // Delegate keys to active video player page if active
                const keyUpper = e.key.toUpperCase();
                if (keyUpper === "T") {
                    window.dispatchEvent(new CustomEvent("playerToggleTheater"));
                } else if (keyUpper === "R") {
                    window.dispatchEvent(new CustomEvent("playerReload"));
                } else if (keyUpper === "S") {
                    window.dispatchEvent(new CustomEvent("playerShare"));
                } else if (/^[1-9]$/.test(e.key)) {
                    window.dispatchEvent(
                        new CustomEvent("playerSelectServer", {
                            detail: { index: parseInt(e.key, 10) - 1 }
                        })
                    );
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ type: "spring", duration: 0.4 }}
                        className="relative w-full max-w-lg bg-[#0e1420] border border-white/10 rounded-2xl p-6 shadow-2xl text-left text-gray-200"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
                            <div className="flex items-center space-x-3 text-accent">
                                <Keyboard className="h-6 w-6" />
                                <h2 className="text-lg font-bold tracking-wide uppercase">Keyboard Shortcuts</h2>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Shortcuts Grid */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-accent uppercase tracking-wider">General</h3>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Toggle Shortcuts Menu</span>
                                        <kbd className="px-2.5 py-1 text-xs font-bold bg-white/15 border border-white/20 rounded shadow-md text-white">?</kbd>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Close Menu / Back</span>
                                        <kbd className="px-2.5 py-1 text-xs font-bold bg-white/15 border border-white/20 rounded shadow-md text-white">Esc</kbd>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-accent uppercase tracking-wider">Player Controls</h3>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Focus Player</span>
                                        <kbd className="px-2.5 py-1 text-xs font-bold bg-white/15 border border-white/20 rounded shadow-md text-white">Space</kbd>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Toggle Theater Mode</span>
                                        <kbd className="px-2.5 py-1 text-xs font-bold bg-white/15 border border-white/20 rounded shadow-md text-white">T</kbd>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Reload Player</span>
                                        <kbd className="px-2.5 py-1 text-xs font-bold bg-white/15 border border-white/20 rounded shadow-md text-white">R</kbd>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Copy Share Link</span>
                                        <kbd className="px-2.5 py-1 text-xs font-bold bg-white/15 border border-white/20 rounded shadow-md text-white">S</kbd>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Switch Sources</span>
                                        <kbd className="px-2.5 py-1 text-xs font-bold bg-white/15 border border-white/20 rounded shadow-md text-white">1 - 9</kbd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Tips */}
                        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-gray-500">
                            Keyboard events require focus to be outside of the video player frame to work. Click the background to unfocus the iframe player.
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
