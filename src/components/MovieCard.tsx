"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Info, Check } from "lucide-react";
import { Movie, TMDB_CONFIG } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface MovieCardProps {
    movie: Movie;
    className?: string;
    isFluid?: boolean;
}

const MovieCard = ({ movie, className, isFluid = false }: MovieCardProps) => {
    // Prefer backdrop for wide cards, user can override with CSS
    const imageUrl = movie.backdrop_path
        ? `${TMDB_CONFIG.backdropSizes.medium}${movie.backdrop_path}`
        : movie.poster_path
            ? `${TMDB_CONFIG.posterSizes.medium}${movie.poster_path}`
            : null;

    return (
        <div className={cn(
            "relative aspect-video group cursor-pointer transition-all duration-300 hover:z-50 hover:scale-105",
            isFluid ? "w-full" : "flex-none w-[200px] h-[112px] md:w-[280px] md:h-[160px]",
            className
        )}>
            <Link href={`/watch/${movie.media_type || 'movie'}/${movie.id}`}>
                <div className="relative w-full h-full rounded-md overflow-hidden bg-prime-card shadow-lg ring-1 ring-white/5 group-hover:ring-prime-blue/50 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={movie.title || movie.name || "Movie"}
                            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-60"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full bg-prime-hover text-gray-500 text-xs text-center p-2">
                            {movie.title || movie.name}
                        </div>
                    )}

                    {/* Hover Overlay Content */}
                    <div className="absolute inset-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end bg-gradient-to-t from-prime-dark via-prime-dark/80 to-transparent">

                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <button className="bg-white text-prime-dark p-2 rounded-full hover:bg-gray-200 hover:scale-110 transition-all">
                                    <Play className="h-4 w-4 fill-current" />
                                </button>
                                <button className="border-2 border-gray-400 text-white p-1.5 rounded-full hover:border-white hover:bg-white/10 transition-all">
                                    <Info className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-sm font-bold text-white truncate drop-shadow-md mb-1">{movie.title || movie.name}</h3>

                        <div className="flex items-center space-x-2 text-[10px] text-gray-400 mt-1">
                            <span>{movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default MovieCard;
