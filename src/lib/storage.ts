"use client";

const RECENTLY_PLAYED_KEY = "meowly_recently_played";
const WATCHLIST_KEY = "meowly_watchlist";
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

// Watchlist Functions
export function addToWatchlist(item: RecentItem) {
    if (typeof window === "undefined") return;

    try {
        const stored = localStorage.getItem(WATCHLIST_KEY);
        let items: RecentItem[] = stored ? JSON.parse(stored) : [];

        // Check if already in watchlist
        const exists = items.some(i => i.id === item.id && i.type === item.type);
        if (exists) return;

        items.unshift({ ...item, last_played: Date.now() });
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
        window.dispatchEvent(new Event("watchlistUpdated"));
    } catch (error) {
        console.error("Error adding to watchlist:", error);
    }
}

export function removeFromWatchlist(id: string, type: string) {
    if (typeof window === "undefined") return;

    try {
        const stored = localStorage.getItem(WATCHLIST_KEY);
        if (!stored) return;

        let items: RecentItem[] = JSON.parse(stored);
        items = items.filter(i => !(i.id === id && i.type === type));

        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
        window.dispatchEvent(new Event("watchlistUpdated"));
    } catch (error) {
        console.error("Error removing from watchlist:", error);
    }
}

export function isInWatchlist(id: string, type: string): boolean {
    if (typeof window === "undefined") return false;

    try {
        const stored = localStorage.getItem(WATCHLIST_KEY);
        if (!stored) return false;

        const items: RecentItem[] = JSON.parse(stored);
        return items.some(i => i.id === id && i.type === type);
    } catch (error) {
        return false;
    }
}

export function getWatchlist(): RecentItem[] {
    if (typeof window === "undefined") return [];

    try {
        const stored = localStorage.getItem(WATCHLIST_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Error getting watchlist:", error);
        return [];
    }
}
