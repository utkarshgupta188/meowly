"use client";

import React, { useEffect, useState } from "react";
import { getRecentlyPlayed, removeFromRecentlyPlayed, RecentItem } from "@/lib/storage";
import MovieRow from "./MovieRow";
import { Movie } from "@/lib/tmdb";
import { motion } from "framer-motion";

const RecentlyPlayedRow = () => {
    const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    const loadRecent = () => {
        const items = getRecentlyPlayed();
        setRecentItems(items);
    };

    useEffect(() => {
        setIsMounted(true);
        loadRecent();
        // Listen for updates from other components
        window.addEventListener("recentlyPlayedUpdated", loadRecent);
        return () => window.removeEventListener("recentlyPlayedUpdated", loadRecent);
    }, []);

    const handleRemove = (id: string, type: string) => {
        removeFromRecentlyPlayed(id, type);
    };

    if (!isMounted || recentItems.length === 0) return null;

    // Map RecentItem to Movie type for MovieRow
    const movies: Movie[] = recentItems.map(item => ({
        id: parseInt(item.id),
        title: item.title,
        name: item.title,
        overview: item.overview || "",
        poster_path: item.poster_path || "",
        backdrop_path: item.backdrop_path || "",
        vote_average: item.vote_average || 0,
        release_date: item.release_date || item.first_air_date, // Fallback
        first_air_date: item.first_air_date || item.release_date, // Fallback
        media_type: item.type as "movie" | "tv",
        season: item.season,
        episode: item.episode,
        tagline: item.tagline,
    }));

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <MovieRow title="Recently Played" movies={movies} isResume={true} onRemove={handleRemove} />
        </motion.div>
    );
};

export default RecentlyPlayedRow;
