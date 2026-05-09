"use client";

const RECENTLY_PLAYED_KEY = "meowly_recently_played";
const WATCHLIST_KEY = "meowly_watchlist";
const MAX_RECENT = 20;

export interface RecentItem {
    id: string;
    type: "movie" | "tv";
    title: string;
    overview?: string;
    poster_path: string;
    backdrop_path?: string;
    vote_average?: number;
    release_date?: string;
    first_air_date?: string;
    last_played: number;
    season?: number;
    episode?: number;
    tagline?: string;
}

// In-memory caches to bypass redundant localStorage reads and JSON.parse operations
let cachedWatchlist: RecentItem[] | null = null;
let cachedRecentlyPlayed: RecentItem[] | null = null;

// Multi-tab or custom event invalidation listeners
if (typeof window !== "undefined") {
    window.addEventListener("watchlistUpdated", () => {
        cachedWatchlist = null;
    });
    window.addEventListener("recentlyPlayedUpdated", () => {
        cachedRecentlyPlayed = null;
    });
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
        cachedRecentlyPlayed = items;
        
        // Dispatch a custom event to notify other components
        window.dispatchEvent(new Event("recentlyPlayedUpdated"));
    } catch (error) {
        // Silently fail
    }
}

export function getRecentlyPlayed(): RecentItem[] {
    if (typeof window === "undefined") return [];
    if (cachedRecentlyPlayed !== null) return cachedRecentlyPlayed;

    try {
        const stored = localStorage.getItem(RECENTLY_PLAYED_KEY);
        cachedRecentlyPlayed = stored ? JSON.parse(stored) : [];
        return cachedRecentlyPlayed!;
    } catch (error) {
        return [];
    }
}

export function removeFromRecentlyPlayed(id: string, type: string) {
    if (typeof window === "undefined") return;

    try {
        const stored = localStorage.getItem(RECENTLY_PLAYED_KEY);
        if (!stored) return;

        let items: RecentItem[] = JSON.parse(stored);
        items = items.filter(i => !(i.id === id && i.type === type));

        localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(items));
        cachedRecentlyPlayed = items;
        window.dispatchEvent(new Event("recentlyPlayedUpdated"));
    } catch (error) {
        // Silently fail
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
        cachedWatchlist = items;
        window.dispatchEvent(new Event("watchlistUpdated"));
    } catch (error) {
        // Silently fail
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
        cachedWatchlist = items;
        window.dispatchEvent(new Event("watchlistUpdated"));
    } catch (error) {
        // Silently fail
    }
}

export function isInWatchlist(id: string, type: string): boolean {
    const items = getWatchlist();
    return items.some(i => i.id === id && i.type === type);
}

export function getWatchlist(): RecentItem[] {
    if (typeof window === "undefined") return [];
    if (cachedWatchlist !== null) return cachedWatchlist;

    try {
        const stored = localStorage.getItem(WATCHLIST_KEY);
        cachedWatchlist = stored ? JSON.parse(stored) : [];
        return cachedWatchlist!;
    } catch (error) {
        return [];
    }
}
