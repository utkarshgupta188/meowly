"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Film, Tv, User, Building2, Layers } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import SearchGrid from "@/components/SearchGrid";
import { searchAction, getTrendingAction, getGenreListAction } from "@/app/actions";
import { Movie } from "@/lib/tmdb";

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

interface Genre {
    id: number;
    name: string;
}

function SearchContent() {
    const searchParams = useSearchParams();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const query = hasMounted ? (searchParams.get("q") || "") : "";

    const [results, setResults] = useState<Movie[]>([]);
    const [trending, setTrending] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<"all" | "movie" | "tv" | "person" | "company">("all");

    const isFirstSync = React.useRef(true);

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

        // If it's the first sync (initial load), skip debounce for faster page load!
        if (isFirstSync.current && query.trim() !== "") {
            isFirstSync.current = false;
            setDebouncedQuery(query);
            return;
        }

        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 250);

        return () => {
            clearTimeout(handler);
        };
    }, [query]);

    // Reset filter when query changes
    useEffect(() => {
        setActiveCategory("all");
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

    const movieCount = results.filter(item => item.media_type === "movie").length;
    const tvCount = results.filter(item => item.media_type === "tv").length;
    const personCount = results.filter(item => item.media_type === "person").length;
    const companyCount = results.filter(item => item.media_type === "company").length;

    const filteredResults = activeCategory === "all"
        ? results
        : results.filter(item => item.media_type === activeCategory);

    return (
        <main className="min-h-screen bg-black pb-20">

            <div className="pt-24 sm:pt-28 md:pt-32 px-4 sm:px-8 md:px-12">
                <h1 className="text-2xl md:text-4xl font-black mb-8 transition-all animate-in fade-in slide-in-from-left duration-700 truncate max-w-full pb-2">
                    {query ? `Results for "${query}"` : "Search Meowly"}
                </h1>

                {isLoading ? (
                    <SearchSkeleton />
                ) : results.length > 0 ? (
                    <div className="space-y-8">
                        {/* Beautiful Sliding/Minimalist Category Tabs */}
                        <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pb-4 border-b border-white/10 -mx-4 px-4 sm:mx-0 sm:px-0 flex-nowrap md:pb-6">
                            <button
                                onClick={() => setActiveCategory("all")}
                                className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide transition-all duration-300 flex items-center gap-2 border shrink-0 whitespace-nowrap ${
                                    activeCategory === "all"
                                        ? "bg-white text-black border-white font-bold shadow-lg shadow-white/10"
                                        : "bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10 hover:border-white/10"
                                }`}
                            >
                                <Layers className="w-3.5 h-3.5" />
                                <span className="uppercase tracking-wider">All</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    activeCategory === "all" ? "bg-black/10 text-black" : "bg-white/10 text-gray-400"
                                }`}>
                                    {results.length}
                                </span>
                            </button>
                            {movieCount > 0 && (
                                <button
                                    onClick={() => setActiveCategory("movie")}
                                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide transition-all duration-300 flex items-center gap-2 border shrink-0 whitespace-nowrap ${
                                        activeCategory === "movie"
                                            ? "bg-white text-black border-white font-bold shadow-lg shadow-white/10"
                                            : "bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10 hover:border-white/10"
                                    }`}
                                >
                                    <Film className="w-3.5 h-3.5" />
                                    <span className="uppercase tracking-wider">Movies</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                        activeCategory === "movie" ? "bg-black/10 text-black" : "bg-white/10 text-gray-400"
                                    }`}>
                                        {movieCount}
                                    </span>
                                </button>
                            )}
                            {tvCount > 0 && (
                                <button
                                    onClick={() => setActiveCategory("tv")}
                                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide transition-all duration-300 flex items-center gap-2 border shrink-0 whitespace-nowrap ${
                                        activeCategory === "tv"
                                            ? "bg-white text-black border-white font-bold shadow-lg shadow-white/10"
                                            : "bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10 hover:border-white/10"
                                    }`}
                                >
                                    <Tv className="w-3.5 h-3.5" />
                                    <span className="uppercase tracking-wider">TV Shows</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                        activeCategory === "tv" ? "bg-black/10 text-black" : "bg-white/10 text-gray-400"
                                    }`}>
                                        {tvCount}
                                    </span>
                                </button>
                            )}
                            {personCount > 0 && (
                                <button
                                    onClick={() => setActiveCategory("person")}
                                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide transition-all duration-300 flex items-center gap-2 border shrink-0 whitespace-nowrap ${
                                        activeCategory === "person"
                                            ? "bg-white text-black border-white font-bold shadow-lg shadow-white/10"
                                            : "bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10 hover:border-white/10"
                                    }`}
                                >
                                    <User className="w-3.5 h-3.5" />
                                    <span className="uppercase tracking-wider">People</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                        activeCategory === "person" ? "bg-black/10 text-black" : "bg-white/10 text-gray-400"
                                    }`}>
                                        {personCount}
                                    </span>
                                </button>
                            )}
                            {companyCount > 0 && (
                                <button
                                    onClick={() => setActiveCategory("company")}
                                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide transition-all duration-300 flex items-center gap-2 border shrink-0 whitespace-nowrap ${
                                        activeCategory === "company"
                                            ? "bg-white text-black border-white font-bold shadow-lg shadow-white/10"
                                            : "bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10 hover:border-white/10"
                                    }`}
                                >
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span className="uppercase tracking-wider">Studios</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                        activeCategory === "company" ? "bg-black/10 text-black" : "bg-white/10 text-gray-400"
                                    }`}>
                                        {companyCount}
                                    </span>
                                </button>
                            )}
                        </div>

                        {filteredResults.length > 0 ? (
                            <SearchGrid results={filteredResults} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center">
                                <p className="text-gray-400 text-lg mb-2">
                                    No results in this category
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Try checking the other tabs for matches.
                                </p>
                            </div>
                        )}
                    </div>
                ) : !query ? (
                    <div className="space-y-12">
                        {/* Top Genres */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-400">Top Genres</h2>
                            <div className="flex flex-wrap gap-3">
                                {genres.slice(0, 8).map((genre: Genre) => (
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
                            We couldn&apos;t find any matches for &quot;{query}&quot;
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
