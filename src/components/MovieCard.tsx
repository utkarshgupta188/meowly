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
                "relative aspect-video group cursor-pointer transition-all duration-300",
                isFluid ? "w-full" : "flex-none w-[200px] h-[112px] md:w-[280px] md:h-[160px]",
                className
            )}
            onClick={handleCardClick}
        >
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-prime-card shadow-lg ring-1 ring-white/5 group-hover:ring-prime-blue/50 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={movie.title || movie.name || "Movie"}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-40"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full w-full bg-prime-hover text-gray-500 text-xs text-center p-2">
                        {movie.title || movie.name}
                    </div>
                )}

                {/* Hover Overlay Content */}
                <div className="absolute inset-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end bg-gradient-to-t from-prime-dark via-prime-dark/60 to-transparent">
                    
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={handlePlayClick}
                                className="bg-prime-blue text-white p-2 rounded-full shadow-lg shadow-prime-blue/30 hover:scale-110 active:scale-95 transition-transform"
                            >
                                <Play className="h-4 w-4 fill-current" />
                            </button>
                            <button 
                                onClick={handleWatchlistClick}
                                className={cn(
                                    "border p-1.5 rounded-full backdrop-blur-sm transition-all hover:scale-110 active:scale-95",
                                    inWatchlist 
                                        ? "bg-prime-blue border-prime-blue text-white" 
                                        : "bg-white/5 border-white/30 text-white hover:bg-white/10"
                                )}
                            >
                                {inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <h3 className="text-base font-bold text-white truncate drop-shadow-lg">
                        {movie.title || movie.name}
                    </h3>

                    <div className="flex items-center space-x-2 text-xs text-gray-300 mt-1">
                        <span className="text-prime-blue font-bold">{movie.vote_average?.toFixed(1)} Rating</span>
                        <span className="text-gray-600">•</span>
                        <span>{movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}</span>
                        {movie.season && (
                            <>
                                <span className="text-gray-600">•</span>
                                <span className="text-white font-medium bg-white/10 px-1.5 rounded">S{movie.season}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MovieCard;
