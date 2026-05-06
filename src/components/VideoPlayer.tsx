"use client";

import React, { useState } from "react";
import { Monitor, Server, ChevronDown, Maximize2, Minimize2, RefreshCcw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveToRecentlyPlayed } from "@/lib/storage";
import Dropdown from "@/components/ui/Dropdown";

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
        movie: (id: string) => `https://vidsrc.pm/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`,
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
            <div className="bg-prime-card p-4 border-t border-gray-800 flex flex-wrap items-center justify-between gap-4">
                {/* Server Selector */}
                <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide py-1">
                    <div className="flex items-center text-gray-400 mr-2">
                        <Server className="h-4 w-4 mr-1" />
                        <span className="text-xs font-bold uppercase whitespace-nowrap">Source</span>
                    </div>
                    <div className="flex items-center bg-prime-hover rounded-lg p-1">
                        {SERVERS.map((server, idx) => (
                            <button
                                key={server.name}
                                onClick={() => {
                                    setSelectedServer(idx);
                                }}
                                className={cn(
                                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap",
                                    selectedServer === idx
                                        ? "bg-accent text-black shadow-md"
                                        : "text-gray-400 hover:text-white"
                                )}
                            >
                                {server.name}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPlayerKey(prev => prev + 1)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        title="Reload Player"
                    >
                        <RefreshCcw className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {/* Theater Mode Toggle */}
                    <button
                        onClick={() => setIsTheaterMode(!isTheaterMode)}
                        className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-prime-hover text-gray-300 hover:text-white transition-all border border-white/5"
                    >
                        {isTheaterMode ? (
                            <><Minimize2 className="h-4 w-4" /> <span className="text-xs font-bold">Normal</span></>
                        ) : (
                            <><Maximize2 className="h-4 w-4" /> <span className="text-xs font-bold">Theater</span></>
                        )}
                    </button>

                    {/* TV Controls */}
                    {type === "tv" && seasons.length > 0 && (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Season</span>
                                <Dropdown
                                    value={currentSeason}
                                    onChange={(val) => handleSeasonChange(Number(val))}
                                    options={seasons.map((s: any) => ({
                                        value: s.season_number,
                                        label: s.name || `Season ${s.season_number}`
                                    }))}
                                    className="px-4 py-2 rounded-lg text-sm bg-[#1a242f] hover:bg-[#1a242f]/80 border-none shadow-none font-bold"
                                    menuClassName="min-w-[150px] bottom-full mb-2 mt-0 top-auto origin-bottom-left"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Episode</span>
                                <Dropdown
                                    value={currentEpisode}
                                    onChange={(val) => handleEpisodeChange(Number(val))}
                                    options={Array.from(
                                        { length: seasons.find((s: any) => s.season_number === currentSeason)?.episode_count || 50 },
                                        (_, i) => ({ value: i + 1, label: `Episode ${i + 1}` })
                                    )}
                                    className="px-4 py-2 rounded-lg text-sm bg-[#1a242f] hover:bg-[#1a242f]/80 border-none shadow-none font-bold"
                                    menuClassName="min-w-[150px] bottom-full mb-2 mt-0 top-auto origin-bottom-left"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
