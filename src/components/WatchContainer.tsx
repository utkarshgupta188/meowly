"use client";

import React, { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Movie } from "@/lib/tmdb";
import EpisodeList from "@/components/EpisodeList";
import MovieRow from "@/components/MovieRow";
import DetailsHero from "@/components/DetailsHero";
import { Star, Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { getSeasonDetailsAction } from "@/app/actions";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface WatchContainerProps {
    type: "movie" | "tv";
    id: string;
    tmdbData: any;
    initialSeason?: number;
    initialEpisode?: number;
    startPlaying?: boolean;
}

export default function WatchContainer({ type, id, tmdbData, initialSeason = 1, initialEpisode = 1, startPlaying = false }: WatchContainerProps) {
    const [season, setSeason] = useState(initialSeason);
    const [episode, setEpisode] = useState(initialEpisode);
    const [isPlaying, setIsPlaying] = useState(startPlaying);
    const [activeTab, setActiveTab] = useState<"episodes" | "related" | "details">(type === "movie" ? "details" : "episodes");
    const [showAllCast, setShowAllCast] = useState(false);

    // Determine current season data
    const [seasonData, setSeasonData] = useState<any>(null);

    React.useEffect(() => {
        if (type === 'tv') {
            const fetchSeasonParams = async () => {
                const data = await getSeasonDetailsAction(id, season);
                setSeasonData(data);
            };
            fetchSeasonParams();
        }
    }, [id, season, type]);

    // Sync state with props for navigation
    React.useEffect(() => {
        setIsPlaying(startPlaying);
        setSeason(initialSeason);
        setEpisode(initialEpisode);
    }, [id, type, startPlaying, initialSeason, initialEpisode]);

    // Use fetched season data or fallback to basic placeholders if loading/failed
    const episodesList = seasonData?.episodes || (tmdbData.seasons?.find((s: any) => s.season_number === season)
        ? Array.from({ length: tmdbData.seasons.find((s: any) => s.season_number === season).episode_count || 10 }, (_, i) => ({
            id: i,
            episode_number: i + 1,
            season_number: season,
            name: `Episode ${i + 1}`,
            overview: `Description for episode ${i + 1}`,
            still_path: null,
            runtime: 45,
            air_date: "2024-01-01"
        }))
        : []);

    const TabButton = ({ name, label }: { name: typeof activeTab, label: string }) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`relative px-6 py-3 text-lg font-bold transition-all duration-300 ${activeTab === name ? "text-accent" : "text-gray-400 hover:text-white"
                }`}
        >
            {label}
            {activeTab === name && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-t-full shadow-[0_0_10px_#FBBF24]" />
            )}
        </button>
    );

    // Playback state

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
        >
            {/* Go Back Button */}
            <button 
                onClick={() => window.history.back()}
                className="fixed top-8 left-6 md:left-12 z-[60] p-3 glass-pill hover:bg-white/10 transition-all group"
            >
                <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Hero / Player Section */}
            <div className={`relative w-full z-20 transition-all duration-700 ${isPlaying ? "pt-36 md:pt-24 md:min-h-[85vh] shadow-[0_4px_40px_rgba(0,0,0,0.5)]" : "h-auto"}`}>

                {!isPlaying ? (
                    <DetailsHero
                        tmdbData={tmdbData}
                        type={type}
                        onPlay={() => setIsPlaying(true)}
                        currentSeason={season}
                        onSeasonChange={(s) => {
                            setSeason(s);
                            setEpisode(1);
                        }}
                        currentEpisode={episode}
                    />
                ) : (
                    <VideoPlayer
                        type={type}
                        id={id}
                        tmdbData={tmdbData}
                        season={season}
                        episode={episode}
                        onSeasonChange={(s) => {
                            setSeason(s);
                            setEpisode(1); // Reset episode on season change
                        }}
                        onEpisodeChange={setEpisode}
                    />
                )}
            </div>

            {/* Tabs Navigation */}
            <div className="bg-prime-dark/95 backdrop-blur-sm sticky top-[60px] z-30 border-b border-gray-800 shadow-md">
                <div className="flex items-center space-x-2 px-4 md:px-12">
                    {type === 'tv' && <TabButton name="episodes" label="Episodes" />}
                    <TabButton name="related" label="Related" />
                    <TabButton name="details" label="Details" />
                </div>
            </div>

            {/* Tab Content */}
            <div className="px-4 md:px-12 py-8 min-h-[500px]">
                <AnimatePresence mode="wait">
                    {activeTab === "episodes" && type === "tv" && (
                        <motion.div
                            key="episodes"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <EpisodeList
                                episodes={episodesList as any[]}
                                currentSeason={season}
                                currentEpisode={episode}
                                onEpisodeSelect={(ep) => {
                                    setEpisode(ep);
                                    setIsPlaying(true);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                            />
                        </motion.div>
                    )}

                    {activeTab === "related" && (
                        <motion.div
                            key="related"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-12"
                        >
                            <MovieRow
                                title="Recommendations"
                                movies={tmdbData.recommendations?.results?.slice(0, 10).map((r: any) => ({ ...r, media_type: type })) || []}
                            />
                            <MovieRow
                                title="Similar Content"
                                movies={tmdbData.similar?.results?.slice(0, 10).map((r: any) => ({ ...r, media_type: type })) || []}
                            />
                        </motion.div>
                    )}

                    {activeTab === "details" && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-12"
                        >
                            {/* Movie Info */}
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white mb-4">{tmdbData.title || tmdbData.name}</h2>
                                <p className="text-gray-300 text-lg leading-relaxed font-light">{tmdbData.overview}</p>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <div className="bg-gray-800/50 p-4 rounded-lg flex-1 min-w-[200px]">
                                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Genres</span>
                                        <span className="text-white font-medium">{tmdbData.genres?.map((g: any) => g.name).join(", ")}</span>
                                    </div>
                                    <div className="bg-gray-800/50 p-4 rounded-lg flex-1 min-w-[200px]">
                                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Status</span>
                                        <span className="text-white font-medium">{tmdbData.status}</span>
                                    </div>
                                    <div className="bg-gray-800/50 p-4 rounded-lg flex-1 min-w-[200px]">
                                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Release Date</span>
                                        <span className="text-white font-medium">{tmdbData.release_date || tmdbData.first_air_date}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cast & Crew */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                <div className="lg:col-span-3 space-y-8">
                                    <div className="bg-prime-card/40 p-8 rounded-3xl border border-white/5 shadow-xl backdrop-blur-md">
                                        <h3 className="text-accent text-sm uppercase font-black tracking-widest mb-8 flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-accent rounded-full" />
                                            Full Cast
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {tmdbData.credits?.cast?.slice(0, showAllCast ? 100 : 9).map((person: any) => (
                                                <Link href={`/person/${person.id}`} key={person.id} className="flex items-center space-x-4 group cursor-pointer hover:bg-white/5 p-4 rounded-2xl transition-all border border-transparent hover:border-white/10">
                                                    <div className="w-16 h-16 rounded-2xl bg-gray-800 overflow-hidden border-2 border-transparent group-hover:border-accent transition-all shadow-lg group-hover:shadow-accent/20 flex-shrink-0">
                                                        {person.profile_path ? (
                                                            <img src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-700 text-[10px] text-gray-500"><User className="w-6 h-6" /></div>
                                                        )}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-white text-base font-bold group-hover:text-accent transition-colors truncate">{person.name}</p>
                                                        <p className="text-gray-500 text-xs truncate uppercase tracking-wider mt-0.5">{person.character}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>

                                        {tmdbData.credits?.cast?.length > 9 && (
                                            <div className="mt-8 text-center">
                                                <button
                                                    onClick={() => setShowAllCast(!showAllCast)}
                                                    className="bg-white/5 hover:bg-white/10 px-8 py-3 rounded-full text-white text-sm font-black uppercase tracking-widest transition-all border border-white/10 hover:border-white/20 active:scale-95"
                                                >
                                                    {showAllCast ? "Show less" : "View all cast"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-prime-card/40 p-8 rounded-3xl border border-white/5 shadow-xl backdrop-blur-md">
                                        <h3 className="text-gray-500 text-xs uppercase font-black tracking-widest mb-8">Key Crew</h3>
                                        <div className="space-y-8">
                                            {/* Director */}
                                            {tmdbData.credits?.crew?.filter((c: any) => c.job === "Director").slice(0, 2).map((person: any) => (
                                                <Link href={`/person/${person.id}`} key={person.id} className="block group">
                                                    <p className="text-xs font-bold text-gray-600 uppercase mb-2">Director</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden border border-white/5 group-hover:border-accent/50 transition-colors">
                                                            {person.profile_path ? (
                                                                <img src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-500"><User className="w-4 h-4" /></div>
                                                            )}
                                                        </div>
                                                        <p className="text-white font-bold group-hover:text-accent transition-colors">{person.name}</p>
                                                    </div>
                                                </Link>
                                            ))}

                                            {/* Writers */}
                                            {tmdbData.credits?.crew?.filter((c: any) => ["Writer", "Screenplay", "Author", "Teleplay"].includes(c.job)).slice(0, 3).map((person: any) => (
                                                <Link href={`/person/${person.id}`} key={person.id} className="block group">
                                                    <p className="text-xs font-bold text-gray-600 uppercase mb-2">{person.job}</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden border border-white/5 group-hover:border-accent/50 transition-colors">
                                                            {person.profile_path ? (
                                                                <img src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-500"><User className="w-4 h-4" /></div>
                                                            )}
                                                        </div>
                                                        <p className="text-white font-bold group-hover:text-accent transition-colors">{person.name}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
