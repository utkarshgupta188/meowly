import { tmdb } from "@/lib/tmdb";
import MovieRow from "@/components/MovieRow";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Movie & TV Genres",
    description: "Browse through a wide range of movie and TV show categories on Meowly.",
    alternates: {
        canonical: "https://meowly.qzz.io/categories",
    },
};

export default async function CategoriesPage() {
    const [movieGenres, tvGenres] = await Promise.all([
        tmdb.getGenreList("movie"),
        tmdb.getGenreList("tv"),
    ]);

    // Fetch some initial data for a few categories to make it look full
    const [action, comedy, drama, animation] = await Promise.all([
        tmdb.getDiscover("movie", { genreId: "28" }),
        tmdb.getDiscover("movie", { genreId: "35" }),
        tmdb.getDiscover("tv", { genreId: "18" }),
        tmdb.getDiscover("movie", { genreId: "16" }),
    ]);

    return (
        <main className="min-h-screen pb-20 bg-black pt-40 md:pt-32 overflow-x-hidden">
            <div className="px-8 md:px-12 space-y-6 md:space-y-12">
                <h1 className="text-3xl md:text-5xl font-bold mb-8">Categories</h1>

                <section className="animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
                    <h2 className="text-xl font-semibold mb-6 text-gray-400 uppercase tracking-widest">Movie Genres</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
                        {movieGenres.slice(0, 18).map((genre: any, i: number) => (
                            <Link
                                key={genre.id}
                                href={`/categories/${genre.id}?name=${encodeURIComponent(genre.name)}&type=movie`}
                                className="relative group overflow-hidden bg-white/5 backdrop-blur-sm border border-white/5 hover:border-accent/50 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10 text-gray-400 group-hover:text-white font-bold text-lg tracking-wide group-hover:tracking-wider transition-all duration-300">
                                    {genre.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200">
                    <h2 className="text-xl font-semibold mb-6 text-gray-400 uppercase tracking-widest">TV Series Genres</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
                        {tvGenres.slice(0, 18).map((genre: any, i: number) => (
                            <Link
                                key={genre.id}
                                href={`/categories/${genre.id}?name=${encodeURIComponent(genre.name)}&type=tv`}
                                className="relative group overflow-hidden bg-white/5 backdrop-blur-sm border border-white/5 hover:border-accent/50 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10 text-gray-400 group-hover:text-white font-bold text-lg tracking-wide group-hover:tracking-wider transition-all duration-300">
                                    {genre.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                <div className="space-y-6 md:space-y-16 mt-10 md:mt-20">
                    <MovieRow title="Action Blockbusters" movies={action} className="px-0 md:px-0" />
                    <MovieRow title="Comedy Hits" movies={comedy} className="px-0 md:px-0" />
                    <MovieRow title="Drama Series" movies={drama} className="px-0 md:px-0" />
                    <MovieRow title="Animation Favorites" movies={animation} className="px-0 md:px-0" />
                </div>
            </div>

            {/* SEO Rich Text Content Section */}
            <div className="max-w-7xl mx-auto px-8 md:px-12 mt-20 md:mt-32 border-t border-white/5 pt-16 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-gray-400">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            Explore the Universe of Genres
                        </h2>
                        <p className="leading-relaxed">
                            Genres are the roadmap of cinema, guiding us through different worlds, emotions, and experiences. 
                            At Meowly, we've organized our vast library into intuitive categories, making it easier than ever to find the exact type of story you're in the mood for. 
                            From the high-octane thrills of Action to the thought-provoking depth of Documentaries, our genre sections are your gateway to discovery.
                        </p>
                        <p className="leading-relaxed">
                            Our classification covers both feature films and TV series, ensuring that whether you're looking for a quick movie night or a multi-season binge, you can find the right content within your favorite genres. 
                            Explore categories like Sci-Fi, Horror, Mystery, and Family to discover hidden gems and trending masterpieces.
                        </p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 space-y-6">
                        <h3 className="text-lg font-bold text-white mb-4">Genre Highlights</h3>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>
                                <strong className="text-white">Action & Adventure:</strong> Fast-paced storytelling, heroic journeys, and breathtaking stunts that keep you on the edge of your seat.
                            </p>
                            <p>
                                <strong className="text-white">Comedy:</strong> From witty satire to slapstick humor, find the shows and movies that bring laughter to your day.
                            </p>
                            <p>
                                <strong className="text-white">Science Fiction:</strong> Explore futuristic worlds, advanced technology, and the boundless possibilities of the human imagination.
                            </p>
                            <p>
                                <strong className="text-white">Documentary:</strong> Deep dives into real-world stories, history, science, and the fascinating lives of people around the globe.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
