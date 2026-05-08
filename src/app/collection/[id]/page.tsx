import Navbar from "@/components/Navbar";
import { tmdb, TMDB_CONFIG } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const collection = await tmdb.getCollection(id);
    if (!collection) return { title: "Collection | Meowly" };

    return {
        title: `${collection.name} | Meowly`,
        description: collection.overview,
        openGraph: {
            title: `${collection.name} | Meowly`,
            description: collection.overview,
            images: [
                {
                    url: `https://image.tmdb.org/t/p/w1280${collection.backdrop_path}`,
                    width: 1280,
                    height: 720,
                    alt: collection.name
                },
            ],
        },
    };
}

export default async function CollectionPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    const resolvedParams = await params;
    const collectionId = resolvedParams.id;

    const collection = await tmdb.getCollection(collectionId);

    if (!collection) {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center">
                <Navbar />
                <p className="text-white text-xl">Collection not found.</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black pb-20 overflow-x-hidden">
            <Navbar />
            
            {/* Header / Hero */}
            <div className="relative h-[60vh] md:h-[70vh] w-full mb-12">
                <div className="absolute inset-0">
                    <img 
                        src={`${TMDB_CONFIG.imageBase}/original${collection.backdrop_path}`}
                        className="w-full h-full object-cover brightness-50"
                        alt={collection.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 space-y-4 max-w-6xl">
                    <span className="text-accent text-xs font-black uppercase tracking-[0.4em]">Movie Collection</span>
                    <h1 className="text-4xl md:text-7xl font-black text-white leading-tight">
                        {collection.name}
                    </h1>
                    {collection.overview && (
                        <p className="text-gray-300 text-sm md:text-lg max-w-3xl line-clamp-3 md:line-clamp-none leading-relaxed">
                            {collection.overview}
                        </p>
                    )}
                </div>
            </div>

            {/* Collection Items */}
            <div className="px-4 sm:px-8 md:px-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-1.5 h-8 bg-accent rounded-full" />
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Included Movies
                        <span className="ml-3 text-gray-500 font-medium text-lg">({collection.parts?.length || 0})</span>
                    </h2>
                </div>

                {collection.parts && collection.parts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                        {collection.parts.map((movie: any) => (
                            <MovieCard key={movie.id} movie={{ ...movie, media_type: 'movie' }} isFluid={true} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <p className="text-xl">No movies found in this collection.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
