import React from "react";
import { tmdb, TMDB_CONFIG } from "@/lib/tmdb";
import CompanyDetailsClient from "@/components/CompanyDetailsClient";

interface CompanyPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CompanyPageProps) {
    const { id } = await params;
    const company = await tmdb.getCompanyDetails(id);
    if (!company) return { title: "Studio | Meowly" };

    return {
        title: `${company.name} | Meowly`,
        description: `Explore movies and TV shows produced by ${company.name}.`,
        openGraph: {
            title: `${company.name} | Meowly`,
            description: `Explore movies and TV shows produced by ${company.name}.`,
            images: company.logo_path ? [
                {
                    url: `${TMDB_CONFIG.imageBase}/w500${company.logo_path}`,
                    alt: company.name
                }
            ] : []
        }
    };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
    const { id } = await params;
    const company = await tmdb.getCompanyDetails(id);

    if (!company) {
        return (
            <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <h1 className="text-2xl font-black mb-4">Studio Not Found</h1>
                <p className="text-gray-400">The requested production studio could not be found.</p>
            </main>
        );
    }

    const [movies, tvShows] = await Promise.all([
        tmdb.getDiscoverByCompany(id, "movie"),
        tmdb.getDiscoverByCompany(id, "tv")
    ]);

    // Find the most popular movie/show with a backdrop path to use as a beautiful header background
    const allItems = [...movies, ...tvShows].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    const bestBackdrop = allItems.find(item => item.backdrop_path)?.backdrop_path;
    const backdropUrl = bestBackdrop ? `${TMDB_CONFIG.imageBase}/original${bestBackdrop}` : null;

    return (
        <main className="min-h-screen bg-black pb-20">
            <CompanyDetailsClient 
                company={company}
                movies={movies}
                tvShows={tvShows}
                backdropUrl={backdropUrl}
            />
        </main>
    );
}
