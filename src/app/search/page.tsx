"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import SearchGrid from "@/components/SearchGrid";
import { searchAction, getTrendingAction, getGenreListAction } from "@/app/actions";

const SearchSkeleton = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 animate-pulse">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-3">
                    <div className="aspect-[2/3] w-full bg-white/5 rounded-3xl" />
                    <div className="h-4 bg-white/5 rounded-full w-3/4" />
                    <div className="h-3 bg-white/5 rounded-full w-1/2" />
                </div>
            ))}
        </div>
    );
};

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [results, setResults] = useState<any[]>([]);
    const [trending, setTrending] = useState<any[]>([]);
    const [genres, setGenres] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    // Initial load for trending and genres
    useEffect(() => {
        const fetchInitialData = async () => {
            const [trendingData, genresData] = await Promise.all([
                getTrendingAction("all"),
                getGenreListAction("movie")
            ]);
            setTrending(trendingData || []);
            setGenres(genresData || []);
        };
        fetchInitialData();
    }, []);

    // Sync input instant query to debounced query
    useEffect(() => {
        if (query.trim() !== "") {
            setIsLoading(true); // Show loader immediately when typing starts for feedback!
        }
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 250);

        return () => {
            clearTimeout(handler);
        };
    }, [query]);

    // Live search action
    useEffect(() => {
        let active = true;

        const performSearch = async () => {
            if (!debouncedQuery.trim()) {
                setResults([]);
                setIsLoading(false);
                return;
            }

            try {
                const searchResults = await searchAction(debouncedQuery);
                if (active) {
                    setResults(searchResults || []);
                }
            } catch (error) {
                console.error("Search error:", error);
                if (active) {
                    setResults([]);
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        performSearch();

        return () => {
            active = false;
        };
    }, [debouncedQuery]);

    return (
        <main className="min-h-screen bg-black pb-20">
            <Navbar />

            <div className="pt-24 sm:pt-28 md:pt-32 px-4 sm:px-8 md:px-12">
                <h1 className="text-2xl md:text-4xl font-black mb-8 transition-all animate-in fade-in slide-in-from-left duration-700 truncate max-w-full pb-2">
                    {query ? `Results for "${query}"` : "Search Meowly"}
                </h1>

                {isLoading ? (
                    <SearchSkeleton />
                ) : results.length > 0 ? (
                    <SearchGrid results={results} />
                ) : !query ? (
                    <div className="space-y-12">
                        {/* Top Genres */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-400">Top Genres</h2>
                            <div className="flex flex-wrap gap-3">
                                {genres.slice(0, 8).map((genre: any) => (
                                    <Link
                                        key={genre.id}
                                        href={`/categories/${genre.id}`}
                                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-accent/50 transition-all text-sm font-medium"
                                    >
                                        {genre.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Trending Now */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-6 bg-accent rounded-full" />
                                <h2 className="text-xl font-bold">Trending Now</h2>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                                {trending.slice(0, 12).map((item) => (
                                    <MovieCard key={item.id} movie={item} isFluid={true} />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 text-center">
                        <p className="text-gray-400 text-lg mb-4">
                            We couldn't find any matches for "{query}"
                        </p>
                        <p className="text-gray-600 text-sm">
                            Try searching for movie titles, actors, or genres.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-black pb-20">
                <Navbar />
                <div className="pt-24 sm:pt-28 md:pt-32 px-4 sm:px-8 md:px-12">
                    <h1 className="text-2xl md:text-4xl font-black mb-8 animate-pulse text-white">
                        Search Meowly
                    </h1>
                    <SearchSkeleton />
                </div>
            </main>
        }>
            <SearchContent />
        </Suspense>
    );
}
