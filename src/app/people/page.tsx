import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PeopleClient from "./PeopleClient";
import { tmdb } from "@/lib/tmdb";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cast & Creators | Meowly",
    description: "Browse the world's most popular screen icons, actors, legendary directors, and brilliant screenwriters on Meowly.",
};

export default async function PeoplePage() {
    // Fetch 3 pages of popular people concurrently for a rich, expansive showcase
    const [page1, page2, page3] = await Promise.all([
        tmdb.getPopularPeople(1).catch(() => null),
        tmdb.getPopularPeople(2).catch(() => null),
        tmdb.getPopularPeople(3).catch(() => null),
    ]);

    // Merge and filter out duplicates
    const rawResults = [
        ...(page1?.results || []),
        ...(page2?.results || []),
        ...(page3?.results || []),
    ];

    const uniquePeopleMap = new Map();
    rawResults.forEach((person: any) => {
        if (person && person.id && !uniquePeopleMap.has(person.id)) {
            uniquePeopleMap.set(person.id, person);
        }
    });

    const popularPeople = Array.from(uniquePeopleMap.values());

    return (
        <main className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
            <Navbar />
            <div className="pt-32 px-6 md:px-12 max-w-7xl mx-auto">
                <PeopleClient initialPeople={popularPeople} />
            </div>
            <Footer />
        </main>
    );
}
