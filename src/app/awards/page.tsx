import React from "react";
import AwardsClient from "./AwardsClient";
import { tmdb } from "@/lib/tmdb";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Awards | Meowly",
    description: "Browse prestigious award-winning masterworks, from Oscar Best Picture winners to Cannes Palme d'Or masterpieces and Filmfare classics.",
};

export default async function AwardsPage() {
    // Fetch all 10 lists concurrently
    const [
        oscars,
        globesDrama,
        globesComedy,
        cannes,
        venice,
        berlin,
        oscarsAnimated,
        oscarsForeign,
        oscarsDocumentary,
        filmfare
    ] = await Promise.all([
        tmdb.getListDetails(28).catch(() => []),
        tmdb.getListDetails(234).catch(() => []),
        tmdb.getListDetails(235).catch(() => []),
        tmdb.getListDetails(229).catch(() => []),
        tmdb.getListDetails(230).catch(() => []),
        tmdb.getListDetails(267).catch(() => []),
        tmdb.getListDetails(265).catch(() => []),
        tmdb.getListDetails(264).catch(() => []),
        tmdb.getListDetails(266).catch(() => []),
        tmdb.getListDetails(365).catch(() => [])
    ]);

    return (
        <main className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
            <div className="pt-24 sm:pt-28 md:pt-32 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
                <AwardsClient
                    oscars={oscars}
                    globesDrama={globesDrama}
                    globesComedy={globesComedy}
                    cannes={cannes}
                    venice={venice}
                    berlin={berlin}
                    oscarsAnimated={oscarsAnimated}
                    oscarsForeign={oscarsForeign}
                    oscarsDocumentary={oscarsDocumentary}
                    filmfare={filmfare}
                />
            </div>

            {/* SEO Rich Text Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 mt-20 md:mt-32 border-t border-white/5 pt-16 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-gray-400">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            Celebrating Cinematic Excellence
                        </h2>
                        <p className="leading-relaxed">
                            Awards are more than just trophies; they are a celebration of storytelling, technical mastery, and the profound impact of cinema on our culture. 
                            At Meowly, we've curated lists of the most prestigious award-winning films from around the globe, ensuring you have access to the very best that the world of movies has to offer.
                        </p>
                        <p className="leading-relaxed">
                            From the glamorous red carpets of the Academy Awards to the critical acclaim of the Cannes Film Festival and the rich heritage of the Filmfare Awards, our collections span across continents and categories. 
                            Discover "Best Picture" winners, groundbreaking documentaries, and breathtaking animated features that have defined the history of filmmaking.
                        </p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 space-y-6">
                        <h3 className="text-lg font-bold text-white mb-4">Prestigious Institutions</h3>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>
                                <strong className="text-white">Academy Awards (Oscars):</strong> The most recognized film awards in the world, honoring excellence in the American and international film industries.
                            </p>
                            <p>
                                <strong className="text-white">Cannes Film Festival:</strong> Known for its "Palme d'Or," it is one of the "Big Three" European film festivals, focusing on artistic innovation.
                            </p>
                            <p>
                                <strong className="text-white">Golden Globes:</strong> Awarded by the Hollywood Foreign Press Association, these honors recognize both domestic and foreign film and television.
                            </p>
                            <p>
                                <strong className="text-white">Filmfare Awards:</strong> One of the oldest and most prominent film events in India, celebrating the vibrant Hindi-language film industry.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
