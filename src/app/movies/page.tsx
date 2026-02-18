import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import { tmdb } from "@/lib/tmdb";

export default async function MoviesPage() {
    const [trending, popular, topRated, action, horror] = await Promise.all([
        tmdb.getTrending("movie"),
        tmdb.getPopular("movie"),
        tmdb.getTopRated("movie"),
        tmdb.getDiscover("movie", "28"),
        tmdb.getDiscover("movie", "27"),
    ]);

    return (
        <main className="min-h-screen pb-20 overflow-x-hidden">
            <Navbar />
            {trending.length > 0 && <Hero movies={trending} />}
            <div className="relative z-10 -mt-12 md:-mt-24 space-y-12">
                <MovieRow title="Trending Movies" movies={trending} />
                <MovieRow title="Popular Now" movies={popular} />
                <MovieRow title="Top Rated" movies={topRated} />
                <MovieRow title="Action Movies" movies={action} />
                <MovieRow title="Horror Movies" movies={horror} />
            </div>
        </main>
    );
}
