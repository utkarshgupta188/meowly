import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import { tmdb } from "@/lib/tmdb";
import RecentlyPlayedRow from "@/components/RecentlyPlayedRow";
import InfiniteGenres from "@/components/InfiniteGenres";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://meowly.qzz.io",
  },
};

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
    tmdb.getDiscover("movie", { genreId: "28" }), // Action
    tmdb.getDiscover("movie", { genreId: "35" }), // Comedy
  ]);

  // Fetch logos for the top 10 for the Hero
  const heroMovies = await Promise.all(
    trending.slice(0, 10).map(async (m) => {
      try {
        const details = await tmdb.getDetails(m.media_type as any, m.id.toString());
        return { ...m, logos: details.images?.logos || [] };
      } catch (e) {
        return m;
      }
    })
  );

  return (
    <main className="min-h-screen pb-20 overflow-x-hidden">
      <h1 className="sr-only">Meowly | Watch Movies & TV Shows Online Free</h1>

      {heroMovies && heroMovies.length > 0 && <Hero movies={heroMovies as any} />}

      <div className="relative z-40 mt-4 md:-mt-10 space-y-6 md:space-y-12 transition-all duration-500">
        <RecentlyPlayedRow />
        <MovieRow title="Trending Now" movies={trending} />
        <MovieRow title="Popular Movies" movies={popularMovies} />
        <MovieRow title="Top Rated" movies={topRated} />
        <MovieRow title="TV Shows" movies={popularTV} />
        <MovieRow title="Action Blockbusters" movies={actionMovies} />
        <MovieRow title="Comedy Hits" movies={comedyMovies} />
        <InfiniteGenres />
      </div>

      {/* SEO Rich Text Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 md:mt-32 space-y-16 border-t border-white/5 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tight">
              Unlimited Streaming, Reimagined
            </h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              Meowly is your premier destination for discovering and watching the latest movies and TV shows online for free. 
              Our platform is designed with a premium aesthetic inspired by industry leaders, ensuring that your viewing experience is not just about the content, but also about the journey. 
              With a vast library powered by TMDB, you have access to millions of titles, from timeless classics to the latest blockbusters.
            </p>
            <p className="text-gray-400 leading-relaxed text-lg">
              Whether you're looking for action-packed adventures, heart-wrenching dramas, or side-splitting comedies, Meowly's intuitive categorization and powerful search engine make it easy to find exactly what you're in the mood for. 
              Enjoy high-definition streaming on any device, anywhere, anytime.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 space-y-8">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Is Meowly free to use?</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Yes, Meowly is completely free to use. We don't require any subscriptions or hidden fees to access our library.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Do I need to create an account?</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  No account is necessary. You can start watching immediately without providing any personal information.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">What devices are supported?</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Meowly is fully responsive and works on desktops, tablets, and smartphones. It's also optimized for casting to larger screens.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4 pb-10">
          <h2 className="text-2xl font-bold text-white">Join Millions of Movie Lovers</h2>
          <p className="text-gray-400">
            Start your cinematic journey with Meowly today. Discover new favorites, build your watchlist, and enjoy a premium streaming experience that respects your time and your privacy.
          </p>
        </div>
      </div>
    </main>
  );
}
