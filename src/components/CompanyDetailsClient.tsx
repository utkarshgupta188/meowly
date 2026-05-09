"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Globe, Film, Tv, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Movie, TMDB_CONFIG } from "@/lib/tmdb";
import MovieCard from "./MovieCard";
import { cn } from "@/lib/utils";

interface CompanyDetailsClientProps {
    company: any;
    movies: Movie[];
    tvShows: Movie[];
    backdropUrl: string | null;
}

export default function CompanyDetailsClient({
    company,
    movies,
    tvShows,
    backdropUrl,
}: CompanyDetailsClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"movie" | "tv">("movie");

    const displayedItems = activeTab === "movie" ? movies : tvShows;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-accent selection:text-black">
            {/* Cinematic Hero Backdrop */}
            <div className="relative w-full min-h-[40vh] sm:min-h-[45vh] md:min-h-[50vh] overflow-hidden flex items-end">
                <div className="absolute inset-0 z-0">
                    {backdropUrl ? (
                        <img
                            src={backdropUrl}
                            alt={company.name}
                            className="w-full h-full object-cover opacity-35 blur-[2px] scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 via-black to-black" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pb-10 pt-24">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-end text-center md:text-left">
                        {/* Company Logo Display */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-36 h-36 md:w-44 md:h-44 bg-white/90 p-4 rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 hover:scale-105 transition-transform"
                        >
                            {company.logo_path ? (
                                <img
                                    src={`${TMDB_CONFIG.imageBase}/w500${company.logo_path}`}
                                    alt={company.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <Film className="w-16 h-16 text-gray-400" />
                            )}
                        </motion.div>

                        {/* Company Info */}
                        <div className="flex-1 space-y-4">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-accent text-xs font-black uppercase tracking-[0.3em]"
                            >
                                Production Studio
                            </motion.span>
                            
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <button
                                    onClick={() => router.back()}
                                    className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 group border border-white/10 shadow-lg"
                                    title="Go Back"
                                >
                                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none"
                                >
                                    {company.name}
                                </motion.h1>
                            </div>

                            {/* Metadata */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap gap-4 items-center justify-center md:justify-start text-sm text-gray-300"
                            >
                                {company.headquarters && (
                                    <div className="flex items-center gap-1.5 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                        <MapPin className="w-4 h-4 text-accent" />
                                        <span>{company.headquarters}</span>
                                    </div>
                                )}
                                {company.origin_country && (
                                    <div className="flex items-center gap-1.5 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                        <span className="text-[10px] font-black uppercase text-gray-400">Country:</span>
                                        <span className="font-bold">{company.origin_country}</span>
                                    </div>
                                )}
                                {company.homepage && (
                                    <a
                                        href={company.homepage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 hover:border-accent/50 backdrop-blur-md transition-all text-accent font-semibold"
                                    >
                                        <Globe className="w-4 h-4" />
                                        <span>Website</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs and content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 mt-8">
                {/* Custom sliding tabs */}
                <div className="flex justify-center md:justify-start border-b border-white/10 pb-4 mb-8">
                    <div className="flex gap-4 p-1 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
                        <button
                            onClick={() => setActiveTab("movie")}
                            className={cn(
                                "relative px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center gap-2",
                                activeTab === "movie" ? "text-black bg-accent shadow-lg shadow-accent/20" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <Film className="w-4 h-4" />
                            <span>Movies</span>
                            <span className={cn(
                                "text-xs rounded-md px-1.5 py-0.5",
                                activeTab === "movie" ? "bg-black/15 text-black" : "bg-white/10 text-gray-400"
                            )}>
                                {movies.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab("tv")}
                            className={cn(
                                "relative px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center gap-2",
                                activeTab === "tv" ? "text-black bg-accent shadow-lg shadow-accent/20" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <Tv className="w-4 h-4" />
                            <span>TV Shows</span>
                            <span className={cn(
                                "text-xs rounded-md px-1.5 py-0.5",
                                activeTab === "tv" ? "bg-black/15 text-black" : "bg-white/10 text-gray-400"
                            )}>
                                {tvShows.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Staggered Grid Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {displayedItems.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {displayedItems.map((item) => (
                                    <MovieCard key={item.id} movie={item} isFluid={true} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                                <Film className="w-16 h-16 mb-4 stroke-[1.5] text-gray-600" />
                                <p className="text-lg font-semibold">No {activeTab === "movie" ? "movies" : "TV shows"} found</p>
                                <p className="text-sm text-gray-600">This studio hasn't released any cataloged {activeTab === "movie" ? "movies" : "TV shows"} on TMDB.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
