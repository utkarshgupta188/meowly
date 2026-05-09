"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Calendar, MapPin, User, Instagram, Twitter, Facebook, Youtube, Globe, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MovieRow from './MovieRow';
import { TMDB_CONFIG } from '@/lib/tmdb';

const Tiktok = (props: React.ComponentProps<"svg">) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

interface SocialLinkProps {
    icon: React.ElementType;
    href: string;
    label: string;
}

const SocialLink = ({ icon: Icon, href, label }: SocialLinkProps) => {
    if (!href) return null;
    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-accent/50 transition-all group"
            title={label}
        >
            <Icon className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
        </a>
    );
};

interface PersonDetailsClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    person: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    credits: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    knownFor: any[];
    backdropUrl: string | null;
    profileUrl: string | null;
}

export default function PersonDetailsClient({ person, credits, knownFor, backdropUrl, profileUrl }: PersonDetailsClientProps) {
    const router = useRouter();
    const [isBioExpanded, setIsBioExpanded] = React.useState(false);

    const externalIds = person.external_ids || {};
    const images = person.images?.profiles || [];
    const biography = person.biography || `${person.name} is a known professional in the ${person.known_for_department} department.`;
    const shouldTruncateBio = biography.length > 600;
    const displayBio = shouldTruncateBio && !isBioExpanded ? biography.slice(0, 600) + "..." : biography;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-accent selection:text-black">
            {/* Back Button */}
            <button 
                onClick={() => router.back()}
                className="fixed top-6 left-4 sm:left-8 md:left-12 z-[100] p-3 bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 rounded-full text-white transition-all hover:scale-110 group"
                title="Go Back"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>


            {/* Cinematic Hero Backdrop */}
            <div className="relative w-full min-h-[35vh] overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {backdropUrl ? (
                        <img
                            src={backdropUrl}
                            alt={person.name}
                            className="w-full h-full object-cover opacity-40 blur-sm scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-prime-dark" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 min-h-[35vh] max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col justify-end pt-10 pb-8">
                    <div className="flex flex-col md:flex-row gap-8 items-end">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-48 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 flex-shrink-0"
                        >
                            {profileUrl ? (
                                <img src={profileUrl} alt={person.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center"><User className="w-12 h-12 text-gray-600" /></div>
                            )}
                        </motion.div>
                        <div className="flex-1 pb-4">
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-7xl font-black tracking-tighter mb-4"
                            >
                                {person.name}
                            </motion.h1>
                            <div className="flex flex-wrap gap-6 text-gray-300 font-medium">
                                {person.birthday && (
                                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                        <Calendar className="w-4 h-4 text-accent" />
                                        <span>{person.birthday}</span>
                                    </div>
                                )}
                                {person.place_of_birth && (
                                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                        <MapPin className="w-4 h-4 text-accent" />
                                        <span className="line-clamp-1">{person.place_of_birth}</span>
                                    </div>
                                )}
                                {person.known_for_department && (
                                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                        <Star className="w-4 h-4 text-accent" />
                                        <span>{person.known_for_department}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                    {/* Left: Biography */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black border-l-4 border-accent pl-4 uppercase tracking-tight">Biography</h2>
                            <div className="relative">
                                <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap font-light">
                                    {displayBio}
                                </p>
                                {shouldTruncateBio && (
                                    <button 
                                        onClick={() => setIsBioExpanded(!isBioExpanded)}
                                        className="mt-4 flex items-center gap-2 text-accent font-bold hover:underline group"
                                    >
                                        {isBioExpanded ? (
                                            <>Show Less <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" /></>
                                        ) : (
                                            <>Read Full Biography <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* Image Gallery if available */}
                        {images.length > 1 && (
                            <section className="space-y-6 pt-8">
                                <h2 className="text-2xl font-black border-l-4 border-accent pl-4 uppercase tracking-tight flex items-center gap-2">
                                    <ImageIcon className="w-6 h-6 text-accent" />
                                    Gallery
                                </h2>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {images.slice(1, 10).map((img: { file_path: string }, idx: number) => (
                                        <div key={idx} className="w-32 md:w-40 flex-shrink-0 aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 hover:border-accent/50 transition-all group cursor-pointer shadow-lg">
                                            <img 
                                                src={`${TMDB_CONFIG.imageBase}/w500${img.file_path}`} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                alt={`${person.name} gallery ${idx}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right: Personal Info Card */}
                    <div className="space-y-6">
                        <div className="bg-prime-card/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                            <h3 className="text-xs uppercase font-black tracking-widest text-gray-500 mb-8">Personal Details</h3>
                            <div className="space-y-8">
                                <div className="flex flex-wrap gap-3">
                                    <SocialLink 
                                        icon={Instagram} 
                                        href={externalIds.instagram_id ? `https://instagram.com/${externalIds.instagram_id}` : ""} 
                                        label="Instagram"
                                    />
                                    <SocialLink 
                                        icon={Twitter} 
                                        href={externalIds.twitter_id ? `https://twitter.com/${externalIds.twitter_id}` : ""} 
                                        label="Twitter"
                                    />
                                    <SocialLink 
                                        icon={Facebook} 
                                        href={externalIds.facebook_id ? `https://facebook.com/${externalIds.facebook_id}` : ""} 
                                        label="Facebook"
                                    />
                                    <SocialLink 
                                        icon={Youtube} 
                                        href={externalIds.youtube_id ? `https://youtube.com/${externalIds.youtube_id}` : ""} 
                                        label="YouTube"
                                    />
                                    <SocialLink 
                                        icon={Tiktok} 
                                        href={externalIds.tiktok_id ? `https://tiktok.com/@${externalIds.tiktok_id}` : ""} 
                                        label="TikTok"
                                    />
                                    <SocialLink 
                                        icon={Globe} 
                                        href={externalIds.wikidata_id ? `https://wikidata.org/wiki/${externalIds.wikidata_id}` : ""} 
                                        label="Wikidata"
                                    />
                                    <SocialLink 
                                        icon={Globe} 
                                        href={externalIds.imdb_id ? `https://imdb.com/name/${externalIds.imdb_id}` : ""} 
                                        label="IMDb Profile"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Gender</p>
                                        <p className="text-white font-bold">{person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "Not specified"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Popularity</p>
                                        <div className="flex items-center gap-1.5 text-accent font-black">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            {person.popularity?.toFixed(1)}
                                        </div>
                                    </div>
                                </div>

                                {person.also_known_as?.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Also Known As</p>
                                        <div className="flex flex-wrap gap-2">
                                            {person.also_known_as.slice(0, 5).map((name: string) => (
                                                <span key={name} className="text-[10px] bg-white/5 px-3 py-1.5 rounded-full text-gray-400 border border-white/10 font-bold">{name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Standard Sized Known For Section */}
                <section className="-mx-4 sm:-mx-8 md:-mx-12 mt-12">
                    <MovieRow 
                        title="Known For" 
                        movies={knownFor} 
                    />
                </section>
            </div>
        </div>
    );
}
