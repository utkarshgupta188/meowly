"use client";

import React, { useEffect, useState } from "react";
import { getRecentlyPlayed, RecentItem } from "@/lib/storage";
import MovieRow from "./MovieRow";
import { Movie } from "@/lib/tmdb";

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
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <MovieRow title="Recently Played" movies={movies} isResume={true} />
        </div>
    );
};

export default RecentlyPlayedRow;
