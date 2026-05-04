"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden">
            {/* Cinematic Ambient Background - Multi-layered for depth */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FBBF24]/[0.03] rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FBBF24]/[0.05] rounded-full blur-[60px]" />
            </div>

            {/* Subtle Film Grain Effect */}
            <div 
                className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
                style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                }} 
            />

            <div className="relative flex flex-col items-center">
                {/* Triple Bar Loader - Enhanced Sequenced Heights (l7 Logic) */}
                <div className="flex items-center space-x-3 h-14">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ height: "50%" }}
                            animate={{ 
                                height: [
                                    "50%",                                      // 0%
                                    i === 0 ? "20%" : "50%",                   // 20%
                                    i === 0 ? "100%" : i === 1 ? "20%" : "50%", // 40%
                                    i === 0 ? "50%" : i === 1 ? "100%" : "20%", // 60%
                                    i === 1 ? "50%" : i === 2 ? "100%" : "50%", // 80%
                                    "50%"                                       // 100%
                                ],
                                opacity: [0.4, 1, 0.4]
                            }}
                            transition={{ 
                                duration: 1.4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                            }}
                            className="w-3 bg-[#FBBF24] rounded-full shadow-[0_0_25px_rgba(251,191,36,0.25)] relative overflow-hidden"
                        >
                            {/* Inner Shimmer Sweep */}
                            <motion.div 
                                animate={{ top: ["-100%", "100%"] }}
                                transition={{ 
                                    duration: 1.2, 
                                    repeat: Infinity, 
                                    ease: "linear",
                                    delay: i * 0.2
                                }}
                                className="absolute inset-0 w-full bg-gradient-to-b from-transparent via-white/40 to-transparent"
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Ground Reflection / Glow Shadow */}
                <motion.div 
                    animate={{ 
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                        duration: 1.4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="mt-6 w-20 h-1 bg-[#FBBF24]/20 blur-[8px] rounded-full"
                />

                {/* Subtle Brand Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.6, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-12 flex flex-col items-center"
                >
                    <div className="text-sm font-black tracking-[0.2em] text-white uppercase opacity-80">
                        MEOW<span className="text-[#FBBF24] italic">LY</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
