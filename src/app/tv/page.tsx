import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import { tmdb } from "@/lib/tmdb";
import InfiniteGenres from "@/components/InfiniteGenres";

export default async function TVPage() {
    const [trending, popular, topRated, airingToday, onTheAir, scifi, drama] = await Promise.all([
        tmdb.getTrending("tv"),
        tmdb.getPopular("tv"),
        tmdb.getTopRated("tv"),
        tmdb.getAiringToday(),
        tmdb.getOnTheAir(),
        tmdb.getDiscover("tv", { genreId: "10765" }), // Sci-Fi & Fantasy
        tmdb.getDiscover("tv", { genreId: "18" }),    // Drama
    ]);

    return (
        <main className="min-h-screen pb-20 overflow-x-hidden">
            <Navbar />
            {trending.length > 0 && <Hero movies={trending} />}
            
            <div className="relative z-40">
                <div className="mt-10 md:mt-4 space-y-12 transition-all duration-500">
                    <MovieRow title="Airing Today" movies={airingToday} />
                    <MovieRow title="Currently Airing (On The Air)" movies={onTheAir} />
                    <MovieRow title="Trending TV Shows" movies={trending} />
                    <MovieRow title="Popular Series" movies={popular} />
                    <MovieRow title="Top Rated" movies={topRated} />
                    <MovieRow title="Sci-Fi & Fantasy" movies={scifi} />
                    <MovieRow title="Drama Series" movies={drama} />
                    <InfiniteGenres type="tv" />
                </div>
            </div>
        </main>
    );
}
