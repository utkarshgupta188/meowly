import React from "react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { tmdb } from "@/lib/tmdb";

interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = (await searchParams).q as string;

    const results = query ? await tmdb.search(query) : [];

    return (
        <main className="min-h-screen bg-prime-dark pb-20">
            <Navbar />

            <div className="pt-24 px-4 md:px-12">
                <h1 className="text-2xl md:text-3xl font-bold mb-8 transition-all animate-in fade-in slide-in-from-left duration-500">
                    {query ? `Search results for "${query}"` : "Search Meowflix"}
                </h1>

                {results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {results.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} isFluid={true} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 text-center">
                        <p className="text-gray-400 text-lg mb-4">
                            {query
                                ? `We couldn't find any matches for "${query}"`
                                : "Type something in the search bar to find movies and TV shows."}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
