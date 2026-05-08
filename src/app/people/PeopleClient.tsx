"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Sparkles, User, Award, Film, Star, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TMDB_CONFIG } from "@/lib/tmdb";

interface KnownForMedia {
    id: number;
    title?: string;
    name?: string;
    media_type: "movie" | "tv";
    poster_path?: string;
}

interface Person {
    id: number;
    name: string;
    profile_path: string;
    known_for_department: string;
    popularity: number;
    known_for: KnownForMedia[];
}

interface PeopleClientProps {
    initialPeople: Person[];
}

export default function PeopleClient({ initialPeople }: PeopleClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeDepartment, setActiveDepartment] = useState<"All" | "Acting" | "Directing" | "Production" | "Writing">("All");

    // Extract all unique departments to make filters dynamic, with fallbacks
    const departments = useMemo(() => {
        const set = new Set<string>(["All"]);
        initialPeople.forEach(p => {
            if (p.known_for_department) {
                set.add(p.known_for_department);
            }
        });
        return Array.from(set);
    }, [initialPeople]);

    // Search and filter logic
    const filteredPeople = useMemo(() => {
        return initialPeople.filter(person => {
            const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                person.known_for.some(m => (m.title || m.name || "").toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesDept = activeDepartment === "All" || person.known_for_department === activeDepartment;

            return matchesSearch && matchesDept;
        });
    }, [initialPeople, searchQuery, activeDepartment]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    } as any;

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 15
            }
        }
    } as any;

    return (
        <div className="w-full">
            {/* Spotlight Header / Hero */}
            <div className="relative overflow-hidden py-16 md:py-24 rounded-3xl mb-12 border border-white/10 bg-gradient-to-br from-zinc-900/60 via-black/80 to-zinc-900/60 shadow-3xl">
                {/* Visual accents */}
                <div className="absolute -top-12 -left-12 w-72 h-72 rounded-full bg-white/5 blur-3xl animate-pulse" />
                <div className="absolute -bottom-12 -right-12 w-72 h-72 rounded-full bg-white/5 blur-3xl animate-pulse" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-semibold tracking-wider uppercase backdrop-blur-sm shadow-inner"
                    >
                        <Sparkles className="h-4 w-4 text-white animate-pulse" />
                        Cast & Creators
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white tracking-tight"
                    >
                        Celebrated <span className="text-white italic">Personalities</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-medium"
                    >
                        Explore biographies, careers, and works of outstanding actors, legendary directors, and brilliant filmmakers behind your favorite stories.
                    </motion.p>
                </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-10">
                {/* Department Toggle Tabs */}
                <div className="flex gap-1 p-1.5 rounded-2xl bg-white/5 border border-white/5 overflow-x-auto max-w-full scrollbar-hide">
                    {["All", "Acting", "Directing", "Production", "Writing"].map((dept) => {
                        const isSelected = activeDepartment === dept;
                        return (
                            <button
                                key={dept}
                                onClick={() => setActiveDepartment(dept as any)}
                                className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                                    isSelected
                                        ? "bg-white text-black font-extrabold shadow-md shadow-white/10"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {dept === "All" ? "All Stars" : dept}
                            </button>
                        );
                    })}
                </div>

                {/* Realtime Search Input */}
                <div className="relative w-full md:max-w-md bg-white/5 border border-white/10 rounded-full px-5 py-3.5 focus-within:border-white/40 focus-within:ring-1 focus-within:ring-white/20 transition-all">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search actors or directors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none w-full pl-6 text-sm text-white placeholder-gray-500 outline-none"
                    />
                </div>
            </div>

            {/* People Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${activeDepartment}-${searchQuery}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
                >
                    {filteredPeople.length > 0 ? (
                        filteredPeople.map((person) => {
                            const avatarUrl = person.profile_path
                                ? `${TMDB_CONFIG.posterSizes.medium}${person.profile_path}`
                                : null;

                            return (
                                <motion.div
                                    key={person.id}
                                    variants={cardVariants}
                                    layout
                                    className="group relative flex flex-col items-center"
                                >
                                    <Link href={`/person/${person.id}`} className="w-full flex flex-col items-center text-center space-y-4">
                                        {/* Avatar Frame with hover zoom & glow */}
                                        <div className="relative w-40 h-40 md:w-44 md:h-44 rounded-full overflow-hidden border border-white/10 shadow-lg group-hover:border-white/30 transition-all duration-500 group-hover:shadow-2xl group-hover:scale-105">
                                            {avatarUrl ? (
                                                <img
                                                    src={avatarUrl}
                                                    alt={person.name}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-gray-600">
                                                    <User className="h-16 w-16" />
                                                </div>
                                            )}

                                            {/* Top Overlay shimmer */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            
                                            {/* Popularity Badge on hover */}
                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 border border-white/10 text-[10px] font-semibold text-white tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                <Star className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" />
                                                <span>{Math.round(person.popularity)}</span>
                                            </div>
                                        </div>

                                        {/* Meta names */}
                                        <div className="space-y-1 w-full px-2">
                                            <h3 className="text-base font-bold text-white group-hover:text-white transition-colors truncate">
                                                {person.name}
                                            </h3>
                                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                                                {person.known_for_department || "Staff"}
                                            </p>
                                        </div>
                                    </Link>

                                    {/* Known For mini tray */}
                                    <div className="w-full text-center mt-2.5 px-3 min-h-[36px]">
                                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                                            {person.known_for && person.known_for.length > 0 ? (
                                                person.known_for.map((m, idx) => (
                                                    <span key={m.id}>
                                                        {m.title || m.name}
                                                        {idx < person.known_for.length - 1 ? " • " : ""}
                                                    </span>
                                                ))
                                            ) : (
                                                <span>Works behind scenes</span>
                                            )}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-4 rounded-full bg-white/5 border border-white/10 text-gray-500">
                                <Search className="h-10 w-10" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-white">No film stars match your search</h3>
                                <p className="text-sm text-gray-400">Try verifying the spelling or picking a different department filter.</p>
                            </div>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wide transition-all duration-300 border border-white/5 cursor-pointer"
                                >
                                    Clear Search Query
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
