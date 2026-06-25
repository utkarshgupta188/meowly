import React from "react";
import { tmdb, TMDB_CONFIG } from "@/lib/tmdb";
import NetworkDetailsClient from "@/components/NetworkDetailsClient";

interface NetworkPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NetworkPageProps) {
    const { id } = await params;
    const network = await tmdb.getNetworkDetails(id);
    if (!network) return { title: "Network | Meowly" };

    return {
        title: `${network.name} | Meowly`,
        description: `Explore TV shows on the ${network.name} network.`,
        openGraph: {
            title: `${network.name} | Meowly`,
            description: `Explore TV shows on the ${network.name} network.`,
            images: network.logo_path ? [
                {
                    url: `${TMDB_CONFIG.imageBase}/w500${network.logo_path}`,
                    alt: network.name
                }
            ] : []
        }
    };
}

export default async function NetworkPage({ params }: NetworkPageProps) {
    const { id } = await params;
    const network = await tmdb.getNetworkDetails(id);

    if (!network) {
        return (
            <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <h1 className="text-2xl font-black mb-4">Network Not Found</h1>
                <p className="text-gray-400">The requested network or streaming service could not be found.</p>
            </main>
        );
    }

    const tvShowsData = await tmdb.getDiscoverByNetwork(id);
    const tvShows = tvShowsData?.results || [];

    // Find the most popular show with a backdrop path to use as a beautiful header background
    const bestBackdrop = tvShows.find(item => item.backdrop_path)?.backdrop_path;
    const backdropUrl = bestBackdrop ? `${TMDB_CONFIG.backdropSizes.large}${bestBackdrop}` : null;

    return (
        <main className="min-h-screen bg-black pb-20">
            <NetworkDetailsClient 
                network={network}
                tvShows={tvShows}
                backdropUrl={backdropUrl}
                tvShowsTotalResults={tvShowsData?.totalResults || 0}
                tvShowsTotalPages={tvShowsData?.totalPages || 1}
            />
        </main>
    );
}
