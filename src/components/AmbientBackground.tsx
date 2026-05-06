"use client";

import React from "react";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] animate-hue-shift" aria-hidden="true">
      {/* Aurora Colored Blobs */}
      <div className="absolute top-[5%] left-[5%] w-[35vw] h-[35vw] rounded-full bg-indigo-500/14 blur-[100px] animate-breathe-one" />
      <div className="absolute top-[25%] right-[5%] w-[30vw] h-[30vw] rounded-full bg-cyan-400/12 blur-[90px] animate-breathe-two" />
      <div className="absolute bottom-[5%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-rose-500/12 blur-[100px] animate-breathe-three" />
      <div className="absolute bottom-[20%] right-[15%] w-[28vw] h-[28vw] rounded-full bg-emerald-500/10 blur-[90px] animate-breathe-four" />

      {/* Subtle radial overlay for a touch of cinematic framing */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40" />
    </div>
  );
}
