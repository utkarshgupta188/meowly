"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Calendar, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import MovieRow from './MovieRow';
import { TMDB_CONFIG } from '@/lib/tmdb';

interface PersonDetailsClientProps {
    person: any;
    credits: any;
    knownFor: any[];
    backdropUrl: string | null;
    profileUrl: string | null;
}

export default function PersonDetailsClient({ person, credits, knownFor, backdropUrl, profileUrl }: PersonDetailsClientProps) {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-accent selection:text-black">
            {/* Cinematic Hero Backdrop */}
            <div className="relative w-full h-[60vh] overflow-hidden">
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

                <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-12">
                     <Link href="/" className="absolute top-32 left-6 md:left-12 inline-flex items-center text-gray-400 hover:text-white transition-all group p-3 glass-pill">
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold">Back</span>
                    </Link>
                    
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

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Biography */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold border-l-4 border-accent pl-4">Biography</h2>
                            <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap font-light">
                                {person.biography || `${person.name} is a known professional in the ${person.known_for_department} department.`}
                            </p>
                        </section>

                        <section className="pt-8">
                             <MovieRow title="Known For" movies={knownFor} />
                        </section>
                    </div>

                    {/* Right: Personal Info Card */}
                    <div className="space-y-6">
                        <div className="bg-prime-card p-6 rounded-3xl border border-white/10 shadow-xl">
                            <h3 className="text-sm uppercase font-black tracking-widest text-gray-500 mb-6">Personal Info</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Gender</p>
                                    <p className="text-white font-medium">{person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "Not specified"}</p>
                                </div>
                                {person.also_known_as?.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase">Also Known As</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {person.also_known_as.slice(0, 5).map((name: string) => (
                                                <span key={name} className="text-xs bg-white/5 px-3 py-1 rounded-full text-gray-300 border border-white/10">{name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Popularity Score</p>
                                    <div className="flex items-center gap-2 mt-1 text-accent font-black text-xl">
                                        <Star className="w-5 h-5 fill-current" />
                                        {person.popularity?.toFixed(1)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
