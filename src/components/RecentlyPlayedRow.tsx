"use client";

import React, { useEffect, useState } from "react";
import { getRecentlyPlayed, RecentItem } from "@/lib/storage";
import MovieRow from "./MovieRow";
import { Movie } from "@/lib/tmdb";
import { motion } from "framer-motion";

const RecentlyPlayedRow = () => {
    const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

    const loadRecent = () => {
        const items = getRecentlyPlayed();
        setRecentItems(items);
    };

    useEffect(() => {
        loadRecent();

        // Listen for updates from other components
        window.addEventListener("recentlyPlayedUpdated", loadRecent);
        return () => window.removeEventListener("recentlyPlayedUpdated", loadRecent);
    }, []);

    if (recentItems.length === 0) return null;

    // Map RecentItem to Movie type for MovieRow
    const movies: Movie[] = recentItems.map(item => ({
        id: parseInt(item.id),
        title: item.title,
        name: item.title, // Use title for both
        overview: "", // We don't store overview
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path || "",
        vote_average: item.vote_average || 0,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
        media_type: item.type,
        season: item.season,
        episode: item.episode,
    }));

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <MovieRow title="Recently Played" movies={movies} isResume={true} />
        </motion.div>
    );
};

export default RecentlyPlayedRow;
