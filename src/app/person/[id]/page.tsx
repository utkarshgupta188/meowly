
import React from 'react';
import { tmdb, TMDB_CONFIG } from '@/lib/tmdb';
import MovieRow from '@/components/MovieRow';
import { ArrowLeft, Star, Calendar, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import PersonDetailsClient from '@/components/PersonDetailsClient';

interface PersonPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PersonPageProps) {
    const { id } = await params;
    const person = await tmdb.getPersonDetails(id);
    if (!person) return { title: "Person | Meowly" };

    return {
        title: `${person.name} | Meowly`,
        description: person.biography,
        openGraph: {
            title: `${person.name} | Meowly`,
            description: person.biography,
            images: [
                {
                    url: `https://image.tmdb.org/t/p/w500${person.profile_path}`,
                    width: 500,
                    height: 750,
                    alt: person.name
                },
            ],
        },
    };
}

export default async function PersonPage({ params }: PersonPageProps) {
    const { id } = await params;
    const person = await tmdb.getPersonDetails(id);
    const credits = await tmdb.getPersonCredits(id);

    // Filter credits to unique and popular ones, sort by popularity
    // Filter credits to unique and popular ones, sort by popularity
    const uniqueCreditsMap = new Map();
    credits.cast?.forEach((m: any) => {
        const key = `${m.id}-${m.media_type}`;
        if (!uniqueCreditsMap.has(key)) {
            uniqueCreditsMap.set(key, m);
        }
    });

    const knownFor = Array.from(uniqueCreditsMap.values())
        .sort((a: any, b: any) => b.popularity - a.popularity)
        .slice(0, 20);

    const bestBackdrop = knownFor.find((m: any) => m.backdrop_path)?.backdrop_path;
    const backdropUrl = bestBackdrop ? `${TMDB_CONFIG.backdropSizes.large}${bestBackdrop}` : null;

    const profileUrl = person.profile_path
        ? `${TMDB_CONFIG.posterSizes.medium}${person.profile_path}`
        : null;

    return (
        <main className="min-h-screen bg-black pb-20">
            <PersonDetailsClient 
                person={person}
                credits={credits}
                knownFor={knownFor}
                backdropUrl={backdropUrl}
                profileUrl={profileUrl}
            />
        </main>
    );
}
