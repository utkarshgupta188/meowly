import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import { tmdb } from "@/lib/tmdb";

export default async function Home() {
  const [
    trending,
    popularMovies,
    popularTV,
    topRated,
    actionMovies,
    comedyMovies,
  ] = await Promise.all([
    tmdb.getTrending("all"),
    tmdb.getPopular("movie"),
    tmdb.getPopular("tv"),
    tmdb.getTopRated("movie"),
    tmdb.getDiscover("movie", "28"), // Action
    tmdb.getDiscover("movie", "35"), // Comedy
  ]);

  // Use the first trending item for the Hero
  const heroMovie = trending[0];

  return (
    <main className="min-h-screen pb-20 overflow-x-hidden">
      <Navbar />

      {trending && trending.length > 0 && <Hero movies={trending} />}

      <div className="relative z-40 -mt-12 md:-mt-24 space-y-12 transition-all duration-500">
        <MovieRow title="Trending Now" movies={trending} />
        <MovieRow title="Popular Movies" movies={popularMovies} />
        <MovieRow title="Top Rated" movies={topRated} />
        <MovieRow title="TV Shows" movies={popularTV} />
        <MovieRow title="Action Blockbusters" movies={actionMovies} />
        <MovieRow title="Comedy Hits" movies={comedyMovies} />
      </div>


    </main>
  );
}
