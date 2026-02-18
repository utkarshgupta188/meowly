import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import { tmdb } from "@/lib/tmdb";

export default async function TVPage() {
    const [trending, popular, topRated, scifi, drama] = await Promise.all([
        tmdb.getTrending("tv"),
        tmdb.getPopular("tv"),
        tmdb.getTopRated("tv"),
        tmdb.getDiscover("tv", "10765"), // Sci-Fi & Fantasy
        tmdb.getDiscover("tv", "18"),    // Drama
    ]);

    return (
        <main className="min-h-screen pb-20 overflow-x-hidden">
            <Navbar />
            {trending.length > 0 && <Hero movies={trending} />}
            <div className="relative z-10 -mt-12 md:-mt-24 space-y-12">
                <MovieRow title="Trending TV Shows" movies={trending} />
                <MovieRow title="Popular Series" movies={popular} />
                <MovieRow title="Top Rated" movies={topRated} />
                <MovieRow title="Sci-Fi & Fantasy" movies={scifi} />
                <MovieRow title="Drama Series" movies={drama} />
            </div>
        </main>
    );
}
