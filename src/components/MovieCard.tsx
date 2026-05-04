"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Movie, TMDB_CONFIG } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/storage";

interface MovieCardProps {
    movie: Movie;
    className?: string;
    isFluid?: boolean;
    isResume?: boolean;
}

const MovieCard = ({ movie, className, isFluid = false, isResume = false }: MovieCardProps) => {
    const router = useRouter();
    const [inWatchlist, setInWatchlist] = useState(false);

    useEffect(() => {
        setInWatchlist(isInWatchlist(movie.id.toString(), movie.media_type || 'movie'));
        
        const handleUpdate = () => {
            setInWatchlist(isInWatchlist(movie.id.toString(), movie.media_type || 'movie'));
        };

        window.addEventListener("watchlistUpdated", handleUpdate);
        return () => window.removeEventListener("watchlistUpdated", handleUpdate);
    }, [movie.id, movie.media_type]);

    const imageUrl = movie.backdrop_path
        ? `${TMDB_CONFIG.backdropSizes.medium}${movie.backdrop_path}`
        : movie.poster_path
            ? `${TMDB_CONFIG.posterSizes.medium}${movie.poster_path}`
            : null;

    const watchUrl = `/watch/${movie.media_type || 'movie'}/${movie.id}${movie.season ? `?s=${movie.season}&e=${movie.episode || 1}` : ''}`;
    const playUrl = `${watchUrl}${watchUrl.includes('?') ? '&' : '?'}resume=true`;

    const handlePlayClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(playUrl);
    };

    const handleWatchlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

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

    const handleCardClick = () => {
        router.push(watchUrl);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, zIndex: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
                "relative group cursor-pointer transition-all duration-300",
                isFluid ? "w-full" : "flex-none w-[140px] md:w-[180px]",
                className
            )}
            onClick={handleCardClick}
        >
            <div className="space-y-2">
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/30 transition-all duration-300">
                    {movie.poster_path ? (
                        <img
                            src={`${TMDB_CONFIG.posterSizes.medium}${movie.poster_path}`}
                            alt={movie.title || movie.name || "Movie"}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full bg-white/5 text-gray-500 text-xs text-center p-2">
                            {movie.title || movie.name}
                        </div>
                    )}

                    {/* Action Buttons Overlay */}
                    <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                            onClick={handleWatchlistClick}
                            className={cn(
                                "p-2 rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-110",
                                inWatchlist ? "bg-accent border-accent text-black" : "bg-black/60 text-white"
                            )}
                        >
                            {inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </button>
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                         <button 
                            onClick={handlePlayClick}
                            className="bg-accent text-black p-3 rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300 hover:scale-110 active:scale-95"
                        >
                            <Play className="h-5 w-5 fill-current" />
                        </button>
                    </div>
                </div>

                <div className="px-1">
                    <h3 className="text-sm md:text-[15px] font-bold text-white truncate transition-colors group-hover:text-accent">
                        {movie.title || movie.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-[12px] text-gray-500">
                        <span className="flex items-center">
                            <span className="text-accent mr-1">★</span>
                            {movie.vote_average?.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MovieCard;
