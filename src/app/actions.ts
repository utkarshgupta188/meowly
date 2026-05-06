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

export async function getMoctaleReviewsAction(slug: string) {
    try {
        const url = `https://www.moctale.in/api/activity/content/${slug}/reviews-summary`;
        const cookie = process.env.MOCTALE_COOKIE || "";

        let finalCookie = cookie;
        if (cookie.includes('auth_token=')) {
            const match = cookie.match(/auth_token=([^;]+)/);
            if (match) {
                finalCookie = `auth_token=${match[1]}`;
            }
        } else if (cookie && !cookie.includes('=')) {
            finalCookie = `auth_token=${cookie}`;
        }

        const { gotScraping } = await import('got-scraping');

        const headers = {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9,hi;q=0.8',
            'cache-control': 'no-cache',
            'dnt': '1',
            'pragma': 'no-cache',
            'priority': 'u=1, i',
            'referer': `https://www.moctale.in/content/${slug}`,
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'cookie': finalCookie
        };

        const res = await gotScraping({
            url: url,
            method: 'GET',
            headers: headers,
            retry: { limit: 0 } // Do not retry on failure to prevent rate-limiting
        });

        if (res.statusCode !== 200) {
            console.error(`Moctale Reviews fetch failed for slug ${slug}: ${res.statusCode}`);
            return { error: `Moctale API returned ${res.statusCode}`, status: res.statusCode };
        }

        const data = JSON.parse(res.body);
        return { data };
    } catch (error: any) {
        console.error(`Moctale Reviews action exception for slug ${slug}:`, error.message || error);
        return { error: error.message || "Unknown error" };
    }
}

