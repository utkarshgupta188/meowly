import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import FilterBar from "@/components/FilterBar";
import { tmdb } from "@/lib/tmdb";
import SearchGrid from "@/components/SearchGrid";

interface TVPageProps {
    searchParams: Promise<{
        genre?: string;
        year?: string;
        sort?: string;
    }>;
}

export default async function TVPage({ searchParams }: TVPageProps) {
    const params = await searchParams;
    const genres = await tmdb.getGenreList("tv");
    
    // If we have filters, show a grid, otherwise show the rows
    const isFiltered = params.genre || params.year || (params.sort && params.sort !== "popularity.desc");

    if (isFiltered) {
        const filteredResults = await tmdb.getDiscover("tv", {
            genreId: params.genre,
            year: params.year,
            sortBy: params.sort
        });

        return (
            <main className="min-h-screen pb-20 overflow-x-hidden">
                <Navbar />
                <div className="pt-32 px-6 md:px-12">
                    <h1 className="text-4xl font-black text-white mb-8">TV Shows</h1>
                    <FilterBar type="tv" genres={genres} />
                    <div className="mt-8">
                        <SearchGrid results={filteredResults} />
                    </div>
                </div>
            </main>
        );
    }

    const [trending, popular, topRated, scifi, drama] = await Promise.all([
        tmdb.getTrending("tv"),
        tmdb.getPopular("tv"),
        tmdb.getTopRated("tv"),
        tmdb.getDiscover("tv", { genreId: "10765" }), // Sci-Fi & Fantasy
        tmdb.getDiscover("tv", { genreId: "18" }),    // Drama
    ]);

    return (
        <main className="min-h-screen pb-20 overflow-x-hidden">
            <Navbar />
            {trending.length > 0 && <Hero movies={trending} />}
            
            <div className="relative z-40">
                <FilterBar type="tv" genres={genres} />
                
                <div className="mt-4 md:-mt-10 space-y-12 transition-all duration-500">
                    <MovieRow title="Trending TV Shows" movies={trending} />
                    <MovieRow title="Popular Series" movies={popular} />
                    <MovieRow title="Top Rated" movies={topRated} />
                    <MovieRow title="Sci-Fi & Fantasy" movies={scifi} />
                    <MovieRow title="Drama Series" movies={drama} />
                </div>
            </div>
        </main>
    );
}
