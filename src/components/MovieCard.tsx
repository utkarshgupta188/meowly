"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Plus, Check, Info, X, User, Film } from "lucide-react";
import { motion } from "framer-motion";
import { Movie, TMDB_CONFIG } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/storage";
import { getTrailerAction } from "@/app/actions";

interface MovieCardProps {
    movie: Movie;
    className?: string;
    isFluid?: boolean;
    isResume?: boolean;
    onRemove?: (id: string, type: string) => void;
    isFirst?: boolean;
    isLast?: boolean;
}

const MovieCard = ({ movie, className, isFluid = false, isResume = false, onRemove, isFirst = false, isLast = false }: MovieCardProps) => {
    const router = useRouter();
    const [inWatchlist, setInWatchlist] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
    const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

    useEffect(() => {
        setInWatchlist(isInWatchlist(movie.id.toString(), movie.media_type || 'movie'));

        const handleUpdate = () => {
            setInWatchlist(isInWatchlist(movie.id.toString(), movie.media_type || 'movie'));
        };

        window.addEventListener("watchlistUpdated", handleUpdate);
        return () => window.removeEventListener("watchlistUpdated", handleUpdate);
    useEffect(() => {
        const handleVisibilityOrBlur = () => {
            if (typeof window !== "undefined" && window.location.pathname === "/") {
                if (document.visibilityState === "hidden" || !document.hasFocus()) {
                    setIsHovered(false);
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityOrBlur);
        window.addEventListener("blur", handleVisibilityOrBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityOrBlur);
            window.removeEventListener("blur", handleVisibilityOrBlur);
        };
    }, []);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let active = true;

        const isPerson = movie.media_type === "person";
        const isCompany = movie.media_type === "company";

        if (isHovered && !isPerson && !isCompany) {
            timeoutId = setTimeout(async () => {
                if (!active) return;
                setIsLoadingTrailer(true);
                try {
                    const mediaType = movie.media_type === "tv" ? "tv" : "movie";
                    const url = await getTrailerAction(mediaType, movie.id.toString());
                    if (!active) return;
                    if (url) {
                        // Append parameters for silent looped YouTube play
                        const key = url.split("/embed/")?.[1]?.split("?")?.[0];
                        const silentEmbedUrl = `${url}${url.includes("?") ? "&" : "?"}mute=1&autoplay=1&controls=0&modestbranding=1&loop=1&playlist=${key}`;
                        setTrailerUrl(silentEmbedUrl);
                    }
                } catch (e) {
                    console.error("Failed to load hover trailer:", e);
                } finally {
                    if (active) {
                        setIsLoadingTrailer(false);
                    }
                }
            }, 1200); // 1.2s delay to prevent accidental activation
        } else {
            setTrailerUrl(null);
            setIsLoadingTrailer(false);
        }

        return () => {
            active = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isHovered, movie.id, movie.media_type]);

    const isPerson = movie.media_type === "person";
    const isCompany = movie.media_type === "company";

    const imageUrl = isPerson
        ? (movie.profile_path ? `${TMDB_CONFIG.posterSizes.medium}${movie.profile_path}` : null)
        : isCompany
            ? (movie.logo_path ? `${TMDB_CONFIG.posterSizes.medium}${movie.logo_path}` : null)
            : movie.backdrop_path
                ? `${TMDB_CONFIG.backdropSizes.medium}${movie.backdrop_path}`
                : movie.poster_path
                    ? `${TMDB_CONFIG.posterSizes.medium}${movie.poster_path}`
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
        } else if (isCompany) {
            router.push(`/company/${movie.id}`);
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
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
                scale: 1.25,
                zIndex: 100,
                y: -15,
                transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            style={{ 
                willChange: "transform",
                transformOrigin: isFirst ? "left center" : isLast ? "right center" : "center center"
            }}
            className={cn(
                "relative group cursor-pointer transition-all duration-300",
                isFluid ? "w-full" : "flex-none w-[190px] sm:w-[230px] md:w-[270px] lg:w-[310px] xl:w-[330px]",
                className
            )}
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={cn(
                "relative aspect-video w-full overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/30 transition-all duration-300",
                isHovered ? "rounded-t-xl border-b-0 shadow-[0_20px_50px_rgba(0,0,0,0.8)]" : "rounded-xl"
            )}>
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
                    <div className={cn("w-full h-full flex items-center justify-center", isCompany ? "bg-white p-6" : "")}>
                        <img
                            src={imageUrl}
                            alt={movie.title || movie.name || "Media"}
                            className={cn(
                                "transition-transform duration-700 group-hover:scale-110",
                                isCompany ? "max-w-full max-h-full object-contain" : "w-full h-full object-cover"
                            )}
                            style={{ willChange: "transform" }}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full w-full bg-white/5 text-gray-500 text-xs text-center p-4">
                        {isPerson ? (
                            <User className="h-10 w-10 text-gray-600 mb-2" />
                        ) : isCompany ? (
                            <Film className="h-10 w-10 text-gray-600 mb-2" />
                        ) : null}
                        <span>{movie.title || movie.name}</span>
                    </div>
                )}

                {/* Silent YouTube Hover Trailer Preview Overlay */}
                {trailerUrl && (
                    <div className="absolute inset-0 w-full h-full z-10 overflow-hidden bg-black transition-all duration-500">
                        <iframe
                            src={trailerUrl}
                            className="w-[140%] h-[140%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            allow="autoplay; encrypted-media"
                            frameBorder="0"
                            scrolling="no"
                        ></iframe>
                    </div>
                )}

                {/* Loading Trailer Spinner Indicator */}
                {isLoadingTrailer && (
                    <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center backdrop-blur-[2px] transition-all duration-300">
                        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    </div>
                )}

                {/* Default Bottom info for non-hover (mobile/tablet) */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent group-hover:opacity-0 transition-all duration-300">
                    <h3 className="text-xs md:text-sm font-bold text-white truncate drop-shadow-lg">
                        {movie.title || movie.name}
                    </h3>
                </div>
            </div>

            {/* Detailed Hover Overlay - Netflix Style expanding below */}
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 z-30 bg-[#0c111b] border border-white/10 group-hover:border-white/30 border-t-0 rounded-b-xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-2 text-left"
                >
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

                            <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 drop-shadow-md">
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
                    ) : isCompany ? (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/30 text-[9px] font-bold uppercase tracking-wider">
                                    Production Studio
                                </span>
                                <div className="p-1.5 rounded-full bg-white/10 border border-white/20 text-white">
                                    <Info className="h-3 w-3" />
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-white mb-1 line-clamp-2 drop-shadow-md">
                                {movie.name}
                            </h3>

                            {movie.origin_country && (
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-300">
                                    <span className="text-gray-400 uppercase font-bold">Country:</span>
                                    <span className="font-semibold text-accent">{movie.origin_country}</span>
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

                            <h3 className="text-sm font-bold text-white mb-0.5 line-clamp-1 drop-shadow-md">
                                {movie.title || movie.name}
                            </h3>

                            {movie.media_type === "tv" && movie.season && (
                                <div className="text-[10px] text-accent font-bold mb-1">
                                    Season {movie.season} • Episode {movie.episode || 1}
                                </div>
                            )}

                            <div className="flex items-center space-x-3 text-[10px] font-bold text-gray-300 mb-1.5">
                                <span className="text-accent flex items-center">
                                    <span className="mr-1">★</span>
                                    {movie.vote_average?.toFixed(1) || "0.0"}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/80">
                                    {movie.release_date?.split("-")?.[0] || movie.first_air_date?.split("-")?.[0] || "N/A"}
                                </span>
                            </div>

                            <p className="text-[11px] text-gray-200/90 line-clamp-2 leading-relaxed font-medium">
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
                </motion.div>
            )}
        </motion.div>
    );
};

export default MovieCard;
