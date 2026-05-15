import React from "react";
import { tmdb } from "@/lib/tmdb";
import { Metadata } from "next";
import CompaniesClient from "./CompaniesClient";

export const metadata: Metadata = {
    title: "Production Studios & Companies | Meowly",
    description: "Discover the world's leading film production companies, iconic studios, and entertainment networks that shape modern cinema on Meowly.",
};

// Selection of the most iconic and highly cataloged production companies on TMDB
const POPULAR_STUDIOS = [
    { id: "420", defaultName: "Marvel Studios" },
    { id: "1", defaultName: "Lucasfilm" },
    { id: "3", defaultName: "Pixar" },
    { id: "174", defaultName: "Warner Bros. Pictures" },
    { id: "33", defaultName: "Universal Pictures" },
    { id: "2", defaultName: "Walt Disney Pictures" },
    { id: "4", defaultName: "Paramount" },
    { id: "5", defaultName: "Columbia Pictures" },
    { id: "41077", defaultName: "A24" },
    { id: "923", defaultName: "Legendary Pictures" },
    { id: "12", defaultName: "New Line Cinema" },
    { id: "7", defaultName: "DreamWorks Pictures" },
    { id: "10342", defaultName: "Studio Ghibli" },
    { id: "21", defaultName: "Metro-Goldwyn-Mayer" },
];

export default async function CompaniesPage() {
    // Fetch all details concurrently with a graceful fallback for each request
    const companiesData = await Promise.all(
        POPULAR_STUDIOS.map(async (studio) => {
            try {
                const data = await tmdb.getCompanyDetails(studio.id);
                if (data && data.name) {
                    return data;
                }
                return {
                    id: parseInt(studio.id),
                    name: studio.defaultName,
                    logo_path: null,
                    headquarters: "",
                    homepage: "",
                    origin_country: "US"
                };
            } catch (e) {
                return {
                    id: parseInt(studio.id),
                    name: studio.defaultName,
                    logo_path: null,
                    headquarters: "",
                    homepage: "",
                    origin_country: "US"
                };
            }
        })
    );

    // Filter out any potential nulls and keep unique elements
    const uniqueCompaniesMap = new Map();
    companiesData.forEach((comp) => {
        if (comp && comp.id && !uniqueCompaniesMap.has(comp.id)) {
            uniqueCompaniesMap.set(comp.id, comp);
        }
    });

    const popularCompanies = Array.from(uniqueCompaniesMap.values());

    return (
        <main className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
            <div className="pt-24 sm:pt-28 md:pt-32 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
                <CompaniesClient initialCompanies={popularCompanies} />
            </div>

            {/* SEO Rich Text Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 mt-20 md:mt-32 border-t border-white/5 pt-16 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-gray-400">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            The Architect of Modern Cinema
                        </h2>
                        <p className="leading-relaxed">
                            Behind every great film is a production studio that dared to bring a vision to life. 
                            From the historic "Big Five" of Hollywood's Golden Age to the modern powerhouses of animation and independent filmmaking, production companies are the backbone of the entertainment industry. 
                            At Meowly, we spotlight these iconic institutions, allowing you to explore the vast filmographies of the world's most influential studios.
                        </p>
                        <p className="leading-relaxed">
                            Discover the magic of Marvel Studios' superhero epics, Lucasfilm's intergalactic sagas, or Pixar's heartwarming animated masterpieces. 
                            Explore the independent spirit of A24 or the storied history of Warner Bros. and Universal Pictures. 
                            Understanding the studio behind a movie often gives you a deeper appreciation for its style, quality, and creative direction.
                        </p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 space-y-6">
                        <h3 className="text-lg font-bold text-white mb-4">Major Studios</h3>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>
                                <strong className="text-white">Marvel Studios:</strong> The creators of the Marvel Cinematic Universe (MCU), revolutionizing modern blockbuster storytelling with interconnected sagas.
                            </p>
                            <p>
                                <strong className="text-white">Warner Bros. Pictures:</strong> A legacy studio responsible for many of cinema's most iconic franchises, from Harry Potter to the DC Universe.
                            </p>
                            <p>
                                <strong className="text-white">A24:</strong> A modern leader in independent film, known for its unique, artist-driven projects and critical darlings.
                            </p>
                            <p>
                                <strong className="text-white">Studio Ghibli:</strong> The legendary Japanese animation studio that has captivated audiences worldwide with its hand-drawn masterpieces.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
