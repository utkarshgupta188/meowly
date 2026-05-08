import React from "react";
import Navbar from "@/components/Navbar";
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
            <Navbar />
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
        </main>
    );
}
