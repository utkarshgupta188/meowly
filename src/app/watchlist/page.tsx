"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { getWatchlist } from "@/lib/storage";
import { Movie } from "@/lib/tmdb";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function WatchlistPage() {
    const [watchlist, setWatchlist] = useState<any[]>([]);

    const loadWatchlist = () => {
        const items = getWatchlist();
        setWatchlist(items);
    };

    useEffect(() => {
        loadWatchlist();
        window.addEventListener("watchlistUpdated", loadWatchlist);
        return () => window.removeEventListener("watchlistUpdated", loadWatchlist);
    }, []);

    // Map stored items to Movie type
    const movies: Movie[] = watchlist.map(item => ({
        id: parseInt(item.id),
        title: item.title,
        name: item.title,
        overview: "", 
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path || "",
        vote_average: item.vote_average || 0,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
        media_type: item.type,
    }));

    return (
        <main className="min-h-screen bg-black pb-20">
            <Navbar />
            
            <div className="pt-40 md:pt-32 px-4 md:px-12 max-w-7xl mx-auto">
                <header className="mb-12">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-2"
                    >
                        My List
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400"
                    >
                        {movies.length} {movies.length === 1 ? 'item' : 'items'} saved to your watchlist
                    </motion.p>
                </header>

                {movies.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-32 text-center"
                    >
                        <div className="bg-white/5 p-8 rounded-full mb-6 ring-1 ring-white/10">
                            <Plus className="w-16 h-16 text-gray-700" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your list is empty</h2>
                        <p className="text-gray-400 max-w-md">
                            Add movies and TV shows to your list to keep track of what you want to watch next.
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {movies.map((movie) => (
                            <MovieCard key={`${movie.id}-${movie.media_type}`} movie={movie} isFluid={true} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
