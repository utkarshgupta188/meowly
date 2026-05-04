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
        <div className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden bg-black group">


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
                        {/* Cinematic Gradients */}
                        <div className="absolute inset-0 cinematic-side" />
                        <div className="absolute inset-0 cinematic-overlay" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center md:justify-center px-6 md:px-16 lg:px-24 pt-20 pb-16 md:pb-0 justify-end">
                        <div className="max-w-3xl space-y-6 z-10 pl-2">
                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none drop-shadow-2xl"
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
                                <span className="flex items-center">
                                    <span className="text-accent mr-1.5">★</span>
                                    <span className="text-white font-bold">{heroMovies[current].vote_average.toFixed(1)}</span>
                                </span>
                                <span className="text-gray-600">•</span>
                                <span className="text-white font-medium">{heroMovies[current].release_date?.split("-")[0] || heroMovies[current].first_air_date?.split("-")[0]}</span>
                                <span className="text-gray-600">•</span>
                                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white border border-white/10 uppercase tracking-widest font-bold">4K Ultra HD</span>
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
                                    className="flex items-center space-x-3 bg-white text-black px-10 py-3.5 rounded-full font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105 shadow-xl shadow-white/10"
                                >
                                    <Play className="fill-current w-6 h-6" />
                                    <span>Watch Now</span>
                                </Link>

                                <button 
                                    onClick={handleWatchlistToggle}
                                    className={cn(
                                        "p-3.5 rounded-full backdrop-blur-md transition-all hover:scale-110 border border-white/20",
                                        inWatchlist 
                                            ? "bg-accent text-black border-accent" 
                                            : "bg-black/40 text-white hover:bg-black/60"
                                    )}
                                >
                                    {inWatchlist ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination Indicators */}
            <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {heroMovies.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={cn(
                            "h-1.5 transition-all duration-300 rounded-full",
                            current === index ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
