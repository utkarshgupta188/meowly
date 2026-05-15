import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import { tmdb } from "@/lib/tmdb";
import InfiniteGenres from "@/components/InfiniteGenres";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Watch Top Rated TV Series and Shows Online Free | Meowly",
    description: "Watch the top rated TV series and shows online for free. Stream the best TV shows, currently airing series, and all-time favorites on Meowly.",
    alternates: {
        canonical: "https://meowly.qzz.io/tv",
    },
};

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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "itemListElement": trending.slice(0, 10).map((show, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "item": {
                                "@type": "TVSeries",
                                "name": show.title || show.name,
                                "url": `https://meowly.qzz.io/watch/tv/${show.id}`,
                                "image": `https://image.tmdb.org/t/p/w500${show.poster_path}`,
                                "datePublished": show.first_air_date
                            }
                        }))
                    })
                }}
            />
            <h1 className="sr-only">TV Shows | Watch Top Rated TV Series Online Free</h1>
            {trending.length > 0 && <Hero movies={trending} />}

            <div className="relative z-40">
                <div className="mt-10 md:mt-4 space-y-6 md:space-y-12 transition-all duration-500">
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

            {/* SEO Rich Text Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 md:mt-32 space-y-16 border-t border-white/5 pt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black text-white tracking-tight">
                            Binge-Worthy TV Series & Shows
                        </h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            Experience the best of television with Meowly's comprehensive library of TV shows and series. 
                            From critically acclaimed dramas and hilarious sitcoms to captivating sci-fi and reality TV, we bring the best of the small screen directly to your devices. 
                            Our platform ensures you never miss an episode of your favorite series, with updates on currently airing shows and a deep archive of completed classics.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            Explore popular series, top-rated shows, and what's airing today. 
                            With Meowly, you can track your progress, discover new shows based on your interests, and enjoy a premium streaming experience tailored for TV enthusiasts.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 space-y-8">
                        <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">
                            TV Streaming Features
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-white font-semibold mb-2">Episode Discovery</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Easily navigate through seasons and episodes with our clean, user-friendly interface.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-2">Real-Time Updates</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Stay up to date with "Airing Today" and "On The Air" sections that refresh automatically.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-2">Personalized Experience</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Create your own watchlist and keep track of the series you're currently binge-watching.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
