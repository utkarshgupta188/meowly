import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { tmdb } from "@/lib/tmdb";
import WatchContainer from "@/components/WatchContainer";

interface WatchPageProps {
    params: Promise<{
        type: "movie" | "tv";
        id: string;
    }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
    const { type, id } = await params;
    const movie = await tmdb.getDetails(type, id);

    if (!movie || !movie.id) {
        return (
            <main className="min-h-screen bg-prime-dark flex items-center justify-center p-4 text-center">
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold">Content not found or API error</h1>
                    <p className="text-gray-400">We couldn't load the details for this {type}. Please try again later.</p>
                    <Link href="/" className="inline-block bg-prime-blue text-white px-6 py-2 rounded-md font-bold">
                        Back to Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-prime-dark pb-20">
            <Navbar />
            <WatchContainer type={type} id={id} tmdbData={movie} />
        </main>
    );
}
