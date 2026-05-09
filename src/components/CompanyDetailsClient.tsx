"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Globe, Film, Tv, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Movie, TMDB_CONFIG } from "@/lib/tmdb";
import MovieCard from "./MovieCard";
import { cn } from "@/lib/utils";
import { getDiscoverByCompanyAction } from "@/app/actions";

interface CompanyDetailsClientProps {
    company: any;
    movies: Movie[];
    tvShows: Movie[];
    backdropUrl: string | null;
    moviesTotalResults?: number;
    tvShowsTotalResults?: number;
    moviesTotalPages?: number;
    tvShowsTotalPages?: number;
}

export default function CompanyDetailsClient({
    company,
    movies,
    tvShows,
    backdropUrl,
    moviesTotalResults = 0,
    tvShowsTotalResults = 0,
    moviesTotalPages = 1,
    tvShowsTotalPages = 1,
}: CompanyDetailsClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"movie" | "tv">("movie");
    const [loadedMovies, setLoadedMovies] = useState<Movie[]>(movies);
    const [loadedTvShows, setLoadedTvShows] = useState<Movie[]>(tvShows);
    const [moviePage, setMoviePage] = useState(1);
    const [tvPage, setTvPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLoadedMovies(movies);
        setLoadedTvShows(tvShows);
        setMoviePage(1);
        setTvPage(1);
    }, [company.id, movies, tvShows]);

    const handleLoadMore = async () => {
        if (isLoadingMore) return;
        setIsLoadingMore(true);

        const nextPage = activeTab === "movie" ? moviePage + 1 : tvPage + 1;

        try {
            const data = await getDiscoverByCompanyAction(company.id, activeTab, nextPage);
            if (data && data.results && data.results.length > 0) {
                if (activeTab === "movie") {
                    setLoadedMovies((prev) => {
                        const existingIds = new Set(prev.map(item => item.id));
                        const uniqueNew = data.results.filter(item => !existingIds.has(item.id));
                        return [...prev, ...uniqueNew];
                    });
                    setMoviePage(nextPage);
                } else {
                    setLoadedTvShows((prev) => {
                        const existingIds = new Set(prev.map(item => item.id));
                        const uniqueNew = data.results.filter(item => !existingIds.has(item.id));
                        return [...prev, ...uniqueNew];
                    });
                    setTvPage(nextPage);
                }
            }
        } catch (error) {
            console.error("Failed to load more:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const displayedItems = activeTab === "movie" ? loadedMovies : loadedTvShows;
    const totalResults = activeTab === "movie" ? (moviesTotalResults || movies.length) : (tvShowsTotalResults || tvShows.length);
    const totalPages = activeTab === "movie" ? (moviesTotalPages || 1) : (tvShowsTotalPages || 1);
    const currentPage = activeTab === "movie" ? moviePage : tvPage;
    const hasMore = currentPage < totalPages && displayedItems.length < totalResults;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    handleLoadMore();
                }
            },
            { threshold: 0.1, rootMargin: "300px" }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [activeTab, moviePage, tvPage, hasMore, isLoadingMore]);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-accent selection:text-black">
            {/* Fixed Back Button at Top Left */}
            <button
                onClick={() => router.back()}
                className="fixed top-6 left-4 sm:left-8 md:left-12 z-[100] p-3 bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 rounded-full text-white transition-all hover:scale-110 group shadow-lg"
                title="Go Back"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            {/* Cinematic Hero Backdrop */}
            <div className="relative w-full min-h-[30vh] sm:min-h-[35vh] md:min-h-[40vh] overflow-hidden flex items-end">
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

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pb-10 pt-16">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 mt-4">
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
                                {moviesTotalResults || movies.length}
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
                                {tvShowsTotalResults || tvShows.length}
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
                                    <MovieCard key={`${item.id}-${item.media_type}`} movie={item} isFluid={true} />
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

                {/* Progress bar / Load More section */}
                {displayedItems.length > 0 && (
                    <div className="mt-16 flex flex-col items-center justify-center space-y-6 pb-12 border-t border-white/5 pt-12">
                        {/* Progress Bar Indicator */}
                        <div className="w-full max-w-md text-center space-y-2">
                            <p className="text-sm text-gray-400 font-medium">
                                Showing <span className="text-white font-bold">{displayedItems.length}</span> of{" "}
                                <span className="text-accent font-black">{totalResults}</span> {activeTab === "movie" ? "movies" : "TV shows"}
                            </p>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-accent to-purple-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (displayedItems.length / totalResults) * 100)}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>

                        {/* Infinite Scroll Sentinel / Indicator */}
                        <div ref={observerTarget} className="w-full flex justify-center py-4">
                            <AnimatePresence mode="wait">
                                {hasMore ? (
                                    <motion.div
                                        key="loading-indicator"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-3 text-sm text-gray-400 font-medium"
                                    >
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-accent rounded-full animate-spin" />
                                        <span>Loading more {activeTab === "movie" ? "Movies" : "TV Shows"}...</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="all-loaded"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-4 bg-white/5 border border-white/5 px-6 rounded-2xl max-w-sm"
                                    >
                                        <p className="text-gray-400 text-sm font-semibold tracking-wider flex items-center justify-center gap-2">
                                            🍿 You've explored the entire catalog!
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
