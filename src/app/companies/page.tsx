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
        </main>
    );
}
