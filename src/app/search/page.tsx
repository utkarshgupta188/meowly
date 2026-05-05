import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import SearchGrid from "@/components/SearchGrid";
import { tmdb } from "@/lib/tmdb";

interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = (await searchParams).q as string;

    const results = query ? await tmdb.search(query) : [];
    const trending = !query ? await tmdb.getTrending("all") : [];
    const genres = !query ? await tmdb.getGenreList("movie") : [];

    return (
        <main className="min-h-screen bg-black pb-20">
            <Navbar />

            <div className="pt-40 md:pt-32 px-4 md:px-12">
                <h1 className="text-2xl md:text-4xl font-black mb-8 transition-all animate-in fade-in slide-in-from-left duration-700 truncate max-w-full pb-2">
                    {query ? `Results for "${query}"` : "Search Meowly"}
                </h1>

                {results.length > 0 ? (
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                {trending.slice(0, 12).map((item) => (
                                    <MovieCard key={item.id} movie={item} />
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
