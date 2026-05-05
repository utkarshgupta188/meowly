"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import VideoPlayer from "@/components/VideoPlayer";
import { Movie, TMDB_CONFIG } from "@/lib/tmdb";
import EpisodeList from "@/components/EpisodeList";
import MovieRow from "@/components/MovieRow";
import DetailsHero from "@/components/DetailsHero";
import { Star, Calendar, Clock, ArrowLeft, User, Play, Youtube } from "lucide-react";
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
    const [activeTab, setActiveTab] = useState<"episodes" | "related" | "details" | "clips" | "photos">(type === "movie" ? "details" : "episodes");
    const [showAllCast, setShowAllCast] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

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

    // Handle Navbar visibility via body class
    React.useEffect(() => {
        if (isPlaying) {
            document.body.classList.add("player-active");
        } else {
            document.body.classList.remove("player-active");
        }
        return () => {
            document.body.classList.remove("player-active");
        };
    }, [isPlaying]);

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
                <span className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-t-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
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
            {/* Go Back Button — always visible top-left */}
            <button
                onClick={() => window.history.back()}
                className="fixed top-6 left-4 md:left-8 z-[60] p-3 bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 rounded-full text-white transition-all hover:scale-110 group"
                title="Go Back"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Hero / Player Section */}
            <div className={`relative w-full z-40 transition-all duration-700 ${isPlaying ? "md:min-h-[85vh] shadow-[0_4px_40px_rgba(0,0,0,0.5)]" : "h-auto"}`}>

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
            <div className={cn(
                "bg-prime-dark/95 backdrop-blur-sm sticky z-30 border-b border-gray-800 shadow-md transition-all duration-500",
                isVisible ? "top-[90px]" : "top-0"
            )}>
                <div className="flex items-center space-x-2 px-4 md:px-12">
                    {type === 'tv' && <TabButton name="episodes" label="Episodes" />}
                    <TabButton name="related" label="Related" />
                    {tmdbData.videos?.results?.length > 0 && <TabButton name="clips" label="Clips" />}
                    {(tmdbData.images?.backdrops?.length > 0 || tmdbData.images?.posters?.length > 0) && <TabButton name="photos" label="Photos" />}
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

                    {activeTab === "clips" && (
                        <motion.div
                            key="clips"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                    <Youtube className="w-8 h-8 text-red-600" />
                                    Trailers & Bonus Clips
                                </h3>
                                <span className="text-gray-500 text-xs font-black uppercase tracking-widest">{tmdbData.videos?.results?.length} Videos</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tmdbData.videos?.results?.map((video: any) => (
                                    <div
                                        key={video.id}
                                        className="group relative bg-prime-card/40 rounded-2xl overflow-hidden border border-white/5 hover:border-accent/50 transition-all shadow-xl cursor-pointer"
                                        onClick={() => window.open(`https://www.youtube.com/watch?v=${video.key}`, '_blank')}
                                    >
                                        <div className="aspect-video relative">
                                            <img
                                                src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                alt={video.name}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                                                    <Play className="w-6 h-6 text-black fill-current ml-1" />
                                                </div>
                                            </div>
                                            <div className="absolute top-3 right-3 bg-red-600 px-2 py-1 rounded text-[10px] font-black uppercase flex items-center gap-1 shadow-lg">
                                                <Youtube className="w-3 h-3" />
                                                {video.type}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                                            <h4 className="text-white font-bold line-clamp-1 group-hover:text-accent transition-colors">{video.name}</h4>
                                            <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-black">{video.site}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "photos" && (
                        <motion.div
                            key="photos"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-12"
                        >
                            {/* Backdrops Gallery */}
                            {tmdbData.images?.backdrops?.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                        Backdrops
                                        <span className="text-gray-500 text-xs font-black uppercase tracking-widest">{tmdbData.images.backdrops.length}</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {tmdbData.images.backdrops.map((image: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="relative aspect-video rounded-2xl overflow-hidden group border border-white/5 hover:border-accent/50 transition-all shadow-xl cursor-zoom-in"
                                                onClick={() => window.open(`${TMDB_CONFIG.imageBase}/original${image.file_path}`, '_blank')}
                                            >
                                                <img
                                                    src={`${TMDB_CONFIG.imageBase}/w780${image.file_path}`}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    alt={`Backdrop ${idx + 1}`}
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Posters Gallery */}
                            {tmdbData.images?.posters?.length > 0 && (
                                <div className="space-y-6 pt-12">
                                    <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                        Posters
                                        <span className="text-gray-500 text-xs font-black uppercase tracking-widest">{tmdbData.images.posters.length}</span>
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                        {tmdbData.images.posters.slice(0, 18).map((image: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="relative aspect-[2/3] rounded-xl overflow-hidden group border border-white/5 hover:border-accent/50 transition-all shadow-xl cursor-zoom-in"
                                                onClick={() => window.open(`${TMDB_CONFIG.imageBase}/original${image.file_path}`, '_blank')}
                                            >
                                                <img
                                                    src={`${TMDB_CONFIG.imageBase}/w500${image.file_path}`}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    alt={`Poster ${idx + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                                    <div className="bg-gray-800/30 p-4 rounded-2xl flex-1 min-w-[200px] border border-white/5">
                                        <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest block mb-1">Genres</span>
                                        <span className="text-white font-bold">{tmdbData.genres?.map((g: any) => g.name).join(", ")}</span>
                                    </div>
                                    <div className="bg-gray-800/30 p-4 rounded-2xl flex-1 min-w-[200px] border border-white/5">
                                        <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest block mb-1">Status</span>
                                        <span className="text-white font-bold">{tmdbData.status}</span>
                                    </div>
                                    <div className="bg-gray-800/30 p-4 rounded-2xl flex-1 min-w-[200px] border border-white/5">
                                        <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest block mb-1">Release Date</span>
                                        <span className="text-white font-bold">{tmdbData.release_date || tmdbData.first_air_date}</span>
                                    </div>
                                    {tmdbData.original_language && (
                                        <div className="bg-gray-800/30 p-4 rounded-2xl flex-1 min-w-[150px] border border-white/5">
                                            <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest block mb-1">Language</span>
                                            <span className="text-white font-bold uppercase">{tmdbData.original_language}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {tmdbData.runtime > 0 && (
                                        <div className="bg-gray-800/20 p-4 rounded-2xl border border-white/5">
                                            <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest block mb-1">Duration</span>
                                            <p className="text-xl font-black text-white">{tmdbData.runtime} min</p>
                                        </div>
                                    )}
                                    {tmdbData.vote_average > 0 && (
                                        <div className="bg-gray-800/20 p-4 rounded-2xl border border-white/5">
                                            <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest block mb-1">TMDB Rating</span>
                                            <p className="text-xl font-black text-white flex items-center gap-2">
                                                <Star className="w-5 h-5 fill-current" />
                                                {tmdbData.vote_average.toFixed(1)}
                                            </p>
                                        </div>
                                    )}
                                    {type === 'tv' && tmdbData.number_of_seasons && (
                                        <div className="bg-gray-800/20 p-4 rounded-2xl border border-white/5">
                                            <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest block mb-1">Seasons</span>
                                            <p className="text-xl font-black text-white">{tmdbData.number_of_seasons}</p>
                                        </div>
                                    )}
                                    {type === 'tv' && tmdbData.number_of_episodes && (
                                        <div className="bg-gray-800/20 p-4 rounded-2xl border border-white/5">
                                            <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest block mb-1">Episodes</span>
                                            <p className="text-xl font-black text-white">{tmdbData.number_of_episodes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* Franchise / Collection */}
                            {tmdbData.belongs_to_collection && (
                                <div className="relative h-64 md:h-80 w-full rounded-[2rem] overflow-hidden group shadow-2xl">
                                    <div className="absolute inset-0">
                                        <img
                                            src={`${TMDB_CONFIG.imageBase}/original${tmdbData.belongs_to_collection.backdrop_path}`}
                                            className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-1000"
                                            alt={tmdbData.belongs_to_collection.name}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                                    </div>
                                    <div className="relative h-full flex flex-col justify-center p-8 md:p-12 space-y-4">
                                        <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">Part of the Franchise</span>
                                        <h3 className="text-3xl md:text-5xl font-black text-white">{tmdbData.belongs_to_collection.name}</h3>
                                        <Link href={`/collection/${tmdbData.belongs_to_collection.id}`}>
                                            <button className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest w-fit hover:scale-105 transition-transform active:scale-95 shadow-xl">
                                                View Collection
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Production & Networks */}
                            {(tmdbData.production_companies?.length > 0 || tmdbData.networks?.length > 0) && (
                                <div className="bg-prime-card/20 p-8 rounded-[2rem] border border-white/5 shadow-xl backdrop-blur-md">
                                    <h3 className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] mb-8 flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-gray-500 rounded-full" />
                                        {type === 'tv' ? 'Networks & Studios' : 'Production Studios'}
                                    </h3>
                                    <div className="flex flex-wrap gap-8 items-center">
                                        {/* Networks first for TV */}
                                        {type === 'tv' && tmdbData.networks?.map((network: any) => (
                                            <div key={network.id} className="group relative flex items-center gap-3">
                                                <div className="bg-white/90 p-2.5 rounded-xl h-12 flex items-center justify-center shadow-lg group-hover:bg-white transition-all hover:scale-105 border border-white/20">
                                                    <img
                                                        src={`${TMDB_CONFIG.imageBase}/w200${network.logo_path}`}
                                                        alt={network.name}
                                                        className="h-full object-contain max-w-[100px]"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-accent uppercase tracking-wider">Network</span>
                                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors hidden md:block">{network.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Production Companies */}
                                        {tmdbData.production_companies?.filter((c: any) => c.logo_path).slice(0, 4).map((company: any) => (
                                            <div key={company.id} className="group relative flex items-center gap-3">
                                                <div className="bg-white/90 p-2.5 rounded-xl h-12 flex items-center justify-center shadow-lg group-hover:bg-white transition-all hover:scale-105 border border-white/20">
                                                    <img
                                                        src={`${TMDB_CONFIG.imageBase}/w200${company.logo_path}`}
                                                        alt={company.name}
                                                        className="h-full object-contain max-w-[100px] transition-all duration-300"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Studio</span>
                                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors hidden md:block">{company.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                                    className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-full text-xs font-black uppercase tracking-widest transition-all border border-white/10 hover:border-accent"
                                                >
                                                    {showAllCast ? "Show Less" : `View All ${tmdbData.credits.cast.length} Cast Members`}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-prime-card/20 p-8 rounded-3xl border border-white/5 shadow-xl">
                                        <h3 className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-6">Key Crew</h3>
                                        <div className="space-y-6">
                                            {/* Director */}
                                            {tmdbData.credits?.crew?.filter((c: any) => c.job === "Director").slice(0, 2).map((person: any) => (
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

                            {/* Keywords */}
                            {(type === 'movie' ? tmdbData.keywords?.keywords : tmdbData.keywords?.results)?.length > 0 && (
                                <div className="bg-prime-card/20 p-8 rounded-[2rem] border border-white/5 shadow-xl backdrop-blur-md">
                                    <h3 className="text-gray-500 text-xs uppercase font-black tracking-widest mb-6 flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-accent rounded-full" />
                                        Story Keywords
                                    </h3>
                                    <div className="flex flex-wrap gap-2.5">
                                        {(type === 'movie' ? tmdbData.keywords?.keywords : tmdbData.keywords?.results).map((keyword: any) => (
                                            <span
                                                key={keyword.id}
                                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[11px] font-bold text-gray-400 hover:text-accent transition-all cursor-default border border-white/5 shadow-sm"
                                            >
                                                #{keyword.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
