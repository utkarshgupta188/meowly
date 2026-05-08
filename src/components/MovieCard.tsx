"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Plus, Check, Info, X, User } from "lucide-react";
import { motion } from "framer-motion";
import { Movie, TMDB_CONFIG } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/storage";

interface MovieCardProps {
    movie: Movie;
    className?: string;
    isFluid?: boolean;
    isResume?: boolean;
    onRemove?: (id: string, type: string) => void;
}

const MovieCard = ({ movie, className, isFluid = false, isResume = false, onRemove }: MovieCardProps) => {
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

    const isPerson = movie.media_type === "person";

    const imageUrl = isPerson
        ? (movie.profile_path ? `${TMDB_CONFIG.posterSizes.medium}${movie.profile_path}` : null)
        : movie.poster_path
            ? `${TMDB_CONFIG.posterSizes.medium}${movie.poster_path}`
            : movie.backdrop_path
                ? `${TMDB_CONFIG.backdropSizes.medium}${movie.backdrop_path}`
                : null;

    const watchUrl = `/watch/${movie.media_type || 'movie'}/${movie.id}${movie.season ? `?s=${movie.season}&e=${movie.episode || 1}` : ''}`;
    const playUrl = `${watchUrl}${watchUrl.includes('?') ? '&' : '?'}resume=true`;
    const detailsUrl = `/watch/${movie.media_type || 'movie'}/${movie.id}${movie.season ? `?s=${movie.season}&e=${movie.episode || 1}` : ''}`;

    const handlePlayClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(playUrl);
    };

    const handleInfoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(detailsUrl);
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
                overview: movie.overview,
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
        if (isPerson) {
            router.push(`/person/${movie.id}`);
        } else {
            router.push(isResume ? detailsUrl : watchUrl);
        }
    };

    const handleRemoveClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove?.(movie.id.toString(), movie.media_type || 'movie');
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
                isFluid ? "w-full" : "flex-none w-[165px] sm:w-[185px] md:w-[205px] lg:w-[220px]",
                className
            )}
            onClick={handleCardClick}
        >
            <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/30 transition-all duration-300 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                {/* Remove button for recently played */}
                {isResume && onRemove && (
                    <button
                        onClick={handleRemoveClick}
                        className="absolute top-2 right-2 z-40 w-7 h-7 bg-black/70 hover:bg-red-600 backdrop-blur-md rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 border border-white/10 hover:border-red-500"
                        title="Remove from recently played"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={movie.title || movie.name || "Media"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full w-full bg-white/5 text-gray-500 text-xs text-center p-4">
                        {isPerson ? (
                            <User className="h-10 w-10 text-gray-600 mb-2" />
                        ) : null}
                        <span>{movie.title || movie.name}</span>
                    </div>
                )}

                {/* Detailed Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 space-y-2">
                        {isPerson ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <span className="px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/30 text-[9px] font-bold uppercase tracking-wider">
                                        {movie.known_for_department || "Person"}
                                    </span>
                                    <div className="p-1.5 rounded-full bg-white/10 border border-white/20 text-white">
                                        <Info className="h-3 w-3" />
                                    </div>
                                </div>

                                <h3 className="text-sm md:text-base font-bold text-white mb-1 line-clamp-1 drop-shadow-md">
                                    {movie.name}
                                </h3>

                                {movie.known_for && movie.known_for.length > 0 && (
                                    <div className="space-y-1 pt-1.5 border-t border-white/10">
                                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Known For</div>
                                        <div className="flex flex-col gap-1">
                                            {movie.known_for.slice(0, 3).map((item) => (
                                                <div 
                                                    key={item.id}
                                                    className="text-[10px] text-gray-200 line-clamp-1 flex items-center"
                                                >
                                                    <span className="text-accent mr-1.5">•</span>
                                                    <span>{item.title || item.name}</span>
                                                    {item.release_date && (
                                                        <span className="text-gray-400 ml-1">
                                                            ({item.release_date.split("-")[0]})
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
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
                                        {isResume && (
                                            <button
                                                onClick={handleInfoClick}
                                                className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:scale-110 transition-transform text-white hover:bg-white/20"
                                                title="Show details"
                                            >
                                                <Info className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white border border-white/10">
                                        HD
                                    </div>
                                </div>

                                <h3 className="text-sm md:text-base font-bold text-white mb-1 line-clamp-1 drop-shadow-md">
                                    {movie.title || movie.name}
                                </h3>

                                {movie.media_type === "tv" && movie.season && (
                                    <div className="text-[10px] text-accent font-bold mb-1">
                                        Season {movie.season} • Episode {movie.episode || 1}
                                    </div>
                                )}

                                <div className="flex items-center space-x-3 text-[10px] font-bold text-gray-300 mb-2">
                                    <span className="text-accent flex items-center">
                                        <span className="mr-1">★</span>
                                        {movie.vote_average?.toFixed(1) || "0.0"}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/80">
                                        {movie.release_date?.split("-")?.[0] || movie.first_air_date?.split("-")?.[0] || "N/A"}
                                    </span>
                                </div>

                                <p className="text-[11px] md:text-xs text-gray-200/90 line-clamp-4 leading-relaxed font-medium">
                                    {movie.tagline ? (
                                        <>
                                            <span className="text-accent font-bold italic mr-1">"{movie.tagline}"</span>
                                            {movie.overview}
                                        </>
                                    ) : (
                                        movie.overview
                                    )}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Default Bottom info for non-hover (mobile/tablet) */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent group-hover:opacity-0 transition-all duration-300">
                    <h3 className="text-xs md:text-sm font-bold text-white truncate drop-shadow-lg">
                        {movie.title || movie.name}
                    </h3>
                </div>
            </div>
        </motion.div>
    );
};

export default MovieCard;
