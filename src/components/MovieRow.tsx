"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Flame, History, Award, Star, Tv, Zap, Smile, Ghost, Sparkles, Heart, Film, Radio, Calendar, Compass, Fingerprint, Cat, Eye, Music, Globe, Map, Swords } from "lucide-react";
import MovieCard from "./MovieCard";
import { Movie } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MovieRowProps {
    title: string;
    movies: Movie[];
    className?: string;
    cardClassName?: string;
    isResume?: boolean;
    onRemove?: (id: string, type: string) => void;
}

const getHeaderConfig = (title: string) => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes("recent")) {
        return {
            gradient: "from-cyan-400 via-sky-400 to-indigo-400",
            icon: <History className="h-5 w-5 md:h-6 md:w-6 text-cyan-400 group-hover/header:rotate-[-45deg] transition-transform duration-500" />,
            badge: { text: "RESUME", bg: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" }
        };
    }
    if (lowerTitle.includes("trending")) {
        return {
            gradient: "from-amber-500 via-orange-500 to-red-500",
            icon: <Flame className="h-5 w-5 md:h-6 md:w-6 text-orange-500 group-hover/header:scale-125 transition-transform duration-300 animate-pulse" />,
            badge: { text: "HOT", bg: "bg-red-500/10 text-red-400 border border-red-500/20" }
        };
    }
    if (lowerTitle.includes("popular")) {
        return {
            gradient: "from-fuchsia-400 via-pink-400 to-rose-400",
            icon: <Award className="h-5 w-5 md:h-6 md:w-6 text-pink-400 group-hover/header:rotate-[15deg] transition-transform duration-300" />,
            badge: { text: "POPULAR", bg: "bg-pink-500/10 text-pink-400 border border-pink-500/20" }
        };
    }
    if (lowerTitle.includes("rated") || lowerTitle.includes("top")) {
        return {
            gradient: "from-amber-200 via-yellow-400 to-amber-500",
            icon: <Star className="h-5 w-5 md:h-6 md:w-6 text-amber-400 fill-amber-400/20 group-hover/header:scale-125 transition-transform duration-300" />,
            badge: { text: "MUST WATCH", bg: "bg-amber-500/10 text-amber-400 border border-amber-500/20" }
        };
    }
    if (lowerTitle.includes("tv")) {
        return {
            gradient: "from-violet-400 via-purple-400 to-fuchsia-400",
            icon: <Tv className="h-5 w-5 md:h-6 md:w-6 text-violet-400 group-hover/header:scale-110 transition-transform duration-300" />,
            badge: { text: "SERIES", bg: "bg-violet-500/10 text-violet-400 border border-violet-500/20" }
        };
    }
    if (lowerTitle.includes("action")) {
        return {
            gradient: "from-yellow-400 via-amber-500 to-red-600",
            icon: <Zap className="h-5 w-5 md:h-6 md:w-6 text-yellow-400 group-hover/header:scale-125 transition-transform duration-300 animate-pulse" />,
            badge: { text: "BLOCKBUSTERS", bg: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" }
        };
    }
    if (lowerTitle.includes("comedy")) {
        return {
            gradient: "from-emerald-400 via-teal-400 to-cyan-500",
            icon: <Smile className="h-5 w-5 md:h-6 md:w-6 text-emerald-400 group-hover/header:scale-110 transition-transform duration-300" />,
            badge: { text: "FUNNY", bg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" }
        };
    }
    if (lowerTitle.includes("horror")) {
        return {
            gradient: "from-red-600 via-rose-700 to-red-950",
            icon: <Ghost className="h-5 w-5 md:h-6 md:w-6 text-red-500 group-hover/header:scale-110 group-hover/header:translate-y-[-4px] transition-transform duration-300" />,
            badge: { text: "SPOOKY", bg: "bg-red-900/20 text-red-500 border border-red-900/30" }
        };
    }
    if (lowerTitle.includes("sci-fi") || lowerTitle.includes("fantasy")) {
        return {
            gradient: "from-sky-400 via-indigo-400 to-fuchsia-500",
            icon: <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-indigo-400 group-hover/header:scale-125 transition-transform duration-300 animate-pulse" />,
            badge: { text: "FANTASY", bg: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" }
        };
    }
    if (lowerTitle.includes("adventure")) {
        return {
            gradient: "from-emerald-400 via-lime-400 to-yellow-500",
            icon: <Compass className="h-5 w-5 md:h-6 md:w-6 text-emerald-400 group-hover/header:rotate-[90deg] transition-transform duration-500" />,
            badge: { text: "QUEST", bg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" }
        };
    }
    if (lowerTitle.includes("drama")) {
        return {
            gradient: "from-rose-400 via-pink-400 to-red-500",
            icon: <Heart className="h-5 w-5 md:h-6 md:w-6 text-rose-400 fill-rose-400/10 group-hover/header:scale-110 transition-transform duration-300" />,
            badge: { text: "DRAMATIC", bg: "bg-rose-500/10 text-rose-400 border border-rose-500/20" }
        };
    }
    if (lowerTitle.includes("crime")) {
        return {
            gradient: "from-slate-400 via-zinc-500 to-neutral-700",
            icon: <Fingerprint className="h-5 w-5 md:h-6 md:w-6 text-zinc-400 group-hover/header:scale-125 transition-transform duration-300" />,
            badge: { text: "THRILLING", bg: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20" }
        };
    }
    if (lowerTitle.includes("animated")) {
        return {
            gradient: "from-pink-400 via-indigo-400 to-cyan-400",
            icon: <Cat className="h-5 w-5 md:h-6 md:w-6 text-pink-400 group-hover/header:bounce transition-transform duration-300" />,
            badge: { text: "MEOW COSY", bg: "bg-pink-500/10 text-pink-400 border border-pink-500/20" }
        };
    }
    if (lowerTitle.includes("mystery")) {
        return {
            gradient: "from-purple-500 via-violet-600 to-slate-900",
            icon: <Eye className="h-5 w-5 md:h-6 md:w-6 text-purple-400 group-hover/header:scale-110 transition-transform duration-300" />,
            badge: { text: "SUSPENSE", bg: "bg-purple-500/10 text-purple-400 border border-purple-500/20" }
        };
    }
    if (lowerTitle.includes("romantic") || lowerTitle.includes("romance")) {
        return {
            gradient: "from-rose-300 via-pink-400 to-rose-500",
            icon: <Heart className="h-5 w-5 md:h-6 md:w-6 text-pink-400 fill-pink-400/20 group-hover/header:scale-125 transition-transform duration-300" />,
            badge: { text: "LOVE", bg: "bg-pink-500/10 text-pink-400 border border-pink-500/20" }
        };
    }
    if (lowerTitle.includes("documentar")) {
        return {
            gradient: "from-teal-400 via-emerald-400 to-sky-500",
            icon: <Globe className="h-5 w-5 md:h-6 md:w-6 text-teal-400 group-hover/header:rotate-[45deg] transition-transform duration-500" />,
            badge: { text: "INSIGHTS", bg: "bg-teal-500/10 text-teal-400 border border-teal-500/20" }
        };
    }
    if (lowerTitle.includes("west")) {
        return {
            gradient: "from-amber-600 via-amber-700 to-yellow-800",
            icon: <Map className="h-5 w-5 md:h-6 md:w-6 text-amber-500 group-hover/header:translate-x-1 transition-transform duration-300" />,
            badge: { text: "WESTERN", bg: "bg-amber-500/10 text-amber-500 border border-amber-500/20" }
        };
    }
    if (lowerTitle.includes("musical")) {
        return {
            gradient: "from-indigo-400 via-purple-400 to-pink-500",
            icon: <Music className="h-5 w-5 md:h-6 md:w-6 text-indigo-400 group-hover/header:scale-125 transition-transform duration-300" />,
            badge: { text: "MELODY", bg: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" }
        };
    }
    if (lowerTitle.includes("war") || lowerTitle.includes("historic")) {
        return {
            gradient: "from-red-500 via-zinc-600 to-zinc-800",
            icon: <Swords className="h-5 w-5 md:h-6 md:w-6 text-red-400 group-hover/header:rotate-12 transition-transform duration-300" />,
            badge: { text: "HISTORY", bg: "bg-red-500/10 text-red-400 border border-red-500/20" }
        };
    }
    if (lowerTitle.includes("airing today")) {
        return {
            gradient: "from-cyan-400 via-teal-400 to-emerald-400",
            icon: <Calendar className="h-5 w-5 md:h-6 md:w-6 text-cyan-400 group-hover/header:scale-110 transition-transform duration-300" />,
            badge: { text: "TONIGHT", bg: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" }
        };
    }
    if (lowerTitle.includes("air") || lowerTitle.includes("live")) {
        return {
            gradient: "from-emerald-400 via-green-400 to-teal-400",
            icon: <Radio className="h-5 w-5 md:h-6 md:w-6 text-emerald-400 group-hover/header:scale-110 transition-transform duration-300" />,
            badge: { text: "LIVE", bg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" }
        };
    }
    if (lowerTitle.includes("theaters") || lowerTitle.includes("now playing")) {
        return {
            gradient: "from-red-400 via-orange-400 to-yellow-400",
            icon: <Film className="h-5 w-5 md:h-6 md:w-6 text-orange-400 group-hover/header:rotate-[15deg] transition-transform duration-300" />,
            badge: { text: "IN THEATERS", bg: "bg-orange-500/10 text-orange-400 border border-orange-500/20" }
        };
    }
    if (lowerTitle.includes("upcoming") || lowerTitle.includes("anticipated")) {
        return {
            gradient: "from-amber-300 via-yellow-400 to-orange-500",
            icon: <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-amber-400 group-hover/header:scale-125 transition-transform duration-300 animate-pulse" />,
            badge: { text: "SOON", bg: "bg-amber-500/10 text-amber-400 border border-amber-500/20" }
        };
    }
    
    return {
        gradient: "from-white via-white to-neutral-400",
        icon: null,
        badge: null
    };
};

const MovieRow = ({ title, movies, className, cardClassName, isResume = false, onRemove }: MovieRowProps) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const config = getHeaderConfig(title);

    const scroll = (direction: "left" | "right") => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn("space-y-4 px-8 md:px-12 group/row", className)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 group/header cursor-pointer select-none">
                    {config.icon}
                    <h2 className={cn(
                        "text-xl md:text-2xl font-black bg-gradient-to-r bg-clip-text text-transparent tracking-tight font-sans transition-all duration-300 group-hover/header:brightness-110",
                        config.gradient
                    )}>
                        {title}
                    </h2>
                    {config.badge && (
                        <span className={cn(
                            "hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 group-hover/header:scale-105",
                            config.badge.bg
                        )}>
                            {config.badge.text}
                        </span>
                    )}
                </div>
                <Link 
                    href={`/search?q=${encodeURIComponent(title.toLowerCase())}`} 
                    className="text-xs md:text-sm font-semibold text-gray-500 hover:text-white transition-colors flex items-center"
                >
                    See All <ChevronRight className="h-4 w-4 ml-0.5" />
                </Link>
            </div>

            <div className="relative group/nav" style={{ overflow: 'clip', overflowClipMargin: '40px' }}>
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/60 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/80 cursor-pointer -ml-6"
                >
                    <ChevronLeft className="h-8 w-8 text-white" />
                </button>

                <div
                    ref={rowRef}
                    className="flex space-x-4 overflow-x-auto overflow-y-visible scrollbar-hide px-4 py-8 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie) => (
                        <MovieCard 
                            key={`${movie.id}-${movie.media_type}`} 
                            movie={movie} 
                            isResume={isResume}
                            className={cardClassName}
                            onRemove={onRemove}
                        />
                    ))}
                </div>

                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/60 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/80 cursor-pointer -mr-6"
                >
                    <ChevronRight className="h-8 w-8 text-white" />
                </button>
            </div>
        </motion.div>
    );
};

export default MovieRow;
