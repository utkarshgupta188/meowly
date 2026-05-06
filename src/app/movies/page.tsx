import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import { tmdb } from "@/lib/tmdb";
import InfiniteGenres from "@/components/InfiniteGenres";

export default async function MoviesPage() {
    const [trending, popular, topRated, nowPlaying, upcoming, action, horror] = await Promise.all([
        tmdb.getTrending("movie"),
        tmdb.getPopular("movie"),
        tmdb.getTopRated("movie"),
        tmdb.getNowPlaying(),
        tmdb.getUpcoming(),
        tmdb.getDiscover("movie", { genreId: "28" }),
        tmdb.getDiscover("movie", { genreId: "27" }),
    ]);

    return (
        <main className="min-h-screen pb-20 overflow-x-hidden">
            <Navbar />
            {trending.length > 0 && <Hero movies={trending} />}
            
            <div className="relative z-40">
                <div className="mt-10 md:mt-4 space-y-12 transition-all duration-500">
                    <MovieRow title="Now Playing in Theaters" movies={nowPlaying} />
                    <MovieRow title="Upcoming Anticipated" movies={upcoming} />
                    <MovieRow title="Trending Movies" movies={trending} />
                    <MovieRow title="Popular Now" movies={popular} />
                    <MovieRow title="Top Rated" movies={topRated} />
                    <MovieRow title="Action Movies" movies={action} />
                    <MovieRow title="Horror Movies" movies={horror} />
                    <InfiniteGenres type="movie" />
                </div>
            </div>
        </main>
    );
}
