"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, RefreshCw, Film, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const goOnline = () => setIsOnline(true);
      const goOffline = () => setIsOnline(false);

      window.addEventListener("online", goOnline);
      window.addEventListener("offline", goOffline);

      return () => {
        window.removeEventListener("online", goOnline);
        window.removeEventListener("offline", goOffline);
      };
    }
  }, []);

  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden bg-black text-white">
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[200px] h-[200px] bg-white/[0.01] rounded-full blur-[80px] pointer-events-none" />

      <div className="z-10 max-w-lg w-full text-center flex flex-col items-center">
        {/* Animated Radar Radar Glow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center justify-center w-24 h-24 mb-8"
        >
          {/* Pulsing ripples */}
          <div className="absolute inset-0 border border-white/20 rounded-full animate-ping opacity-25" style={{ animationDuration: "3s" }} />
          <div className="absolute -inset-4 border border-white/10 rounded-full animate-ping opacity-15" style={{ animationDuration: "4s" }} />
          <div className="absolute -inset-8 border border-white/5 rounded-full animate-ping opacity-10" style={{ animationDuration: "5s" }} />

          {/* Icon Container */}
          <div className="relative flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 backdrop-blur-md rounded-full shadow-2xl">
            <WifiOff className="h-10 w-10 text-white opacity-80" />
          </div>
        </motion.div>

        {/* Brand */}
        <div className="flex items-center gap-1.5 mb-4 opacity-40">
          <Film className="h-4 w-4" />
          <span className="text-xs font-black tracking-widest uppercase">MEOWLY CINEMA</span>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-shadow-lg"
        >
          Cinema Signal Lost
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-sm"
        >
          {isOnline 
            ? "Your connection seems to have stabilized! Click retry to resume streaming."
            : "We can't reach our media servers right now. Please grab some popcorn and check your internet connection."}
        </motion.p>

        {/* Diagnostic Tips Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full bg-white/[0.02] border border-white/5 backdrop-blur-sm rounded-3xl p-6 mb-8 text-left"
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3.5">Troubleshooting</h2>
          <ul className="space-y-2.5 text-xs text-gray-400">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 flex-shrink-0" />
              <span>Verify that your Wi-Fi or mobile data is turned on.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 flex-shrink-0" />
              <span>Ensure airplane mode is deactivated.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 flex-shrink-0" />
              <span>Install the Meowly app from the install button to ensure offline layouts cache correctly!</span>
            </li>
          </ul>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3.5 w-full justify-center"
        >
          <button
            onClick={handleRetry}
            className="flex items-center justify-center gap-2.5 bg-white text-black font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-gray-200 active:scale-95 transition-all duration-300 shadow-xl cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 animate-spin-slow" />
            Retry Connection
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 text-white font-semibold text-sm px-6 py-3.5 rounded-full active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
