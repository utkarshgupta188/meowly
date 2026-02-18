const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const TMDB_CONFIG = {
    baseUrl: BASE_URL,
    imageBase: IMAGE_BASE_URL,
    posterSizes: {
        small: `${IMAGE_BASE_URL}/w200`,
        medium: `${IMAGE_BASE_URL}/w500`,
        large: `${IMAGE_BASE_URL}/original`,
    },
    backdropSizes: {
        small: `${IMAGE_BASE_URL}/w300`,
        medium: `${IMAGE_BASE_URL}/w780`,
        large: `${IMAGE_BASE_URL}/original`,
    },
};

async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
    if (!API_KEY || API_KEY === "your_tmdb_api_key_here") {
        console.warn(`TMDB API Key is missing or default. Skipping fetch for ${endpoint}`);
        return null;
    }

    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = new URL(`${BASE_URL}${cleanEndpoint}`);
    url.searchParams.append("api_key", API_KEY);
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

            const res = await fetch(url.toString(), {
                next: { revalidate: 3600 },
                headers: { "Accept": "application/json" },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!res.ok) {
                if (res.status === 429) { // Rate limit
                    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                    throw new Error(`Rate limited: ${res.status}`);
                }
                console.error(`TMDB error [${res.status}]: ${res.statusText} for ${cleanEndpoint}`);
                return null;
            }

            const data = await res.json();
            return data;
        } catch (error: any) {
            attempt++;
            console.warn(`TMDB Fetch Attempt ${attempt} failed for ${cleanEndpoint}: ${error.message}`);
            if (attempt >= MAX_RETRIES) {
                console.error(`TMDB Final Failure for ${cleanEndpoint}`);
                return null;
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
        }
    }
    return null;
}

export type Movie = {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    media_type: "movie" | "tv";
};

export const tmdb = {
    getTrending: async (type: "movie" | "tv" | "all" = "all"): Promise<Movie[]> => {
        const data = await fetchTMDB(`/trending/${type}/day`);
        return data?.results || [];
    },
    getTopRated: async (type: "movie" | "tv"): Promise<Movie[]> => {
        const data = await fetchTMDB(`/${type}/top_rated`);
        return (data?.results || []).map((item: any) => ({ ...item, media_type: type }));
    },
    getPopular: async (type: "movie" | "tv"): Promise<Movie[]> => {
        const data = await fetchTMDB(`/${type}/popular`);
        return (data?.results || []).map((item: any) => ({ ...item, media_type: type }));
    },
    getDetails: async (type: "movie" | "tv", id: string) => {
        const data = await fetchTMDB(`/${type}/${id}`, { append_to_response: "videos,credits,recommendations,release_dates,content_ratings" });
        return data || {};
    },
    search: async (query: string): Promise<Movie[]> => {
        const data = await fetchTMDB("/search/multi", { query });
        return (data?.results || []).filter((item: any) => item.media_type === "movie" || item.media_type === "tv");
    },
    getGenreList: async (type: "movie" | "tv") => {
        const data = await fetchTMDB(`/genre/${type}/list`);
        return data?.genres || [];
    },
    getDiscover: async (type: "movie" | "tv", genreId?: string): Promise<Movie[]> => {
        const params: Record<string, string> = {};
        if (genreId) params.with_genres = genreId;
        const data = await fetchTMDB(`/discover/${type}`, params);
        return (data?.results || []).map((item: any) => ({ ...item, media_type: type }));
    },
    getSeasonDetails: async (tvId: string, seasonNumber: number) => {
        const data = await fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`);
        return data || {};
    },
    getPersonDetails: async (id: string) => {
        const data = await fetchTMDB(`/person/${id}`);
        return data || {};
    },
    getPersonCredits: async (id: string) => {
        const data = await fetchTMDB(`/person/${id}/combined_credits`);
        return data || {};
    }
};
