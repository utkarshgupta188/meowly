"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Globe, Tv, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Movie, TMDB_CONFIG } from "@/lib/tmdb";
import MovieCard from "./MovieCard";
import { getDiscoverByNetworkAction } from "@/app/actions";

interface NetworkDetailsClientProps {
    network: any;
    tvShows: Movie[];
    backdropUrl: string | null;
    tvShowsTotalResults?: number;
    tvShowsTotalPages?: number;
}

export default function NetworkDetailsClient({
    network,
    tvShows,
    backdropUrl,
    tvShowsTotalResults = 0,
    tvShowsTotalPages = 1,
}: NetworkDetailsClientProps) {
    const router = useRouter();
    const [loadedTvShows, setLoadedTvShows] = useState<Movie[]>(tvShows);
    const [tvPage, setTvPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLoadedTvShows(tvShows);
        setTvPage(1);
    }, [network.id, tvShows]);

    const handleLoadMore = async () => {
        if (isLoadingMore) return;
        setIsLoadingMore(true);

        const nextPage = tvPage + 1;

        try {
            const data = await getDiscoverByNetworkAction(network.id, nextPage);
            if (data && data.results && data.results.length > 0) {
                setLoadedTvShows((prev) => {
                    const existingIds = new Set(prev.map(item => item.id));
                    const uniqueNew = data.results.filter(item => !existingIds.has(item.id));
                    return [...prev, ...uniqueNew];
                });
                setTvPage(nextPage);
            }
        } catch (error) {
            console.error("Failed to load more:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const totalResults = tvShowsTotalResults || tvShows.length;
    const totalPages = tvShowsTotalPages || 1;
    const hasMore = tvPage < totalPages && loadedTvShows.length < totalResults;
    const displayedTotalResults = hasMore ? totalResults : loadedTvShows.length;

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
    }, [tvPage, hasMore, isLoadingMore]);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-accent selection:text-black">
            {/* Simple Back Button - simple, simple, simple as requested */}
            <button
                onClick={() => router.back()}
                className="fixed top-6 left-4 sm:left-8 md:left-12 z-[100] p-3 bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 rounded-full text-white transition-all hover:scale-110 group shadow-lg"
                title="Go Back"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Cinematic Hero Backdrop */}
            <div className="relative w-full min-h-[20vh] sm:min-h-[25vh] md:min-h-[30vh] overflow-hidden flex items-end">
                <div className="absolute inset-0 z-0">
                    {backdropUrl ? (
                        <img
                            src={backdropUrl}
                            alt={network.name}
                            className="w-full h-full object-cover opacity-35 blur-[2px] scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-900/20 via-black to-black" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pb-4 pt-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-end text-center md:text-left">
                        {/* Network Logo Display */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-28 h-28 md:w-36 md:h-36 bg-white/95 p-3 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 hover:scale-105 transition-transform"
                        >
                            {network.logo_path ? (
                                <img
                                    src={`${TMDB_CONFIG.imageBase}/w500${network.logo_path}`}
                                    alt={network.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <Tv className="w-12 h-12 text-gray-400" />
                            )}
                        </motion.div>

                        {/* Network Info */}
                        <div className="flex-1 space-y-4">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-accent text-xs font-black uppercase tracking-[0.3em]"
                            >
                                Network & Streaming Service
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none"
                            >
                                {network.name}
                            </motion.h1>

                            {/* Metadata */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap gap-4 items-center justify-center md:justify-start text-sm text-gray-300"
                            >
                                {network.headquarters && (
                                    <div className="flex items-center gap-1.5 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                        <MapPin className="w-4 h-4 text-accent" />
                                        <span>{network.headquarters}</span>
                                    </div>
                                )}
                                {network.origin_country && (
                                    <div className="flex items-center gap-1.5 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                        <span className="text-[10px] font-black uppercase text-gray-400">Country:</span>
                                        <span className="font-bold">{network.origin_country}</span>
                                    </div>
                                )}
                                {network.homepage && (
                                    <a
                                        href={network.homepage}
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

            {/* List Header and Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 mt-4">
                <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
                    <div className="w-1.5 h-8 bg-accent rounded-full" />
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                        Featured TV Shows
                        <span className="ml-3 text-gray-500 font-medium text-lg">({totalResults})</span>
                    </h2>
                </div>

                {loadedTvShows.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {loadedTvShows.map((item) => (
                            <MovieCard key={`${item.id}-${item.media_type}`} movie={item} isFluid={true} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                        <Tv className="w-16 h-16 mb-4 stroke-[1.5] text-gray-600" />
                        <p className="text-lg font-semibold">No TV shows found</p>
                        <p className="text-sm text-gray-600">This network hasn't cataloged any TV shows on TMDB.</p>
                    </div>
                )}

                {/* Infinite Scroll Sentinel / Indicator */}
                {loadedTvShows.length > 0 && (
                    <div ref={observerTarget} className="w-full flex justify-center py-12 border-t border-white/5 mt-16">
                        {hasMore && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="w-8 h-8 border-3 border-white/20 border-t-accent rounded-full animate-spin"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
