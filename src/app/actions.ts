"use server";

import { tmdb } from "@/lib/tmdb";

export async function getSeasonDetailsAction(tvId: string, seasonNumber: number) {
    try {
        const data = await tmdb.getSeasonDetails(tvId, seasonNumber);
        return data;
    } catch (error) {
        console.error("Failed to fetch season details:", error);
        return null;
    }
}
