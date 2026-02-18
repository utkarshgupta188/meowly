"use client";

import React, { useState } from "react";
import { Monitor, Server, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
        movie: (id: string) => `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=false`,
        show: (id: string, s: number, e: number) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}?autoPlay=false`,
        useSandbox: true
    },
    {
        name: "Server 2", // Previously Server 3
        movie: (id: string) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
        show: (id: string, s: number, e: number) => `https://multiembed.mov/?video_id=${id}&s=${s}&e=${e}`,
        useSandbox: false
    },
    {
        name: "Server 3", // Previously Server 4
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

    const currentServer = SERVERS[selectedServer];
    const playerUrl = type === "movie"
        ? currentServer.movie(id)
        : currentServer.show(id, currentSeason, currentEpisode);

    const seasons = tmdbData?.seasons || [];

    return (
        <div className="flex flex-col w-full h-full">
            {/* Player Frame */}
            <div className="relative w-full aspect-video md:h-[75vh] bg-black group">
                <iframe
                    src={playerUrl}
                    className="w-full h-full rounded-md"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    {...((currentServer as any).useSandbox ? { sandbox: "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation" } : {})}
                ></iframe>

                {/* Scroll Helper for Desktop */}
                <button
                    onClick={() => window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' })}
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-prime-blue text-white p-2 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 hidden md:block"
                    title="Scroll to Details"
                >
                    <ChevronDown className="h-5 w-5" />
                </button>
            </div>

            {/* Control Bar */}
            <div className="bg-prime-card/80 backdrop-blur-md p-4 sticky bottom-0 z-40 border-t border-gray-800 flex flex-wrap items-center justify-between gap-4">
                {/* Server Selector */}
                <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
                    <div className="flex items-center text-gray-400 mr-2">
                        <Monitor className="h-4 w-4 mr-1" />
                        <span className="text-xs font-bold uppercase whitespace-nowrap">Source</span>
                    </div>
                    {SERVERS.map((server, idx) => (
                        <button
                            key={server.name}
                            onClick={() => {
                                if (idx === 1) { // Current Server 2 (multiembed.mov)
                                    const url = type === "movie"
                                        ? server.movie(id)
                                        : server.show(id, currentSeason, currentEpisode);
                                    window.open(url, "_blank");
                                    return;
                                }
                                setSelectedServer(idx);
                            }}
                            className={cn(
                                "px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap border border-transparent",
                                selectedServer === idx
                                    ? "bg-prime-blue text-white shadow-lg border-prime-blue/50"
                                    : "bg-prime-hover text-gray-400 hover:text-white hover:bg-prime-hover/80"
                            )}
                        >
                            {server.name} {idx === 1 && "↗"}
                        </button>
                    ))}
                </div>

                {/* TV Controls */}
                {type === "tv" && seasons.length > 0 && (
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Season</span>
                            <div className="relative">
                                <select
                                    value={currentSeason}
                                    onChange={(e) => handleSeasonChange(parseInt(e.target.value))}
                                    className="appearance-none bg-prime-hover text-white border-r-8 border-transparent pr-8 pl-3 py-1.5 rounded-md text-xs font-bold outline-none cursor-pointer hover:bg-prime-hover/70 transition-colors"
                                    style={{ backgroundColor: '#1a242f', color: 'white' }}
                                >
                                    {seasons.map((s: any) => (
                                        <option key={s.id} value={s.season_number} className="bg-prime-card text-white py-2">
                                            {s.name || `Season ${s.season_number}`}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Episode</span>
                            <div className="relative">
                                <select
                                    value={currentEpisode}
                                    onChange={(e) => handleEpisodeChange(parseInt(e.target.value))}
                                    className="appearance-none bg-prime-hover text-white border-r-8 border-transparent pr-8 pl-3 py-1.5 rounded-md text-xs font-bold outline-none cursor-pointer hover:bg-prime-hover/70 transition-colors"
                                    style={{ backgroundColor: '#1a242f', color: 'white' }}
                                >
                                    {Array.from({ length: seasons.find((s: any) => s.season_number === currentSeason)?.episode_count || 50 }, (_, i) => i + 1).map((ep) => (
                                        <option key={ep} value={ep} className="bg-prime-card text-white py-2">
                                            Episode {ep}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
