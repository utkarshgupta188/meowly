import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import FilterBar from "@/components/FilterBar";
import { tmdb } from "@/lib/tmdb";
import SearchGrid from "@/components/SearchGrid";

interface MoviesPageProps {
    searchParams: Promise<{
        genre?: string;
        year?: string;
        sort?: string;
    }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
    const params = await searchParams;
    const genres = await tmdb.getGenreList("movie");
    
    // If we have filters, show a grid, otherwise show the rows
    const isFiltered = params.genre || params.year || (params.sort && params.sort !== "popularity.desc");

    if (isFiltered) {
        const filteredResults = await tmdb.getDiscover("movie", {
            genreId: params.genre,
            year: params.year,
            sortBy: params.sort
        });

        return (
            <main className="min-h-screen pb-20 overflow-x-hidden">
                <Navbar />
                <div className="pt-32 px-6 md:px-12">
                    <h1 className="text-4xl font-black text-white mb-8">Movies</h1>
                    <FilterBar type="movie" genres={genres} />
                    <div className="mt-8">
                        <SearchGrid results={filteredResults} />
                    </div>
                </div>
            </main>
        );
    }

    const [trending, popular, topRated, action, horror] = await Promise.all([
        tmdb.getTrending("movie"),
        tmdb.getPopular("movie"),
        tmdb.getTopRated("movie"),
        tmdb.getDiscover("movie", { genreId: "28" }),
        tmdb.getDiscover("movie", { genreId: "27" }),
    ]);

    return (
        <main className="min-h-screen pb-20 overflow-x-hidden">
            <Navbar />
            {trending.length > 0 && <Hero movies={trending} />}
            
            <div className="relative z-40">
                <FilterBar type="movie" genres={genres} />
                
                <div className="mt-10 md:mt-4 space-y-12 transition-all duration-500">
                    <MovieRow title="Trending Movies" movies={trending} />
                    <MovieRow title="Popular Now" movies={popular} />
                    <MovieRow title="Top Rated" movies={topRated} />
                    <MovieRow title="Action Movies" movies={action} />
                    <MovieRow title="Horror Movies" movies={horror} />
                </div>
            </div>
        </main>
    );
}
