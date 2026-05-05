"use server";

import { tmdb } from "@/lib/tmdb";
import { redirect } from "next/navigation";

export async function getSeasonDetailsAction(tvId: string, seasonNumber: number) {
    try {
        const data = await tmdb.getSeasonDetails(tvId, seasonNumber);
        return data;
    } catch (error) {
        return null;
    }
}

export async function surpriseMe() {
    const movie = await tmdb.getRandomContent();
    if (movie) {
        redirect(`/watch/${movie.media_type}/${movie.id}`);
    }
}

export async function getTrailerAction(type: "movie" | "tv", id: string) {
    return await tmdb.getTrailer(type, id);
}
