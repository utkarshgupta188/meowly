"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Bookmark, ExternalLink, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DomainRedirectPopup() {
  const [show, setShow] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hostname = window.location.hostname;
    // Show only if the hostname is the old vercel domain
    if (hostname === "meowly.vercel.app") {
      // Calculate destination URL preserving the current path, query parameters, and hashes
      const destination = `https://meowly.qzz.io${window.location.pathname}${window.location.search}${window.location.hash}`;
      setNewUrl(destination);
      setShow(true);

      // Countdown to auto-redirect
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = destination;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, []);

  const handleRedirectClick = () => {
    if (newUrl) {
      window.location.href = newUrl;
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative max-w-lg w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-8 shadow-2xl text-center"
        >
          {/* Top glowing ambient accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gradient-to-r from-accent via-white to-teal-500 opacity-70 blur-[1px]" />
          
          {/* Sparkly brand icon container */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative mb-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-teal-500/20 opacity-40" />
            <Sparkles className="h-8 w-8 text-accent animate-pulse" />
          </div>

          <span className="text-[11px] font-bold tracking-widest uppercase text-accent mb-2 block">
            IMPORTANT UPDATE
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white mb-3">
            Meowly Has Moved!
          </h2>
          
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Our site URL has officially changed. We have migrated to a brand-new, ultra-fast custom domain for a superior streaming experience.
          </p>

          {/* Glowing URL Box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex flex-col items-center justify-center relative group">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              NEW OFFICIAL ADDRESS
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white group-hover:text-accent transition-colors">
                meowly.qzz.io
              </span>
              <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-accent transition-colors" />
            </div>
            
            {/* Bookmark reminder notification */}
            <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
              <Bookmark className="h-3 w-3" />
              <span>Please save & bookmark this new URL!</span>
            </div>
          </div>

          {/* Auto Redirect text */}
          <p className="text-xs text-gray-500 mb-6">
            Redirecting you automatically in{" "}
            <span className="font-bold text-white text-sm bg-white/5 px-2 py-0.5 rounded-md border border-white/10 mx-1">
              {countdown}
            </span>{" "}
            seconds...
          </p>

          {/* Redirect Button */}
          <button
            onClick={handleRedirectClick}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-accent to-amber-500 text-black font-extrabold text-sm py-4 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all duration-300 shadow-xl shadow-accent/15 cursor-pointer"
          >
            <span>Proceed to New Domain</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
