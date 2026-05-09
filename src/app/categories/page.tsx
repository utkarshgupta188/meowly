import { tmdb } from "@/lib/tmdb";
import MovieRow from "@/components/MovieRow";
import Link from "next/link";

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
        </main>
    );
}
