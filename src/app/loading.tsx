import React from "react";
import { MovieRowSkeleton } from "@/components/Skeleton";

export default function Loading() {
    return (
        <main className="min-h-screen bg-black overflow-hidden">
            {/* Navbar Placeholder */}
            <div className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent z-50 px-8 flex items-center justify-between">
                <div className="h-8 w-32 bg-white/5 animate-pulse rounded-md" />
                <div className="flex space-x-6">
                    <div className="h-4 w-16 bg-white/5 animate-pulse rounded-md" />
                    <div className="h-4 w-16 bg-white/5 animate-pulse rounded-md" />
                    <div className="h-4 w-16 bg-white/5 animate-pulse rounded-md" />
                </div>
            </div>

            {/* Hero Skeleton */}
            <div className="relative w-full h-[85vh] bg-prime-dark/40 animate-pulse">
                <div className="absolute bottom-20 left-12 space-y-6 w-full max-w-2xl">
                    <div className="h-16 w-3/4 bg-white/5 rounded-2xl" />
                    <div className="flex space-x-4">
                        <div className="h-4 w-24 bg-white/5 rounded-md" />
                        <div className="h-4 w-24 bg-white/5 rounded-md" />
                    </div>
                    <div className="h-20 w-full bg-white/5 rounded-2xl" />
                    <div className="flex space-x-4 pt-4">
                        <div className="h-12 w-32 bg-white/10 rounded-full" />
                        <div className="h-12 w-32 bg-white/5 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Rows Skeletons */}
            <div className="relative z-40 -mt-20 space-y-8">
                <MovieRowSkeleton />
                <MovieRowSkeleton />
                <MovieRowSkeleton />
            </div>
        </main>
    );
}
