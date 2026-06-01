"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import VideoPlayer from "@/components/VideoPlayer";
import { Movie, TMDB_CONFIG } from "@/lib/tmdb";
import EpisodeList from "@/components/EpisodeList";
import MovieRow from "@/components/MovieRow";
import DetailsHero from "@/components/DetailsHero";
import { Star, Calendar, Clock, ArrowLeft, User, Play, Youtube, X, Download, ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import { getSeasonDetailsAction } from "@/app/actions";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import MoctaleReviews from "@/components/MoctaleReviews";

interface TabButtonProps {
    name: "episodes" | "related" | "details" | "clips" | "photos" | "reviews";
    label: string;
    activeTab: "episodes" | "related" | "details" | "clips" | "photos" | "reviews";
    setActiveTab: (name: "episodes" | "related" | "details" | "clips" | "photos" | "reviews") => void;
}

const TabButton = ({ name, label, activeTab, setActiveTab }: TabButtonProps) => (
    <button
        onClick={() => setActiveTab(name)}
        className={`relative px-6 py-3 text-lg font-bold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${activeTab === name ? "text-accent" : "text-gray-400 hover:text-white"
            }`}
    >
        {label}
        {activeTab === name && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-t-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        )}
    </button>
);

interface WatchContainerProps {
    type: "movie" | "tv";
    id: string;
    tmdbData: any;
    initialSeason?: number;
    initialEpisode?: number;
    initialServer?: number;
    startPlaying?: boolean;
}

