"use client";

import React, { useState } from "react";
import { Server, Maximize2, Minimize2, RefreshCcw, Share2, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveToRecentlyPlayed } from "@/lib/storage";
import Dropdown from "@/components/ui/Dropdown";

interface VideoPlayerProps {
    type: "movie" | "tv";
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tmdbData: any;
    season?: number;
    episode?: number;
    initialServer?: number;
    onSeasonChange?: (season: number) => void;
    onEpisodeChange?: (episode: number) => void;
}

const SERVERS = [
    {
        name: "VidSrc Embed",
        movie: (id: string) => `https://vidsrc-embed.ru/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidsrc-embed.ru/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "VidSrc PM",
        movie: (id: string) => `https://vidsrc.pm/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "Peachify",
        movie: (id: string) => `https://peachify.top/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://peachify.top/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "Vidlink",
        movie: (id: string) => `https://vidlink.pro/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "Vidfast",
        movie: (id: string) => `https://vidfast.net/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidfast.net/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "PrimeSRC",
        movie: (id: string) => `https://primesrc.me/embed/movie?tmdb=${id}`,
        show: (id: string, s: number, e: number) => `https://primesrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
        useSandbox: false
    },
    {
        name: "Vidrock",
        movie: (id: string) => `https://vidrock.net/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidrock.net/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "VidSrc CC",
        movie: (id: string) => `https://vidsrc.cc/v2/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "Vidify",
        movie: (id: string) => `https://pro.vidify.top/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://pro.vidify.top/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "Videasy",
        movie: (id: string) => `https://player.videasy.net/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://player.videasy.net/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "Vidking",
        movie: (id: string) => `https://www.vidking.net/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://www.vidking.net/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "Vidzee",
        movie: (id: string) => `https://player.vidzee.wtf/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://player.vidzee.wtf/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "2Embed",
        movie: (id: string) => `https://www.2embed.skin/embed/${id}`,
        show: (id: string, s: number, e: number) => `https://www.2embed.skin/embedtv/${id}&s=${s}&e=${e}`,
        useSandbox: false
    },
    {
        name: "HNEmbed",
        movie: (id: string) => `https://hnembed.cc/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://hnembed.cc/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    }
];

export default function VideoPlayer({
    type,
    id,
    tmdbData,
    season: controlledSeason,
    episode: controlledEpisode,
    initialServer,
    onSeasonChange,
    onEpisodeChange
}: VideoPlayerProps) {
    const [internalSeason, setInternalSeason] = useState(1);
    const [internalEpisode, setInternalEpisode] = useState(1);
    const [selectedServer, setSelectedServer] = useState(initialServer ?? 0);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [playerKey, setPlayerKey] = useState(0); // For reloading iframe
    const [copied, setCopied] = useState(false);

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

    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    // Keep focus on player when pressing Space
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }
            if (e.code === "Space" || e.key === " ") {
                e.preventDefault(); // Prevent default page scrolling
                if (iframeRef.current) {
                    iframeRef.current.focus();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleShare = () => {
        const shareUrl = `${window.location.origin}/watch/${type}/${id}?resume=true` +
            (type === 'tv' ? `&s=${currentSeason}&e=${currentEpisode}` : '') +
            `&server=${selectedServer}`;

        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
                console.error("Failed to copy link: ", err);
            });
    };

    const currentServer = SERVERS[selectedServer];
    const playerUrl = type === "movie"
        ? currentServer.movie(id)
        : currentServer.show(id, currentSeason, currentEpisode);

    const seasons = (tmdbData?.seasons as Array<{ season_number: number; name?: string; episode_count: number }>) || [];

    return (
        <div className="flex flex-col w-full h-full">
            {/* Player Frame */}
            <div className={cn(
                "relative w-full aspect-[14/10] sm:aspect-video md:h-[85vh] bg-black group transition-all duration-500",
                isTheaterMode && "md:h-[90vh] z-40"
            )}>
                <iframe
                    ref={iframeRef}
                    key={`${selectedServer}-${currentSeason}-${currentEpisode}-${playerKey}`}
                    src={playerUrl}
                    className="w-full h-full border-none"
                    allowFullScreen
                    frameBorder="0"
                    scrolling="no"
                    referrerPolicy="origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    {...(currentServer.useSandbox ? { sandbox: "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation" } : {})}
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

                    <button
                        onClick={handleShare}
                        className={cn(
                            "flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all border",
                            copied
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-prime-hover text-gray-300 hover:text-white border-white/5 hover:border-white/10"
                        )}
                        title="Copy Playback Link"
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4" />
                                <span className="text-xs font-bold">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Share2 className="h-4 w-4" />
                                <span className="text-xs font-bold">Share Link</span>
                            </>
                        )}
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
                                    options={seasons.map((s) => ({
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
                                        { length: seasons.find((s) => s.season_number === currentSeason)?.episode_count || 50 },
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
