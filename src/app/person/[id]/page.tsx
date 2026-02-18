
import React from 'react';
import { tmdb, TMDB_CONFIG } from '@/lib/tmdb';
import MovieRow from '@/components/MovieRow';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PersonPageProps {
    params: Promise<{ id: string }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
    const { id } = await params;
    const person = await tmdb.getPersonDetails(id);
    const credits = await tmdb.getPersonCredits(id);

    // Filter credits to unique and popular ones, sort by popularity
    const knownFor = credits.cast
        ?.sort((a: any, b: any) => b.popularity - a.popularity)
        .slice(0, 20) || [];

    const profileUrl = person.profile_path
        ? `${TMDB_CONFIG.posterSizes.medium}${person.profile_path}`
        : null;

    return (
        <div className="min-h-screen bg-prime-dark text-white font-sans selection:bg-prime-blue selection:text-white pb-20">
            <Navbar />

            <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto animate-in fade-in duration-700">
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                        <div className="w-64 h-96 rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 relative group">
                            {profileUrl ? (
                                <img
                                    src={profileUrl}
                                    alt={person.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold">{person.name}</h1>

                        <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                            {person.birthday && (
                                <div>
                                    <span className="block text-xs uppercase font-bold text-gray-500 mb-1">Born</span>
                                    <span className="text-white">{person.birthday}</span>
                                    {person.place_of_birth && <span className="ml-1">in {person.place_of_birth}</span>}
                                </div>
                            )}
                            {person.known_for_department && (
                                <div>
                                    <span className="block text-xs uppercase font-bold text-gray-500 mb-1">Known For</span>
                                    <span className="text-white">{person.known_for_department}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold border-l-4 border-prime-blue pl-3">Biography</h3>
                            <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                                {person.biography || "No biography available."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Known For */}
                <div className="mt-16">
                    <MovieRow title="Known For" movies={knownFor} />
                </div>
            </div>
        </div>
    );
}