export default function WatchContainer({ type, id, tmdbData, initialSeason = 1, initialEpisode = 1, initialServer = 0, startPlaying = false }: WatchContainerProps) {
    const [season, setSeason] = useState(initialSeason);
    const [episode, setEpisode] = useState(initialEpisode);
    const [isPlaying, setIsPlaying] = useState(startPlaying);
    const [activeTab, setActiveTab] = useState<"episodes" | "related" | "details" | "clips" | "photos" | "reviews">(type === "movie" ? "details" : "episodes");
    const [showAllCast, setShowAllCast] = useState(false);
    const [activeVideo, setActiveVideo] = useState<any | null>(null);
    const [activePhoto, setActivePhoto] = useState<{ type: 'backdrop' | 'poster'; index: number; file_path: string } | null>(null);
    const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'fallback'>('idle');

    useEffect(() => {
        if (downloadStatus !== 'idle') {
            const delay = downloadStatus === 'fallback' ? 8000 : 4000;
            const timer = setTimeout(() => setDownloadStatus('idle'), delay);
            return () => clearTimeout(timer);
        }
    }, [downloadStatus]);

    // Photos Gallery Handlers & Navigation
    const photoList = React.useMemo(() => {
        if (!activePhoto) return [];
        if (activePhoto.type === 'backdrop') {
            return tmdbData.images?.backdrops || [];
        } else {
            return tmdbData.images?.posters?.slice(0, 18) || [];
        }
    }, [activePhoto, tmdbData.images?.backdrops, tmdbData.images?.posters]);

    const hasPrev = React.useMemo(() => activePhoto !== null && activePhoto.index > 0, [activePhoto]);
    const hasNext = React.useMemo(() => activePhoto !== null && activePhoto.index < photoList.length - 1, [activePhoto, photoList.length]);

    const handlePrev = () => {
        if (!activePhoto || !hasPrev) return;
        const prevIdx = activePhoto.index - 1;
        setActivePhoto({
            type: activePhoto.type,
            index: prevIdx,
            file_path: photoList[prevIdx].file_path
        });
    };

    const handleNext = () => {
        if (!activePhoto || !hasNext) return;
        const nextIdx = activePhoto.index + 1;
        setActivePhoto({
            type: activePhoto.type,
            index: nextIdx,
            file_path: photoList[nextIdx].file_path
        });
    };

    // Keyboard navigation for photo modal
    useEffect(() => {
        if (!activePhoto) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setActivePhoto(null);
            } else if (e.key === "ArrowLeft") {
                if (hasPrev) {
                    const prevIdx = activePhoto.index - 1;
                    setActivePhoto({
                        type: activePhoto.type,
                        index: prevIdx,
                        file_path: photoList[prevIdx].file_path
                    });
                }
            } else if (e.key === "ArrowRight") {
                if (hasNext) {
                    const nextIdx = activePhoto.index + 1;
                    setActivePhoto({
                        type: activePhoto.type,
                        index: nextIdx,
                        file_path: photoList[nextIdx].file_path
                    });
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activePhoto, photoList, hasPrev, hasNext]);

    const handleDownload = async (filePath: string) => {
        setDownloadStatus('downloading');
        try {
            const originalUrl = `${TMDB_CONFIG.imageBase}/original${filePath}`;
            const proxyUrl = `https://meoserve.utkarshg.workers.dev/api/proxy?url=${encodeURIComponent(originalUrl)}`;
            
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error('Proxy download failed');
            
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            // Extract a clean filename from filePath
            const filename = filePath.split('/').pop() || 'photo.jpg';
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Revoke after a short delay to ensure browser processed click
            setTimeout(() => {
                window.URL.revokeObjectURL(blobUrl);
            }, 100);
            
            setDownloadStatus('success');
        } catch (error) {
            console.error('Failed to download via proxy, falling back:', error);
            // Fallback: open in new tab
            const imageUrl = `${TMDB_CONFIG.imageBase}/original${filePath}`;
            window.open(imageUrl, '_blank');
            setDownloadStatus('fallback');
        }
    };


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
                        initialServer={initialServer}
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
                "bg-prime-dark/95 backdrop-blur-sm sticky z-30 border-b border-gray-800 shadow-md transition-all duration-500 top-0"
            )}>
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none px-4 md:px-12 pb-0.5">
                    {type === 'tv' && <TabButton name="episodes" label="Episodes" activeTab={activeTab} setActiveTab={setActiveTab} />}
                    <TabButton name="related" label="Related" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="details" label="Details" activeTab={activeTab} setActiveTab={setActiveTab} />
                    {tmdbData.videos?.results?.length > 0 && <TabButton name="clips" label="Clips" activeTab={activeTab} setActiveTab={setActiveTab} />}
                    {(tmdbData.images?.backdrops?.length > 0 || tmdbData.images?.posters?.length > 0) && <TabButton name="photos" label="Photos" activeTab={activeTab} setActiveTab={setActiveTab} />}
                    <TabButton name="reviews" label="Reviews" activeTab={activeTab} setActiveTab={setActiveTab} />
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                                {tmdbData.videos?.results?.map((video: any) => (
                                    <div
                                        key={video.id}
                                        className="group relative bg-prime-card/40 rounded-2xl overflow-hidden border border-white/5 hover:border-accent/50 transition-all shadow-xl cursor-pointer"
                                        onClick={() => setActiveVideo(video)}
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                                        {tmdbData.images.backdrops.map((image: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="relative aspect-video rounded-2xl overflow-hidden group border border-white/5 hover:border-accent/50 transition-all shadow-xl cursor-zoom-in"
                                                onClick={() => setActivePhoto({ type: 'backdrop', index: idx, file_path: image.file_path })}
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
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                                        {tmdbData.images.posters.slice(0, 18).map((image: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="relative aspect-[2/3] rounded-xl overflow-hidden group border border-white/5 hover:border-accent/50 transition-all shadow-xl cursor-zoom-in"
                                                onClick={() => setActivePhoto({ type: 'poster', index: idx, file_path: image.file_path })}
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
                                            <Link 
                                                key={network.id} 
                                                href={`/network/${network.id}`}
                                                className="group relative flex items-center gap-3 cursor-pointer"
                                            >
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
                                            </Link>
                                        ))}
                                        {/* Production Companies */}
                                        {tmdbData.production_companies?.filter((c: any) => c.logo_path).slice(0, 4).map((company: any) => (
                                            <Link 
                                                key={company.id} 
                                                href={`/company/${company.id}`}
                                                className="group relative flex items-center gap-3 cursor-pointer"
                                            >
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
                                            </Link>
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

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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

                    {activeTab === "reviews" && (
                        <motion.div
                            key="reviews"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <MoctaleReviews 
                                title={tmdbData.title || tmdbData.name}
                                date={tmdbData.release_date || tmdbData.first_air_date}
                                type={type}
                                tmdbRating={tmdbData.vote_average}
                                genres={tmdbData.genres?.map((g: any) => g.name) || []}
                                overview={tmdbData.overview || ""}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Video Modal Player */}
            <AnimatePresence>
                {activeVideo && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveVideo(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                        >
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <iframe
                                src={`https://www.youtube.com/embed/${activeVideo.key}?autoplay=1`}
                                className="w-full h-full border-none"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Photo Modal Viewer */}
            <AnimatePresence>
                {activePhoto && (
                    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8">
                        {/* Blur Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActivePhoto(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-md"
                        />
                        
                        {/* Upper Right Control panel */}
                        <div className="absolute top-6 right-6 z-[110] flex items-center gap-4">
                            <button
                                onClick={() => handleDownload(activePhoto.file_path)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-accent hover:text-black text-white rounded-full transition-all duration-300 font-bold text-sm backdrop-blur-md border border-white/10 shadow-lg active:scale-95"
                                title="Download image"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden md:inline">Download</span>
                            </button>
                            <button
                                onClick={() => setActivePhoto(null)}
                                className="p-3 bg-white/10 hover:bg-red-600 text-white rounded-full transition-all duration-300 backdrop-blur-md border border-white/10 shadow-lg"
                                title="Close viewer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Image Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="relative max-w-[90vw] max-h-[75vh] md:max-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black/40 z-[105]"
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activePhoto.file_path}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.25 }}
                                    src={`${TMDB_CONFIG.imageBase}/original${activePhoto.file_path}`}
                                    className={cn(
                                        "object-contain w-full h-full max-h-[70vh] md:max-h-[78vh] rounded-xl select-none shadow-[0_0_50px_rgba(0,0,0,0.8)]",
                                        activePhoto.type === 'backdrop' ? 'aspect-video' : 'aspect-[2/3]'
                                    )}
                                    alt={`${activePhoto.type === 'backdrop' ? 'Backdrop' : 'Poster'} image`}
                                />
                            </AnimatePresence>
                        </motion.div>

                        {/* Bottom Navigation Control Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ delay: 0.1 }}
                            className="relative mt-6 px-6 py-3 bg-black/60 backdrop-blur-lg border border-white/10 rounded-full flex items-center gap-6 z-[105] shadow-2xl"
                        >
                            <button
                                onClick={handlePrev}
                                disabled={!hasPrev}
                                className="p-2 hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent rounded-full text-white transition-all duration-200 active:scale-90"
                                title="Previous Photo"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            
                            <div className="flex flex-col items-center justify-center min-w-[120px] select-none text-center">
                                <span className="text-white font-black text-sm tracking-wide">
                                    {activePhoto.index + 1} <span className="text-gray-500 font-bold mx-0.5">/</span> {photoList.length}
                                </span>
                                <span className="text-[10px] text-accent font-black uppercase tracking-[0.2em] mt-0.5">
                                    {activePhoto.type}
                                </span>
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!hasNext}
                                className="p-2 hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent rounded-full text-white transition-all duration-200 active:scale-90"
                                title="Next Photo"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </motion.div>

                        {/* Glassmorphic Guidance Toast */}
                        <AnimatePresence>
                            {downloadStatus !== 'idle' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="fixed bottom-24 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-[120] max-w-sm w-[calc(100vw-2rem)] bg-black/60 backdrop-blur-xl border border-white/15 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-start gap-4 text-white ring-1 ring-white/5"
                                >
                                    {downloadStatus === 'downloading' && (
                                        <>
                                            <div className="p-2.5 bg-accent/20 text-accent rounded-xl border border-accent/20 shrink-0">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <h4 className="text-sm font-bold text-white mb-1">Downloading Image</h4>
                                                <p className="text-xs text-gray-300 leading-relaxed">
                                                    Fetching high-resolution photo directly to your device...
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    {downloadStatus === 'success' && (
                                        <>
                                            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <h4 className="text-sm font-bold text-white mb-1">Download Complete</h4>
                                                <p className="text-xs text-gray-300 leading-relaxed">
                                                    The high-resolution image has been saved to your downloads folder!
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    {downloadStatus === 'fallback' && (
                                        <>
                                            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/20 shrink-0 animate-pulse">
                                                <Download className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <h4 className="text-sm font-bold text-white mb-1">Saving Photo</h4>
                                                <p className="text-xs text-gray-300 leading-relaxed">
                                                    The original photo has been opened in a new tab. Simply <span className="text-accent font-semibold">right-click</span> (or <span className="text-accent font-semibold">long-press</span> on mobile) and select <span className="text-white font-semibold underline decoration-accent/50 decoration-2 underline-offset-2">"Save Image As..."</span>.
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-gray-500 font-semibold tracking-wider uppercase select-none">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                                    Preserves 100% of your data quota
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <button 
                                        onClick={() => setDownloadStatus('idle')}
                                        className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg shrink-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
