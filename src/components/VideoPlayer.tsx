"use client";

import React, { useState } from "react";
import { Monitor, Server, ChevronDown, Maximize2, Minimize2, RefreshCcw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveToRecentlyPlayed } from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPlayerProps {
    type: "movie" | "tv";
    id: string;
    tmdbData: any;
    season?: number;
    episode?: number;
    onSeasonChange?: (season: number) => void;
    onEpisodeChange?: (episode: number) => void;
}

const SERVERS = [
    {
        name: "Server 1",
        movie: (id: string) => `https://vsembed.ru/embed/movie?tmdb=${id}`,
        show: (id: string, s: number, e: number) => `https://vsembed.ru/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
        useSandbox: false
    },
    {
        name: "Server 2",
        movie: (id: string) => `https://www.vidking.net/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://www.vidking.net/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "Server 3",
        movie: (id: string) => `https://vidlink.pro/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
        useSandbox: false
    }
];

interface CustomDropdownProps {
    value: number;
    options: { value: number; label: string }[];
    onChange: (value: number) => void;
    label: string;
}

function CustomDropdown({ value, options, onChange, label }: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="flex items-center space-x-2" ref={dropdownRef}>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{label}</span>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95 group"
                >
                    <span className="text-xs font-bold text-white group-hover:text-accent transition-colors">
                        {selectedOption?.label || `${label} ${value}`}
                    </span>
                    <ChevronDown className={cn(
                        "h-3 w-3 text-gray-400 transition-transform duration-300",
                        isOpen && "rotate-180 text-accent"
                    )} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute bottom-full mb-3 left-0 min-w-[160px] max-h-[300px] overflow-y-auto bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 z-50 shadow-2xl scrollbar-hide"
                        >
                            <div className="grid gap-1">
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                                            value === opt.value
                                                ? "bg-white text-black"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function VideoPlayer({
    type,
    id,
    tmdbData,
    season: controlledSeason,
    episode: controlledEpisode,
    onSeasonChange,
    onEpisodeChange
}: VideoPlayerProps) {
    const [internalSeason, setInternalSeason] = useState(1);
    const [internalEpisode, setInternalEpisode] = useState(1);
    const [selectedServer, setSelectedServer] = useState(0);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [playerKey, setPlayerKey] = useState(0); // For reloading iframe

    const isControlled = controlledSeason !== undefined && controlledEpisode !== undefined;
    const currentSeason = isControlled ? controlledSeason : internalSeason;
    const currentEpisode = isControlled ? controlledEpisode : internalEpisode;

    const handleSeasonChange = (s: number) => {
        if (isControlled) {
            onSeasonChange?.(s);
        } else {
            setInternalSeason(s);
            setInternalEpisode(1);
        }
    };

    const handleEpisodeChange = (e: number) => {
        if (isControlled) {
            onEpisodeChange?.(e);
        } else {
            setInternalEpisode(e);
        }
    };

    // Save to recently played
    React.useEffect(() => {
        if (tmdbData) {
            saveToRecentlyPlayed({
                id,
                type,
                title: tmdbData.title || tmdbData.name,
                overview: tmdbData.overview,
                poster_path: tmdbData.poster_path,
                backdrop_path: tmdbData.backdrop_path,
                vote_average: tmdbData.vote_average,
                release_date: tmdbData.release_date,
                first_air_date: tmdbData.first_air_date,
                last_played: Date.now(),
                season: type === "tv" ? currentSeason : undefined,
                episode: type === "tv" ? currentEpisode : undefined,
                tagline: tmdbData.tagline,
            });
        }
    }, [id, type, tmdbData, currentSeason, currentEpisode]);

    const currentServer = SERVERS[selectedServer];
    const playerUrl = type === "movie"
        ? currentServer.movie(id)
        : currentServer.show(id, currentSeason, currentEpisode);

    const seasons = tmdbData?.seasons || [];
    const currentSeasonData = seasons.find((s: any) => s.season_number === currentSeason);
    const episodeCount = currentSeasonData?.episode_count || 50;

    const seasonOptions = seasons.map((s: any) => ({
        value: s.season_number,
        label: s.name || `Season ${s.season_number}`
    }));

    const episodeOptions = Array.from({ length: episodeCount }, (_, i) => ({
        value: i + 1,
        label: `Episode ${i + 1}`
    }));

    return (
        <div className="flex flex-col w-full h-full">
            {/* Player Frame */}
            <div className={cn(
                "relative w-full aspect-video md:h-[75vh] bg-black group transition-all duration-500",
                isTheaterMode && "md:h-[90vh] z-40"
            )}>
                <iframe
                    key={playerKey}
                    src={playerUrl}
                    className="w-full h-full border-none"
                    allowFullScreen
                    referrerPolicy="origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    {...((currentServer as any).useSandbox ? { sandbox: "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation" } : {})}
                ></iframe>


                {/* Theater Mode Overlay Shadow */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Control Bar */}
            <div className="bg-[#050505] p-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                {/* Server Selector */}
                <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide py-1">
                    <div className="flex items-center text-gray-500 mr-2">
                        <Server className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Source</span>
                    </div>
                    <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/5">
                        {SERVERS.map((server, idx) => (
                            <button
                                key={server.name}
                                onClick={() => {
                                    setSelectedServer(idx);
                                }}
                                className={cn(
                                    "px-5 py-1.5 rounded-full text-[11px] font-black transition-all whitespace-nowrap tracking-wider",
                                    selectedServer === idx
                                        ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                        : "text-gray-400 hover:text-white"
                                )}
                            >
                                {server.name}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPlayerKey(prev => prev + 1)}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all ml-1"
                        title="Reload Player"
                    >
                        <RefreshCcw className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    {/* TV Controls */}
                    {type === "tv" && seasons.length > 0 && (
                        <div className="flex items-center space-x-6">
                            <CustomDropdown
                                label="Season"
                                value={currentSeason}
                                options={seasonOptions}
                                onChange={handleSeasonChange}
                            />
                            <CustomDropdown
                                label="Episode"
                                value={currentEpisode}
                                options={episodeOptions}
                                onChange={handleEpisodeChange}
                            />
                        </div>
                    )}

                    {/* Theater Mode Toggle */}
                    <button
                        onClick={() => setIsTheaterMode(!isTheaterMode)}
                        className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 text-gray-400 hover:text-white transition-all border border-white/10 active:scale-95 group"
                    >
                        {isTheaterMode ? (
                            <><Minimize2 className="h-4 w-4 group-hover:text-accent transition-colors" /> <span className="text-[11px] font-black uppercase tracking-wider">Normal</span></>
                        ) : (
                            <><Maximize2 className="h-4 w-4 group-hover:text-accent transition-colors" /> <span className="text-[11px] font-black uppercase tracking-wider">Theater</span></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
