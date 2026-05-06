"use client";

import React, { useState, useEffect, useRef } from "react";
import { getNextGenresAction } from "@/app/actions";
import MovieRow from "./MovieRow";
import { Movie } from "@/lib/tmdb";
import { Loader2 } from "lucide-react";

type GenreRowData = {
    title: string;
    movies: Movie[];
};

interface InfiniteGenresProps {
    type?: "all" | "movie" | "tv";
}

const InfiniteGenres = ({ type = "all" }: InfiniteGenresProps) => {
    const [rows, setRows] = useState<GenreRowData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Total genres available in actions.ts:
    // all: 13, movie: 11, tv: 10
    const TOTAL_GENRES = type === "all" ? 13 : type === "movie" ? 11 : 10;

    const loadMoreGenres = async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);

        try {
            // Load 2 genres at a time to keep it extremely smooth and responsive
            const nextRows = await getNextGenresAction(currentIndex, 2, type);
            
            if (nextRows.length > 0) {
                setRows((prev) => [...prev, ...nextRows]);
                const nextIndex = currentIndex + 2;
                setCurrentIndex(nextIndex);
                if (nextIndex >= TOTAL_GENRES) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load more genres:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMoreGenres();
                }
            },
            { threshold: 0.1, rootMargin: "200px" } // Start loading 200px before reaching the bottom
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [currentIndex, hasMore, isLoading]);

    return (
        <div className="space-y-12">
            {/* Loaded rows */}
            {rows.map((row) => (
                <MovieRow 
                    key={row.title} 
                    title={row.title} 
                    movies={row.movies} 
                />
            ))}

            {/* Intersection target & Loading skeleton */}
            <div ref={observerTarget} className="w-full pt-4 pb-12 flex flex-col items-center justify-center">
                {isLoading && (
                    <div className="w-full space-y-4 px-8 md:px-12 animate-pulse">
                        {/* Fake Header skeleton */}
                        <div className="flex items-center space-x-3">
                            <div className="h-6 w-6 bg-white/5 rounded-full" />
                            <div className="h-6 w-48 bg-white/5 rounded-md" />
                            <div className="h-4 w-16 bg-white/5 rounded-full" />
                        </div>

                        {/* Fake Cards skeleton */}
                        <div className="flex space-x-4 overflow-x-hidden py-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div 
                                    key={i} 
                                    className="flex-shrink-0 w-[140px] sm:w-[180px] md:w-[220px] aspect-[2/3] bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center"
                                >
                                    <Loader2 className="h-5 w-5 text-white/10 animate-spin" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!hasMore && rows.length > 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-sm font-semibold tracking-wider uppercase">
                            🍿 You've caught up with everything!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfiniteGenres;
