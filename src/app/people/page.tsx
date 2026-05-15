import React from "react";
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
            <div className="pt-24 sm:pt-28 md:pt-32 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
                <PeopleClient initialPeople={popularPeople} />
            </div>

            {/* SEO Rich Text Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 mt-20 md:mt-32 border-t border-white/5 pt-16 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-gray-400">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            Celebrating the Faces of Storytelling
                        </h2>
                        <p className="leading-relaxed">
                            A movie is only as good as the people who bring it to life. 
                            From the legendary actors who grace the screen with their presence to the brilliant directors and screenwriters who work tirelessly behind the scenes, the "People" of cinema are the heartbeat of every story. 
                            At Meowly, we celebrate these talented individuals, providing you with deep insights into their careers and contributions to the world of entertainment.
                        </p>
                        <p className="leading-relaxed">
                            Discover the most popular screen icons, trending actors, and award-winning filmmakers from across the globe. 
                            Explore their full filmographies, see their latest projects, and follow the careers of the creators who inspire you most. 
                            Whether you're a fan of Hollywood royalty or international trailblazers, our people-focused discovery tool is your ultimate guide.
                        </p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 space-y-6">
                        <h3 className="text-lg font-bold text-white mb-4">Legendary Icons</h3>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>
                                <strong className="text-white">Academy Award Winners:</strong> Honoring the highest achievements in acting and directing with detailed profiles of Oscar recipients.
                            </p>
                            <p>
                                <strong className="text-white">Modern Trailblazers:</strong> Spotlight on the new generation of actors and creators who are redefining the future of television and film.
                            </p>
                            <p>
                                <strong className="text-white">Global Talent:</strong> From European art-house favorites to the superstars of Bollywood and East Asian cinema.
                            </p>
                            <p>
                                <strong className="text-white">Directorial Visionaries:</strong> Profiles of the masterminds who have shaped the visual language of modern storytelling.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
