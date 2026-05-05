"use client";

import React, { useEffect, useState } from "react";
import { getWatchlist } from "@/lib/storage";
import MovieRow from "./MovieRow";
import { Movie } from "@/lib/tmdb";
import { motion } from "framer-motion";

const WatchlistRow = () => {
    const [watchlist, setWatchlist] = useState<any[]>([]);

    const loadWatchlist = () => {
        const items = getWatchlist();
        setWatchlist(items);
    };

    useEffect(() => {
        loadWatchlist();

        // Listen for updates from other components
        window.addEventListener("watchlistUpdated", loadWatchlist);
        return () => window.removeEventListener("watchlistUpdated", loadWatchlist);
    }, []);

    if (watchlist.length === 0) return null;

    // Map stored items to Movie type for MovieRow
    const movies: Movie[] = watchlist.map(item => ({
        id: parseInt(item.id),
        title: item.title,
        name: item.title,
        overview: item.overview || "", 
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path || "",
        vote_average: item.vote_average || 0,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
        media_type: item.type,
    }));

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <MovieRow title="My List" movies={movies} />
        </motion.div>
    );
};

export default WatchlistRow;
