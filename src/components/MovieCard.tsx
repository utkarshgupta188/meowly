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
            whileHover={{ 
                scale: 1.15, 
                zIndex: 50,
                y: -10,
                transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            className={cn(
                "relative group cursor-pointer transition-all duration-300",
                isFluid ? "w-full" : "flex-none w-[160px] md:w-[220px]",
                className
            )}
            onClick={handleCardClick}
        >
            <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/30 transition-all duration-300 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                {movie.poster_path ? (
                    <img
                        src={`${TMDB_CONFIG.posterSizes.medium}${movie.poster_path}`}
                        alt={movie.title || movie.name || "Movie"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full w-full bg-white/5 text-gray-500 text-xs text-center p-2">
                        {movie.title || movie.name}
                    </div>
                )}

                {/* Detailed Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={handlePlayClick}
                                    className="bg-accent text-black p-2 rounded-full hover:scale-110 transition-transform shadow-lg shadow-accent/20"
                                >
                                    <Play className="h-4 w-4 fill-current" />
                                </button>
                                <button 
                                    onClick={handleWatchlistClick}
                                    className={cn(
                                        "p-2 rounded-full backdrop-blur-md border border-white/20 hover:scale-110 transition-transform",
                                        inWatchlist ? "bg-accent border-accent text-black" : "bg-black/60 text-white"
                                    )}
                                >
                                    {inWatchlist ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                </button>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white border border-white/10">
                                HD
                            </div>
                        </div>

                        <h3 className="text-sm font-black text-white leading-tight drop-shadow-md">
                            {movie.title || movie.name}
                        </h3>

                        <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-300">
                            <span className="text-accent">★ {movie.vote_average?.toFixed(1)}</span>
                            <span>{movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}</span>
                        </div>

                        <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed font-medium">
                            {movie.overview}
                        </p>
                    </div>
                </div>

                {/* Default Bottom info for non-hover (mobile/tablet) */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent group-hover:opacity-0 transition-opacity">
                    <h3 className="text-xs md:text-sm font-bold text-white truncate">
                        {movie.title || movie.name}
                    </h3>
                </div>
            </div>
        </motion.div>
    );
};

export default MovieCard;
