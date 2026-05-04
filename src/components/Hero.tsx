"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Info, Plus, Check } from "lucide-react";
import { Movie, TMDB_CONFIG } from "@/lib/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/storage";
import { cn } from "@/lib/utils";

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

    useEffect(() => {
        if (!validMovies.length) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % Math.min(validMovies.length, 10));
            setImageLoaded(false); // Reset load state for fade effect
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

    return (
        <div className="relative h-[85vh] w-full overflow-hidden bg-gray-800 group">


            {/* Carousel Container */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={heroMovies[current].id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    {/* Background */}
                    <div className="absolute inset-0">
                        <motion.img
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 10, ease: "linear" }}
                            src={`https://image.tmdb.org/t/p/original${heroMovies[current].backdrop_path}`}
                            alt={heroMovies[current].title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                        {/* Prime Video Style Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-r from-prime-dark via-prime-dark/70 to-transparent lg:via-prime-dark/40" />
                        <div className="absolute inset-0 bg-gradient-to-t from-prime-dark via-prime-dark/20 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-20">
                        <div className="max-w-3xl space-y-6 z-10 pl-2">
                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-sans font-light text-white tracking-tight leading-[1.1]"
                            >
                                {heroMovies[current].title || heroMovies[current].name}
                            </motion.h1>

                            {/* Metadata Row */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex items-center space-x-4 text-gray-300 text-sm md:text-base font-medium"
                            >
                                <span className="flex items-center text-gray-400">
                                    IMDb <span className="text-white ml-1.5 font-bold">{heroMovies[current].vote_average.toFixed(1)}</span>
                                </span>
                                <span className="text-gray-600">•</span>
                                <span className="text-white">{heroMovies[current].release_date?.split("-")[0] || heroMovies[current].first_air_date?.split("-")[0]}</span>
                                <span className="text-gray-600">•</span>
                                <span className="ml-2 bg-gray-700/50 rounded px-2 py-0.5 text-xs text-white">4K UHD</span>
                            </motion.div>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-gray-300 text-base md:text-lg line-clamp-3 font-light leading-relaxed max-w-2xl"
                            >
                                {heroMovies[current].overview}
                            </motion.p>

                            {/* Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="flex items-center space-x-4 pt-4"
                            >
                                <Link
                                    href={`/watch/${heroMovies[current].media_type || 'movie'}/${heroMovies[current].id}?resume=true`}
                                    className="flex items-center space-x-3 bg-white text-prime-dark px-8 py-4 rounded-[4px] font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105"
                                >
                                    <Play className="fill-current w-6 h-6" />
                                    <span>Watch now</span>
                                </Link>

                                <button 
                                    onClick={handleWatchlistToggle}
                                    className={cn(
                                        "p-4 rounded-full backdrop-blur-md transition-all hover:scale-110 border-2",
                                        inWatchlist 
                                            ? "bg-prime-blue text-white border-prime-blue" 
                                            : "bg-gray-600/40 text-gray-200 hover:bg-gray-600/60 hover:text-white border-transparent hover:border-white/20"
                                    )}
                                >
                                    {inWatchlist ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                </button>

                                <Link 
                                    href={`/watch/${heroMovies[current].media_type || 'movie'}/${heroMovies[current].id}`}
                                    className="p-4 rounded-full bg-gray-600/40 backdrop-blur-md text-gray-200 hover:bg-gray-600/60 hover:text-white hover:scale-110 transition-all border-2 border-transparent hover:border-white/20"
                                >
                                    <Info className="w-6 h-6" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>




        </div>
    );
};

export default Hero;
