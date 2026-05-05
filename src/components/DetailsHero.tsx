import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Movie, TMDB_CONFIG } from "@/lib/tmdb";
import { Play, Plus, Share2, Check, MessageSquare, AudioWaveform, ChevronDown, X } from "lucide-react";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface DetailsHeroProps {
    tmdbData: any;
    type: "movie" | "tv";
    onPlay: () => void;
    currentSeason: number;
    onSeasonChange: (season: number) => void;
    currentEpisode: number;
}

const DetailsHero = ({ tmdbData, type, onPlay, currentSeason, onSeasonChange, currentEpisode }: DetailsHeroProps) => {
    const [inWatchlist, setInWatchlist] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);

    const trailer = tmdbData.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube") || 
                   tmdbData.videos?.results?.find((v: any) => v.type === "Teaser" && v.site === "YouTube");

    useEffect(() => {
        if (!tmdbData?.id) return;
        setInWatchlist(isInWatchlist(tmdbData.id.toString(), type));
        
        const handleUpdate = () => {
            setInWatchlist(isInWatchlist(tmdbData.id.toString(), type));
        };

        window.addEventListener("watchlistUpdated", handleUpdate);
        return () => window.removeEventListener("watchlistUpdated", handleUpdate);
    }, [tmdbData.id, type]);

    const backdropUrl = tmdbData.backdrop_path
        ? `${TMDB_CONFIG.backdropSizes.large}${tmdbData.backdrop_path}`
        : null;

    const rating = tmdbData.vote_average ? tmdbData.vote_average.toFixed(1) : "8.9";
    const year = tmdbData.release_date?.split("-")[0] || tmdbData.first_air_date?.split("-")[0] || "2024";
    const runTime = tmdbData.runtime ? `${Math.floor(tmdbData.runtime / 60)} h ${tmdbData.runtime % 60} min` : type === 'tv' ? `${tmdbData.number_of_episodes || 24} episodes` : "1 h 45 min";

    const currentSeasonData = tmdbData.seasons?.find((s: any) => s.season_number === currentSeason);
    const seasonName = currentSeasonData?.name || `Season ${currentSeason}`;

    const getRating = () => {
        if (type === 'movie') {
            const releaseDates = tmdbData.release_dates?.results?.find((r: any) => r.iso_3166_1 === 'US');
            return releaseDates?.release_dates?.[0]?.certification || "NR";
        } else {
            const contentRatings = tmdbData.content_ratings?.results?.find((r: any) => r.iso_3166_1 === 'US');
            return contentRatings?.rating || "NR";
        }
    };
    const certification = getRating();

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWatchlistToggle = () => {
        if (inWatchlist) {
            removeFromWatchlist(tmdbData.id.toString(), type);
        } else {
            addToWatchlist({
                id: tmdbData.id.toString(),
                type: type,
                title: tmdbData.title || tmdbData.name || "",
                poster_path: tmdbData.poster_path || "",
                backdrop_path: tmdbData.backdrop_path,
                vote_average: tmdbData.vote_average,
                release_date: tmdbData.release_date,
                first_air_date: tmdbData.first_air_date,
                last_played: Date.now()
            });
        }
    };

    return (
        <div className="relative w-full min-h-screen flex items-center overflow-hidden bg-black pb-12">
            {/* Background Blur */}
            <div className="absolute inset-0 z-0">
                {backdropUrl && (
                    <img
                        src={backdropUrl}
                        alt={tmdbData.title || tmdbData.name}
                        className="w-full h-full object-cover opacity-30 blur-3xl"
                    />
                )}
            </div>
            <div className="relative z-40 mt-0 md:-mt-10 w-full px-6 md:px-12 max-w-7xl mx-auto pt-40 md:pt-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Side: Info */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6"
                >
                    {tmdbData.images?.logos?.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="h-24 md:h-32 lg:h-40 w-full flex items-start"
                        >
                            <img
                                src={`${TMDB_CONFIG.imageBase}/original${
                                    tmdbData.images.logos.find((l: any) => l.iso_639_1 === 'en')?.file_path || 
                                    tmdbData.images.logos[0].file_path
                                }`}
                                alt={tmdbData.title || tmdbData.name}
                                className="h-full object-contain object-left drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                            />
                        </motion.div>
                    ) : (
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter"
                        >
                            {tmdbData.title || tmdbData.name}
                        </motion.h1>
                    )}

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap items-center gap-3 text-gray-300 font-medium text-sm md:text-base"
                    >
                        <span className="flex items-center text-gray-400">IMDb <span className="text-white ml-1 font-bold">{rating}</span></span>
                        <span>{year}</span>
                        <span>{runTime}</span>

                        <span className="bg-gray-700/60 px-1.5 py-0.5 rounded-[3px] text-xs font-bold text-gray-300 ring-1 ring-gray-500/50">X-RAY</span>
                        <span className="bg-gray-700/60 px-1.5 py-0.5 rounded-[3px] text-xs font-bold text-gray-300 ring-1 ring-gray-500/50">HDR</span>
                        <span className="bg-gray-700/60 px-1.5 py-0.5 rounded-[3px] text-xs font-bold text-gray-300 ring-1 ring-gray-500/50">UHD</span>

                        {certification && certification !== "NR" && (
                            <span className="border border-white/40 px-1.5 rounded-[3px] text-xs font-bold">{certification}</span>
                        )}

                        <MessageSquare className="w-5 h-5 text-gray-400" />
                        <AudioWaveform className="w-5 h-5 text-gray-400" />
                    </motion.div>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-lg md:text-xl text-gray-300 font-medium drop-shadow-md line-clamp-4 leading-relaxed max-w-2xl"
                    >
                        {tmdbData.overview}
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-wrap items-center gap-4 pt-4"
                    >
                        <button
                            onClick={onPlay}
                            className="flex items-center space-x-3 bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
                        >
                            <Play className="fill-current w-7 h-7" />
                            <div className="flex flex-col items-start leading-none text-left">
                                <span className="text-[10px] uppercase font-black tracking-wider text-black/70">
                                    {type === 'tv' ? `Episode ${currentEpisode}` : "Movie"}
                                </span>
                                <span>{type === 'tv' ? "Continue watching" : "Watch now"}</span>
                            </div>
                        </button>

                        {trailer && (
                            <button
                                onClick={() => setShowTrailer(true)}
                                className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 backdrop-blur-md border border-white/10"
                            >
                                <Play className="w-6 h-6" />
                                <span>Trailer</span>
                            </button>
                        )}

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleWatchlistToggle}
                                className={cn(
                                    "w-14 h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 border-2",
                                    inWatchlist 
                                        ? "bg-accent border-accent text-black shadow-lg shadow-accent/20" 
                                        : "bg-white/10 hover:bg-white/20 border-white/10 hover:border-white/40 text-white"
                                )}
                                title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                            >
                                {inWatchlist ? <Check className="w-7 h-7" /> : <Plus className="w-7 h-7" />}
                            </button>

                            <button
                                onClick={handleShare}
                                className={cn(
                                    "w-14 h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 border-2",
                                    copied ? "bg-green-600 border-green-500 text-white" : "bg-white/10 hover:bg-white/20 border-white/10 hover:border-white/40 text-white"
                                )}
                                title="Share"
                             >
                                 {copied ? <Check className="w-7 h-7" /> : <Share2 className="w-7 h-7" />}
                             </button>

                            {tmdbData.homepage && (
                                <a
                                    href={tmdbData.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 border-2 bg-white/10 hover:bg-white/20 border-white/10 hover:border-white/40 text-white"
                                    title="Official Website"
                                >
                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                </a>
                            )}

                            {tmdbData.imdb_id && (
                                <a
                                    href={`https://www.imdb.com/title/${tmdbData.imdb_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 border-2 bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/20 hover:border-yellow-500/40 text-yellow-500 font-black text-xs"
                                    title="IMDb"
                                >
                                    IMDb
                                </a>
                            )}
                        </div>
                    </motion.div>

                    {type === 'tv' && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="relative inline-block pt-4"
                        >
                            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold flex items-center space-x-3 transition-colors border border-white/10 shadow-lg">
                                <span>{seasonName}</span>
                                <ChevronDown className="w-5 h-5" />
                            </button>
                            <select
                                onChange={(e) => onSeasonChange(Number(e.target.value))}
                                value={currentSeason}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            >
                                {tmdbData.seasons?.filter((s: any) => s.season_number > 0).map((s: any) => (
                                    <option key={s.id} value={s.season_number} className="bg-prime-dark text-white">
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </motion.div>
                    )}
                </motion.div>

                {/* Right Side: Poster */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="hidden lg:flex justify-end"
                >
                    <div className="relative w-80 xl:w-96 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-white/20 transform perspective-1000">
                        {tmdbData.poster_path && (
                            <img
                                src={`${TMDB_CONFIG.posterSizes.large}${tmdbData.poster_path}`}
                                alt={tmdbData.title || tmdbData.name}
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </div>
                </motion.div>
            </div>
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-prime-dark to-transparent z-10" />

            {/* Trailer Modal */}
            {showTrailer && trailer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setShowTrailer(false)}
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                    >
                        <button 
                            onClick={() => setShowTrailer(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                            className="w-full h-full border-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default DetailsHero;
