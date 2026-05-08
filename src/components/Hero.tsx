"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Info, Plus, Check, X, Clapperboard } from "lucide-react";
import { Movie, TMDB_CONFIG } from "@/lib/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { getTrailerAction } from "@/app/actions";
import TrailerModal from "./TrailerModal";
import { Sparkles } from "lucide-react";
import { tmdb } from "@/lib/tmdb";

interface HeroProps {
    movies: Movie[];
}

const Hero = ({ movies }: HeroProps) => {
    const router = useRouter();
    // Filter out movies without a backdrop path to prevent blank slides
    const validMovies = movies.filter(m => m.backdrop_path);

    const [current, setCurrent] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
    const [isTrailerLoading, setIsTrailerLoading] = useState(false);
    const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
    const [isSurprising, setIsSurprising] = useState(false);

    useEffect(() => {
        if (!validMovies.length) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % Math.min(validMovies.length, 10));
            setImageLoaded(false); // Reset load state for fade effect
            setTrailerUrl(null); // Reset trailer when movie changes
        }, 8000);
        return () => clearInterval(interval);
    }, [validMovies]);

    useEffect(() => {
        if (!validMovies.length || !heroMovies[current]) return;
        
        const checkWatchlist = () => {
            const movie = heroMovies[current];
            setInWatchlist(isInWatchlist(movie.id.toString(), movie.media_type || 'movie'));
        };

        checkWatchlist();
        window.addEventListener("watchlistUpdated", checkWatchlist);
        return () => window.removeEventListener("watchlistUpdated", checkWatchlist);
    }, [current, validMovies]);

    if (!validMovies.length) return null;

    const heroMovies = validMovies.slice(0, 10);

    const handleWatchlistToggle = () => {
        const movie = heroMovies[current];
        if (inWatchlist) {
            removeFromWatchlist(movie.id.toString(), movie.media_type || 'movie');
        } else {
            addToWatchlist({
                id: movie.id.toString(),
                type: (movie.media_type as "movie" | "tv") || "movie",
                title: (movie.title || movie.name || ""),
                poster_path: movie.poster_path || "",
                backdrop_path: movie.backdrop_path,
                vote_average: movie.vote_average,
                release_date: movie.release_date,
                first_air_date: movie.first_air_date,
                last_played: Date.now()
            });
        }
    };

    const handlePlayTrailer = async () => {
        const movie = heroMovies[current];
        setIsTrailerLoading(true);
        const url = await getTrailerAction((movie.media_type as "movie" | "tv") || 'movie', movie.id.toString());
        setTrailerUrl(url);
        setIsTrailerModalOpen(true);
        setIsTrailerLoading(false);
    };

    const handleSurpriseMe = async () => {
        setIsSurprising(true);
        try {
            const movie = await tmdb.getRandomContent();
            if (movie) {
                router.push(`/watch/${movie.media_type || 'movie'}/${movie.id}`);
            }
        } catch (error) {
            console.error("Surprise Me failed:", error);
        } finally {
            setIsSurprising(false);
        }
    };

    return (
        <div className="relative h-[75vh] sm:h-[80vh] md:h-[85vh] w-full overflow-hidden bg-black group">
            <TrailerModal 
                isOpen={isTrailerModalOpen}
                onClose={() => setIsTrailerModalOpen(false)}
                trailerUrl={trailerUrl}
                title={heroMovies[current].title || heroMovies[current].name || ""}
            />

            {/* Carousel Container */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={heroMovies[current].id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => router.push(`/watch/${heroMovies[current].media_type || 'movie'}/${heroMovies[current].id}`)}
                >
                    {/* Background */}
                    <div className="absolute inset-0">
                        <motion.img
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 10, ease: "linear" }}
                            src={`https://image.tmdb.org/t/p/original${heroMovies[current].backdrop_path}`}
                            alt={heroMovies[current].title}
                            className="w-full h-full object-cover object-[center_30%]"
                            referrerPolicy="no-referrer"
                        />
                        {/* Cinematic Gradients */}
                        <div className="absolute inset-0 cinematic-side" />
                        <div className="absolute inset-0 cinematic-overlay" />
                        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black via-black/60 to-transparent pointer-events-none z-10" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col px-4 sm:px-6 md:px-12 lg:px-20 pt-24 pb-14 md:pb-32 justify-end">
                        <div className="max-w-3xl space-y-3 sm:space-y-4 md:space-y-6 z-10">
                            {/* Title / Logo */}
                            {heroMovies[current].logos && (heroMovies[current].logos as any[]).length > 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="h-12 sm:h-20 md:h-32 lg:h-40 w-full flex items-start"
                                >
                                    <img
                                        src={`${TMDB_CONFIG.imageBase}/original${
                                            (heroMovies[current].logos as any[]).find((l: any) => l.iso_639_1 === 'en')?.file_path || 
                                            (heroMovies[current].logos as any[])[0].file_path
                                        }`}
                                        alt={heroMovies[current].title || heroMovies[current].name}
                                        className="h-full object-contain object-left drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                    />
                                </motion.div>
                            ) : (
                                <motion.h1
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none drop-shadow-2xl"
                                >
                                    {heroMovies[current].title || heroMovies[current].name}
                                </motion.h1>
                            )}

                            {/* Metadata Row */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex items-center space-x-3 sm:space-x-4 text-gray-300 text-xs sm:text-sm md:text-base font-medium"
                            >
                                <span className="flex items-center">
                                    <span className="text-accent mr-1 sm:mr-1.5">★</span>
                                    <span className="text-white font-bold">{heroMovies[current].vote_average?.toFixed(1) || "0.0"}</span>
                                </span>
                                <span className="text-gray-600">•</span>
                                <span className="text-white font-medium">{heroMovies[current].release_date?.split("-")[0] || heroMovies[current].first_air_date?.split("-")[0]}</span>
                                <span className="text-gray-600">•</span>
                                <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[9px] sm:text-[10px] text-white border border-white/10 uppercase tracking-widest font-bold">4K Ultra HD</span>
                            </motion.div>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-gray-300 text-xs sm:text-sm md:text-lg line-clamp-2 sm:line-clamp-3 font-light leading-relaxed max-w-2xl"
                            >
                                {heroMovies[current].overview}
                            </motion.p>

                            {/* Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-4 pt-2 md:pt-4"
                            >
                                <Link
                                    href={`/watch/${heroMovies[current].media_type || 'movie'}/${heroMovies[current].id}?resume=true`}
                                    className="flex items-center space-x-1 sm:space-x-2 bg-white text-black px-3 py-2 sm:px-5 sm:py-2.5 md:px-8 md:py-3.5 rounded-full font-bold text-xs sm:text-sm md:text-base lg:text-lg hover:bg-gray-200 transition-all hover:scale-105 shadow-xl shadow-white/10"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Play className="fill-current w-3.5 h-3.5 sm:w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                                    <span>Watch Now</span>
                                </Link>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePlayTrailer();
                                    }}
                                    disabled={isTrailerLoading}
                                    className={cn(
                                        "flex items-center space-x-1 sm:space-x-2 bg-white/10 backdrop-blur-md text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3.5 rounded-full font-bold text-xs sm:text-sm md:text-base lg:text-lg hover:bg-white/20 transition-all hover:scale-105 border border-white/10",
                                        isTrailerLoading && "animate-pulse"
                                    )}
                                >
                                    <Clapperboard className="w-3.5 h-3.5 sm:w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-amber-400" />
                                    <span>{isTrailerLoading ? "Loading..." : "Trailer"}</span>
                                </button>

                                <Link
                                    href={`/watch/${heroMovies[current].media_type || 'movie'}/${heroMovies[current].id}`}
                                    className="flex items-center space-x-1 sm:space-x-2 bg-white/10 backdrop-blur-md text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3.5 rounded-full font-bold text-xs sm:text-sm md:text-base lg:text-lg hover:bg-white/20 transition-all hover:scale-105 border border-white/10"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Info className="w-3.5 h-3.5 sm:w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-accent" />
                                    <span>Info</span>
                                </Link>

                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleWatchlistToggle();
                                    }}
                                    className={cn(
                                        "p-2 sm:p-2.5 md:p-3.5 rounded-full backdrop-blur-md transition-all hover:scale-110 border border-white/20",
                                        inWatchlist 
                                            ? "bg-accent text-black border-accent" 
                                            : "bg-black/40 text-white hover:bg-black/60"
                                    )}
                                >
                                    {inWatchlist ? (
                                        <Check className="w-3.5 h-3.5 sm:w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                                    ) : (
                                        <Plus className="w-3.5 h-3.5 sm:w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                                    )}
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination Indicators */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {heroMovies.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrent(index);
                        }}
                        className={cn(
                            "h-1 sm:h-1.5 transition-all duration-300 rounded-full",
                            current === index ? "w-6 sm:w-8 bg-white" : "w-1.5 sm:w-2 bg-white/30 hover:bg-white/50"
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
