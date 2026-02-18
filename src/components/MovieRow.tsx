"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import { Movie } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface MovieRowProps {
    title: string;
    movies: Movie[];
    className?: string;
}

const MovieRow = ({ title, movies, className }: MovieRowProps) => {
    const rowRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <div className={cn("space-y-4 px-8 md:px-12 group/row", className)}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-200">{title}</h2>

            <div className="relative group/nav">
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/60 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/80 cursor-pointer -ml-6"
                >
                    <ChevronLeft className="h-8 w-8 text-white" />
                </button>

                <div
                    ref={rowRef}
                    className="flex space-x-4 overflow-x-scroll scrollbar-hide px-4 py-4 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>

                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/60 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/80 cursor-pointer -mr-6"
                >
                    <ChevronRight className="h-8 w-8 text-white" />
                </button>
            </div>
        </div>
    );
};

export default MovieRow;
