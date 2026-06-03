"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

export default function FlyingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const handleFly = (e: CustomEvent<{ startX: number; startY: number }>) => {
      const watchlistEl = document.getElementById("nav-watchlist");
      if (!watchlistEl) return;

      const rect = watchlistEl.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      const newParticle: Particle = {
        id: Date.now() + Math.random(),
        startX: e.detail.startX,
        startY: e.detail.startY,
        targetX,
        targetY,
      };

      setParticles((prev) => [...prev, newParticle]);
    };

    window.addEventListener("watchlistFlyEffect" as any, handleFly);
    return () => window.removeEventListener("watchlistFlyEffect" as any, handleFly);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              x: p.startX - 10,
              y: p.startY - 10,
              scale: 1,
              opacity: 1,
              filter: "drop-shadow(0 0 10px rgba(255, 159, 28, 0.8))"
            }}
            animate={{
              x: [p.startX - 10, (p.startX + p.targetX) / 2 - 40, p.targetX - 10],
              y: [p.startY - 10, (p.startY + p.targetY) / 2 - 80, p.targetY - 10],
              scale: [1, 1.6, 0.4],
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.1,
              ease: [0.25, 1, 0.5, 1]
            }}
            onAnimationComplete={() => {
              setParticles((prev) => prev.filter((item) => item.id !== p.id));
              // Trigger simple subtle scale pop on target element
              const watchlistEl = document.getElementById("nav-watchlist");
              if (watchlistEl) {
                watchlistEl.animate([
                  { transform: "scale(1)" },
                  { transform: "scale(1.2)", color: "#ff9f1c" },
                  { transform: "scale(1)" }
                ], { duration: 300 });
              }
            }}
            className="absolute text-xl leading-none select-none text-accent"
          >
            🐾
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
