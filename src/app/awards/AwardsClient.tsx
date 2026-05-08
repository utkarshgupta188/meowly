"use client";

import React, { useState, useMemo } from "react";
import { Movie } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import { 
    Trophy, 
    Star, 
    Award, 
    Search, 
    Sparkles, 
    Film, 
    ArrowUpDown, 
    Flame, 
    Globe, 
    Palette, 
    Video, 
    Heart, 
    Compass,
    Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AwardCategory {
    id: string;
    name: string;
    shortName: string;
    group: "academies" | "festivals" | "specialized";
    icon: React.ComponentType<any>;
    color: string;
    textColor: string;
    borderColor: string;
    description: string;
    movies: Movie[];
}

interface AwardsClientProps {
    oscars: Movie[];
    globesDrama: Movie[];
    globesComedy: Movie[];
    cannes: Movie[];
    venice: Movie[];
    berlin: Movie[];
    oscarsAnimated: Movie[];
    oscarsForeign: Movie[];
    oscarsDocumentary: Movie[];
    filmfare: Movie[];
}

const AwardsClient = ({
    oscars,
    globesDrama,
    globesComedy,
    cannes,
    venice,
    berlin,
    oscarsAnimated,
    oscarsForeign,
    oscarsDocumentary,
    filmfare
}: AwardsClientProps) => {
    // Define the full catalog of TMDB Award categories
    const categories: AwardCategory[] = useMemo(() => [
        {
            id: "oscars",
            name: "The Academy Awards (Oscars) - Best Picture",
            shortName: "Oscars (Best Picture)",
            group: "academies",
            icon: Trophy,
            color: "from-amber-500/20 to-yellow-600/20",
            textColor: "text-amber-400",
            borderColor: "border-amber-500/30",
            description: "Celebrating cinematic masterpieces that won the prestigious Academy Award for Best Picture.",
            movies: oscars
        },
        {
            id: "globes-drama",
            name: "Golden Globes (Best Picture – Drama)",
            shortName: "Globes (Drama)",
            group: "academies",
            icon: Sparkles,
            color: "from-yellow-400/20 to-amber-600/20",
            textColor: "text-yellow-400",
            borderColor: "border-yellow-400/30",
            description: "Honoring outstanding dramatic motion pictures recognized by the Hollywood Foreign Press Association.",
            movies: globesDrama
        },
        {
            id: "globes-comedy",
            name: "Golden Globes (Best Picture – Musical/Comedy)",
            shortName: "Globes (Comedy)",
            group: "academies",
            icon: Award,
            color: "from-yellow-300/20 to-orange-500/20",
            textColor: "text-yellow-300",
            borderColor: "border-yellow-300/30",
            description: "Celebrating top comedy and musical films awarded at the annual Golden Globe awards.",
            movies: globesComedy
        },
        {
            id: "filmfare",
            name: "Filmfare Awards (Best Film - Bollywood)",
            shortName: "Filmfare (Bollywood)",
            group: "academies",
            icon: Heart,
            color: "from-rose-500/20 to-red-600/20",
            textColor: "text-rose-400",
            borderColor: "border-rose-500/30",
            description: "Honoring outstanding cinematic excellence in Hindi-language cinema, representing Bollywood's most prestigious prize.",
            movies: filmfare
        },
        {
            id: "cannes",
            name: "Cannes Film Festival (Palme d'Or)",
            shortName: "Cannes (Palme d'Or)",
            group: "festivals",
            icon: Star,
            color: "from-emerald-500/20 to-teal-600/20",
            textColor: "text-emerald-400",
            borderColor: "border-emerald-500/30",
            description: "The highest prize awarded at the Cannes Film Festival, representing the peak of international art-house cinema.",
            movies: cannes
        },
        {
            id: "venice",
            name: "Venice Film Festival (Golden Lion)",
            shortName: "Venice (Golden Lion)",
            group: "festivals",
            icon: Compass,
            color: "from-indigo-500/20 to-blue-600/20",
            textColor: "text-indigo-400",
            borderColor: "border-indigo-500/30",
            description: "Recognizing bold, artistic achievements from the oldest and one of the most prestigious film festivals in the world.",
            movies: venice
        },
        {
            id: "berlin",
            name: "Berlin Film Festival (Golden Bear)",
            shortName: "Berlin (Golden Bear)",
            group: "festivals",
            icon: Flame,
            color: "from-rose-500/20 to-pink-600/20",
            textColor: "text-rose-400",
            borderColor: "border-rose-500/30",
            description: "Distinguished films awarded the premier accolade at the Berlinale, celebrating diverse global stories.",
            movies: berlin
        },
        {
            id: "oscars-animated",
            name: "Academy Awards (Best Animated Feature)",
            shortName: "Oscars (Animated)",
            group: "specialized",
            icon: Palette,
            color: "from-sky-500/20 to-indigo-600/20",
            textColor: "text-sky-400",
            borderColor: "border-sky-500/30",
            description: "Celebrating the heights of visual storytelling and extraordinary achievements in animated feature filmmaking.",
            movies: oscarsAnimated
        },
        {
            id: "oscars-foreign",
            name: "Academy Awards (Best Foreign Language Film)",
            shortName: "Oscars (International)",
            group: "specialized",
            icon: Globe,
            color: "from-teal-400/20 to-cyan-600/20",
            textColor: "text-teal-400",
            borderColor: "border-teal-400/30",
            description: "Outstanding feature-length motion pictures produced outside the United States with a predominantly non-English track.",
            movies: oscarsForeign
        },
        {
            id: "oscars-documentary",
            name: "Academy Awards (Best Documentary Feature)",
            shortName: "Oscars (Documentary)",
            group: "specialized",
            icon: Video,
            color: "from-amber-600/20 to-orange-700/20",
            textColor: "text-amber-500",
            borderColor: "border-amber-600/30",
            description: "Honoring filmmakers representing creative non-fiction storytelling and significant documentary achievements.",
            movies: oscarsDocumentary
        }
    ], [
        oscars, globesDrama, globesComedy, cannes, venice, berlin,
        oscarsAnimated, oscarsForeign, oscarsDocumentary, filmfare
    ]);

    const [activeGroup, setActiveGroup] = useState<"all" | "academies" | "festivals" | "specialized">("all");
    const [activeTab, setActiveTab] = useState<string>("oscars");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("release_desc");

    // Filter categories depending on active group tab selection
    const filteredCategories = useMemo(() => {
        if (activeGroup === "all") return categories;
        return categories.filter(cat => cat.group === activeGroup);
    }, [activeGroup, categories]);

    const currentCategory = useMemo(() => {
        return categories.find(cat => cat.id === activeTab) || categories[0];
    }, [activeTab, categories]);

    const processedMovies = useMemo(() => {
        let list = [...currentCategory.movies];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            list = list.filter(movie => 
                (movie.title || "").toLowerCase().includes(query) ||
                (movie.name || "").toLowerCase().includes(query) ||
                (movie.overview || "").toLowerCase().includes(query)
            );
        }

        // Sorting
        list.sort((a, b) => {
            const dateA = a.release_date || a.first_air_date || "";
            const dateB = b.release_date || b.first_air_date || "";
            const ratingA = a.vote_average || 0;
            const ratingB = b.vote_average || 0;
            const titleA = a.title || a.name || "";
            const titleB = b.title || b.name || "";

            if (sortBy === "release_desc") {
                return dateB.localeCompare(dateA);
            } else if (sortBy === "release_asc") {
                return dateA.localeCompare(dateB);
            } else if (sortBy === "rating_desc") {
                return ratingB - ratingA;
            } else if (sortBy === "title_asc") {
                return titleA.localeCompare(titleB);
            }
            return 0;
        });

        return list;
    }, [currentCategory, searchQuery, sortBy]);

    // Framer motion variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.03
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 15 },
        show: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 15
            }
        }
    };

    const ActiveIcon = currentCategory.icon;

    return (
        <div className="w-full">
            {/* Header / Hero Section */}
            <div className="relative overflow-hidden py-16 md:py-24 rounded-3xl mb-12 border border-white/10 bg-gradient-to-br from-zinc-900/60 via-black/80 to-zinc-900/60 shadow-3xl">
                {/* Decorative glows */}
                <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
                <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
                
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent text-sm font-semibold tracking-wider uppercase backdrop-blur-sm shadow-inner"
                    >
                        <Trophy className="h-4 w-4 text-accent animate-pulse" />
                        Hall of Fame
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white tracking-tight"
                    >
                        Award-Winning <span className="text-accent italic">Cinema</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-medium"
                    >
                        Explore the absolute pinnacle of global cinema. Browse through highly curated collections of legendary masterpieces from the world's most prestigious film academies and global festivals.
                    </motion.p>
                </div>
            </div>

            {/* Step 1: Broad Ceremony Group Selector (Tabs) */}
            <div className="flex justify-center border-b border-white/10 mb-8 pb-3">
                <div className="flex gap-1 md:gap-2 p-1.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5">
                    {(
                        [
                            { id: "all", label: "All Awards", icon: Sparkle },
                            { id: "academies", label: "Academies", icon: Trophy },
                            { id: "festivals", label: "Film Festivals", icon: Film },
                            { id: "specialized", label: "Specialized", icon: Palette }
                        ] as const
                    ).map((group) => {
                        const Icon = group.icon;
                        const isSelected = activeGroup === group.id;
                        return (
                            <button
                                key={group.id}
                                onClick={() => {
                                    setActiveGroup(group.id);
                                    setSearchQuery("");
                                    // Auto-select the first category of the selected group to ensure seamless flow
                                    const nextCats = group.id === "all" ? categories : categories.filter(c => c.group === group.id);
                                    if (nextCats.length > 0 && !nextCats.some(c => c.id === activeTab)) {
                                        setActiveTab(nextCats[0].id);
                                    }
                                }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                                    isSelected 
                                        ? "bg-accent text-black font-extrabold shadow-lg shadow-accent/20" 
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{group.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Step 2: Individual Category Pills Navigation */}
            <div className="mb-10">
                <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                    {filteredCategories.map((category) => {
                        const Icon = category.icon;
                        const isActive = category.id === activeTab;
                        return (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setActiveTab(category.id);
                                    setSearchQuery(""); // clear search on tab switch
                                }}
                                className={`relative flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer border ${
                                    isActive 
                                        ? "bg-white text-black border-white shadow-xl shadow-white/10 scale-105 font-bold" 
                                        : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                <Icon className={`h-4 w-4 ${isActive ? "text-black" : "text-gray-400"}`} />
                                <span>{category.shortName}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabOutline"
                                        className="absolute inset-0 rounded-full border border-white/80"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Active Category Meta Panel */}
            <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`p-6 md:p-8 rounded-3xl border ${currentCategory.borderColor} bg-gradient-to-r ${currentCategory.color} backdrop-blur-md mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}
            >
                <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl bg-black/40 border border-white/10 ${currentCategory.textColor}`}>
                            <ActiveIcon className="h-6 w-6 animate-pulse" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">{currentCategory.name}</h2>
                    </div>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed">{currentCategory.description}</p>
                </div>
                <div className="bg-black/30 border border-white/5 px-5 py-3 rounded-2xl flex-shrink-0 flex flex-row md:flex-col items-center md:items-start justify-between w-full md:w-auto gap-4 md:gap-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Titles</span>
                    <span className="text-2xl font-black text-accent">{currentCategory.movies.length}</span>
                </div>
            </motion.div>

            {/* Controls panel: Search & Sort */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                {/* Search input */}
                <div className="relative w-full md:max-w-md bg-white/5 border border-white/10 rounded-full px-5 py-3 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder={`Search within ${currentCategory.shortName}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none w-full pl-6 text-sm text-white placeholder-gray-500 outline-none"
                    />
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end bg-white/5 border border-white/10 rounded-full px-4 py-2.5">
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider hidden sm:inline">Sort By:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-sm font-semibold text-white outline-none cursor-pointer border-none"
                    >
                        <option value="release_desc" className="bg-zinc-950 text-white">Release Date (Newest)</option>
                        <option value="release_asc" className="bg-zinc-950 text-white">Release Date (Oldest)</option>
                        <option value="rating_desc" className="bg-zinc-950 text-white">TMDB Rating (Highest)</option>
                        <option value="title_asc" className="bg-zinc-950 text-white">Title (A-Z)</option>
                    </select>
                </div>
            </div>

            {/* Movies Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${activeTab}-${searchQuery}-${sortBy}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
                >
                    {processedMovies.length > 0 ? (
                        processedMovies.map((movie) => (
                            <motion.div
                                key={`${movie.id}-${activeTab}`}
                                variants={itemVariants}
                                layout
                            >
                                <MovieCard movie={movie} isFluid={true} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-4 rounded-full bg-white/5 border border-white/10 text-gray-500">
                                <Search className="h-10 w-10" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-white">No award winners match your search</h3>
                                <p className="text-sm text-gray-400">Try checking spelling or resetting your query string.</p>
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
};

export default AwardsClient;
