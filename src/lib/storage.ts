"use client";

const RECENTLY_PLAYED_KEY = "meowly_recently_played";
const MAX_RECENT = 20;

export interface RecentItem {
    id: string;
    type: "movie" | "tv";
    title: string;
    poster_path: string;
    backdrop_path?: string;
    vote_average?: number;
    release_date?: string;
    first_air_date?: string;
    last_played: number;
    season?: number;
    episode?: number;
}

export function saveToRecentlyPlayed(item: RecentItem) {
    if (typeof window === "undefined") return;

    try {
        const stored = localStorage.getItem(RECENTLY_PLAYED_KEY);
        let items: RecentItem[] = stored ? JSON.parse(stored) : [];

        // Remove existing entry for the same item (to move it to top)
        items = items.filter(i => !(i.id === item.id && i.type === item.type));

        // Add new item to the beginning
        items.unshift({ ...item, last_played: Date.now() });

        // Limit the number of items
        if (items.length > MAX_RECENT) {
            items = items.slice(0, MAX_RECENT);
        }

        localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(items));
        
        // Dispatch a custom event to notify other components
        window.dispatchEvent(new Event("recentlyPlayedUpdated"));
    } catch (error) {
        console.error("Error saving to recently played:", error);
    }
}

export function getRecentlyPlayed(): RecentItem[] {
    if (typeof window === "undefined") return [];

    try {
        const stored = localStorage.getItem(RECENTLY_PLAYED_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Error getting recently played:", error);
        return [];
    }
}
