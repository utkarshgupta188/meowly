"use server";

import { tmdb } from "@/lib/tmdb";
import { redirect } from "next/navigation";

import { gotScraping } from 'got-scraping';

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

export async function getNextGenresAction(startIndex: number, limit: number = 3, type: "all" | "movie" | "tv" = "all") {
    let genreList = [];

    if (type === "all") {
        genreList = [
            { title: "Sci-Fi & Fantasy", type: "tv" as const, genreId: "10765" },
            { title: "Adventure Quests", type: "movie" as const, genreId: "12" },
            { title: "Gripping Dramas", type: "movie" as const, genreId: "18" },
            { title: "Chilling Horror", type: "movie" as const, genreId: "27" },
            { title: "Crime Thrillers", type: "movie" as const, genreId: "80" },
            { title: "Animated Wonders", type: "movie" as const, genreId: "16" },
            { title: "Mystery & Suspense", type: "movie" as const, genreId: "9648" },
            { title: "Romantic Getaways", type: "movie" as const, genreId: "10749" },
            { title: "Reality Obsessions", type: "tv" as const, genreId: "10764" },
            { title: "Insightful Documentaries", type: "movie" as const, genreId: "99" },
            { title: "Wild West Tales", type: "movie" as const, genreId: "37" },
            { title: "Musical Journeys", type: "movie" as const, genreId: "10402" },
            { title: "Historic Wars", type: "movie" as const, genreId: "36" }
        ];
    } else if (type === "movie") {
        genreList = [
            { title: "Sci-Fi & Fantasy", type: "movie" as const, genreId: "878" },
            { title: "Adventure Quests", type: "movie" as const, genreId: "12" },
            { title: "Animated Wonders", type: "movie" as const, genreId: "16" },
            { title: "Comedy Hits", type: "movie" as const, genreId: "35" },
            { title: "Crime Thrillers", type: "movie" as const, genreId: "80" },
            { title: "Insightful Documentaries", type: "movie" as const, genreId: "99" },
            { title: "Romantic Getaways", type: "movie" as const, genreId: "10749" },
            { title: "Mystery & Suspense", type: "movie" as const, genreId: "9648" },
            { title: "Historic Wars", type: "movie" as const, genreId: "36" },
            { title: "Wild West Tales", type: "movie" as const, genreId: "37" },
            { title: "Musical Journeys", type: "movie" as const, genreId: "10402" }
        ];
    } else { // type === "tv"
        genreList = [
            { title: "Action & Adventure", type: "tv" as const, genreId: "10759" },
            { title: "Animated Wonders", type: "tv" as const, genreId: "16" },
            { title: "Comedy Hits", type: "tv" as const, genreId: "35" },
            { title: "Crime Thrillers", type: "tv" as const, genreId: "80" },
            { title: "Mystery & Suspense", type: "tv" as const, genreId: "9648" },
            { title: "Reality Obsessions", type: "tv" as const, genreId: "10764" },
            { title: "Insightful Documentaries", type: "tv" as const, genreId: "99" },
            { title: "Historic Wars", type: "tv" as const, genreId: "10768" },
            { title: "Wild West Tales", type: "tv" as const, genreId: "37" },
            { title: "Musical Journeys", type: "tv" as const, genreId: "10402" }
        ];
    }

    const slice = genreList.slice(startIndex, startIndex + limit);
    if (slice.length === 0) return [];

    const rows = await Promise.all(slice.map(async (g) => {
        try {
            const movies = await tmdb.getDiscover(g.type, { genreId: g.genreId });
            return {
                title: g.title,
                movies: movies || []
            };
        } catch (e) {
            return { title: g.title, movies: [] };
        }
    }));

    return rows.filter(r => r.movies.length > 0);
}

export async function searchAction(query: string) {
    try {
        if (!query || query.trim() === "") return [];
        return await tmdb.search(query.trim());
    } catch (error) {
        console.error("searchAction error:", error);
        return [];
    }
}

export async function getTrendingAction(type: "movie" | "tv" | "all" = "all") {
    try {
        return await tmdb.getTrending(type);
    } catch (error) {
        console.error("getTrendingAction error:", error);
        return [];
    }
}

export async function getGenreListAction(type: "movie" | "tv" = "movie") {
    try {
        return await tmdb.getGenreList(type);
    } catch (error) {
        console.error("getGenreListAction error:", error);
        return [];
    }
}

export async function getDiscoverByCompanyAction(companyId: string, type: "movie" | "tv", page: number) {
    try {
        return await tmdb.getDiscoverByCompany(companyId, type, page);
    } catch (error) {
        console.error("getDiscoverByCompanyAction error:", error);
        return { results: [], totalPages: 0, totalResults: 0 };
    }
}

export async function getDiscoverByNetworkAction(networkId: string, page: number) {
    try {
        return await tmdb.getDiscoverByNetwork(networkId, page);
    } catch (error) {
        console.error("getDiscoverByNetworkAction error:", error);
        return { results: [], totalPages: 0, totalResults: 0 };
    }
}
