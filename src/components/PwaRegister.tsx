"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Sparkles, MonitorPlay } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    deferredPrompt: any;
  }
}

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem(key);
      }
    } catch (e) {
      console.warn("localStorage.getItem failed:", e);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn("localStorage.setItem failed:", e);
    }
  }
};

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (typeof window !== "undefined") {
      // Check if already in standalone mode (installed) or previously saved
      const alreadyInstalled =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as any).standalone ||
        safeLocalStorage.getItem("pwa-installed") === "true";

      if (alreadyInstalled) {
        setIsInstalled(true);
      }

      // 1. Service Worker Registration
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
              console.log("[PWA] ServiceWorker registered with scope:", registration.scope);
            })
            .catch((err) => {
              console.warn("[PWA] ServiceWorker registration failed:", err);
            });
        });
      }

      // 2. BeforeInstallPrompt Handler
      const handleBeforeInstallPrompt = (e: Event) => {
        // Prevent default browser prompt
        e.preventDefault();
        // Save event
        window.deferredPrompt = e;
        setDeferredPrompt(e);

        // Notify other components (like Navbar)
        window.dispatchEvent(new CustomEvent("pwa-install-ready"));

        // Check if dismissed within cooldown period (15 days)
        const dismissedTimeStr = safeLocalStorage.getItem("pwa-prompt-dismissed-time");
        let isCooldownActive = false;
        if (dismissedTimeStr) {
          const dismissedTime = parseInt(dismissedTimeStr, 10);
          if (!isNaN(dismissedTime)) {
            const now = Date.now();
            const cooldownMs = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds
            if (now - dismissedTime < cooldownMs) {
              isCooldownActive = true;
            }
          }
        }

        // Wait 6 seconds, then show our custom glowing floating banner
        // only if not already installed and not currently in cooldown
        if (!isInstalled && !alreadyInstalled && !isCooldownActive) {
          timerId = setTimeout(() => {
            setShowPrompt(true);
          }, 6000);
        }
      };

      // 3. App Installed Handler
      const handleAppInstalled = () => {
        console.log("[PWA] App was successfully installed!");
        setIsInstalled(true);
        safeLocalStorage.setItem("pwa-installed", "true");
        setShowPrompt(false);
        window.deferredPrompt = null;
        setDeferredPrompt(null);
        window.dispatchEvent(new CustomEvent("pwa-installed"));
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("appinstalled", handleAppInstalled);
        if (timerId) clearTimeout(timerId);
      };
    }
  }, [isInstalled]);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.deferredPrompt;
    if (!promptEvent) return;

    // Show native installation prompt
    promptEvent.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await promptEvent.userChoice;
    console.log(`[PWA] User response to install prompt: ${outcome}`);

    if (outcome === "accepted") {
      safeLocalStorage.setItem("pwa-installed", "true");
      setIsInstalled(true);
    } else {
      // User cancelled/dismissed the native installation prompt.
      // Treat as a dismissal cooldown so we don't bug them immediately again.
      safeLocalStorage.setItem("pwa-prompt-dismissed-time", Date.now().toString());
    }

    // Clean up
    window.deferredPrompt = null;
    setDeferredPrompt(null);
    setShowPrompt(false);
    window.dispatchEvent(new CustomEvent("pwa-installed"));
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    safeLocalStorage.setItem("pwa-prompt-dismissed-time", Date.now().toString());
  };

  // Do not render anything if conditions are not met
  return (
    <AnimatePresence>
      {showPrompt && !isInstalled && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100vw-32px)] overflow-hidden rounded-3xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl p-5"
        >
          {/* Neon Glow Highlight lines */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-teal-500 via-white/50 to-amber-500 opacity-60" />

          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-4">
            {/* Custom Icon Container */}
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-amber-500/10 opacity-30" />
              <MonitorPlay className="h-6 w-6 text-white" />
            </div>

            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">APP DETECTED</span>
                <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1 tracking-tight">
                Install Meowly Cinema
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Add to your home screen for high-res offline layouts, standalone fullscreen, and faster playback.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3.5 mt-5">
            <button
              onClick={handleDismiss}
              className="text-xs font-bold text-gray-400 hover:text-white px-3.5 py-2.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            >
              Maybe Later
            </button>
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 bg-white text-black font-bold text-xs px-5 py-2.5 rounded-full hover:bg-gray-200 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Install App
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
