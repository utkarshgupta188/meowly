"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Server, Maximize2, RefreshCcw, Share2, Check, PictureInPicture2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveToRecentlyPlayed } from "@/lib/storage";
import { reportWatch } from "@/lib/report-watch";
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
        name: "Vidy",
        movie: (id: string) => `https://www.vidy.st/movie/${id}?color=DC2626`,
        show: (id: string, s: number, e: number) => `https://www.vidy.st/tv/${id}/${s}/${e}?color=DC2626&nextEpisode=true&episodeSelector=true`,
        useSandbox: false
    },
    {
        name: "Filmu",
        movie: (id: string) => `https://embed.filmu.in/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://embed.filmu.in/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "VidZee",
        movie: (id: string) => `https://player.vidzee.wtf/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://player.vidzee.wtf/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "PrimeSRC",
        movie: (id: string) => `https://primesrc.me/embed/movie?tmdb=${id}`,
        show: (id: string, s: number, e: number) => `https://primesrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
        useSandbox: false
    },
    {
        name: "Vidrift",
        movie: (id: string) => `https://vidnest.fun/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidnest.fun/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "VidNest",
        movie: (id: string) => `https://embed.vidrift.in/embed/movie/${id}?brand=Meowly`,
        show: (id: string, s: number, e: number) => `https://embed.vidrift.in/embed/tv/${id}/${s}/${e}?brand=Meowly`,
        useSandbox: false
    },
    {
        name: "Vidfast",
        movie: (id: string) => `https://vidfast.net/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidfast.net/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "VidSrc PM",
        movie: (id: string) => `https://vidsrc.pm/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "VidSrc SU",
        movie: (id: string) => `https://vidsrcme.su/embed/movie?tmdb=${id}`,
        show: (id: string, s: number, e: number) => `https://vidsrcme.su/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
        useSandbox: false
    },
    {
        name: "2Embed",
        movie: (id: string) => `https://www.2embed.skin/embed/${id}`,
        show: (id: string, s: number, e: number) => `https://www.2embed.skin/embedtv/${id}&s=${s}&e=${e}`,
        useSandbox: false
    },
    {
        name: "AutoEmbed",
        movie: (id: string) => `https://autoembed.co/movie/tmdb/${id}`,
        show: (id: string, s: number, e: number) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}`,
        useSandbox: false
    },
    {
        name: "Vidrock",
        movie: (id: string) => `https://vidrock.net/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidrock.net/embed/tv/${id}/${s}/${e}`,
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
    const [pipWindow, setPipWindow] = useState<Window | null>(null);
    const [isInPagePip, setIsInPagePip] = useState(false);
    const pipWindowRef = useRef<Window | null>(null);
    pipWindowRef.current = pipWindow;

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
    useEffect(() => {
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
            const stopReporting = reportWatch({
                type,
                tmdbId: Number(id),
                title: tmdbData.title || tmdbData.name,
                posterPath: tmdbData.poster_path ?? null,
                genres: (tmdbData.genres || []).map((g: any) => g.name).filter(Boolean),
                runtimeMinutes:
                    tmdbData.runtime ||
                    (Array.isArray(tmdbData.episode_run_time) ? tmdbData.episode_run_time[0] : undefined) ||
                    45,
            });
            return stopReporting;
        }
    }, [id, type, tmdbData, currentSeason, currentEpisode]);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Return from PiP to normal in-page theater view
    const returnFromPip = useCallback(() => {
        if (pipWindowRef.current) {
            pipWindowRef.current.close();
            setPipWindow(null);
        }
        setIsInPagePip(false);
        if (typeof window !== "undefined") {
            window.focus();
        }
    }, []);

    // Toggle PiP: OS-level always-on-top window (over all apps, sites, & tabs) with in-page fallback
    const togglePip = useCallback(async () => {
        if (pipWindowRef.current) {
            returnFromPip();
            return;
        }

        if (isInPagePip) {
            setIsInPagePip(false);
            return;
        }

        // Try OS-level Document Picture-in-Picture (floats over all apps, websites, and tabs)
        if (typeof window !== "undefined" && "documentPictureInPicture" in window) {
            try {
                const pip = await (window as any).documentPictureInPicture.requestWindow({
                    width: 560,
                    height: 315,
                });

                // Copy stylesheets and fonts so PiP window has full styling
                document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
                    pip.document.head.appendChild(node.cloneNode(true));
                });

                pip.document.title = `${tmdbData?.title || tmdbData?.name || "Video"} | Meowly`;
                pip.document.body.style.backgroundColor = '#000000';
                pip.document.body.style.margin = '0';
                pip.document.body.style.padding = '0';
                pip.document.body.style.overflow = 'hidden';

                pip.addEventListener("pagehide", () => {
                    setPipWindow(null);
                });

                setPipWindow(pip);
                return;
            } catch (err) {
                console.warn("Document Picture-in-Picture failed, falling back to in-page PiP:", err);
            }
        }

        // Fallback for browsers without Document PiP (e.g. Firefox)
        setIsInPagePip(true);
    }, [isInPagePip, returnFromPip, tmdbData]);

    // Close OS-level PiP window on unmount
    useEffect(() => {
        return () => {
            if (pipWindowRef.current) {
                pipWindowRef.current.close();
            }
        };
    }, []);

    // Keep focus on player when pressing Space, toggle PiP on P
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }
            if (e.code === "Space" || e.key === " ") {
                e.preventDefault(); // Prevent default page scrolling
                if (iframeRef.current) {
                    iframeRef.current.focus();
                }
            } else if (e.key === "p" || e.key === "P") {
                togglePip();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [togglePip]);

    const handleShare = useCallback(() => {
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
    }, [type, id, currentSeason, currentEpisode, selectedServer]);

    // Global shortcut event listeners
    useEffect(() => {
        const handleTogglePip = () => {
            togglePip();
        };
        const handleReload = () => {
            setPlayerKey(prev => prev + 1);
        };
        const handleShareLink = () => {
            handleShare();
        };
        const handleSelectServer = (e: Event) => {
            const index = (e as CustomEvent).detail?.index;
            if (typeof index === "number" && index >= 0 && index < SERVERS.length) {
                setSelectedServer(index);
            }
        };

        window.addEventListener("playerTogglePip", handleTogglePip);
        window.addEventListener("playerReload", handleReload);
        window.addEventListener("playerShare", handleShareLink);
        window.addEventListener("playerSelectServer", handleSelectServer);

        return () => {
            window.removeEventListener("playerTogglePip", handleTogglePip);
            window.removeEventListener("playerReload", handleReload);
            window.removeEventListener("playerShare", handleShareLink);
            window.removeEventListener("playerSelectServer", handleSelectServer);
        };
    }, [selectedServer, currentSeason, currentEpisode, type, id, togglePip, handleShare]);

    const currentServer = SERVERS[selectedServer];
    const playerUrl = type === "movie"
        ? currentServer.movie(id)
        : currentServer.show(id, currentSeason, currentEpisode);

    const seasons = (tmdbData?.seasons as Array<{ season_number: number; name?: string; episode_count: number }>) || [];
    const isAnyPipActive = pipWindow !== null || isInPagePip;

    return (
        <div className="flex flex-col w-full h-full">
            {/* Player Container Slot — Default Theater View */}
            <div className="relative w-full aspect-[14/10] sm:aspect-video md:h-[90vh] bg-black">
                {/* PiP In-Page Placeholder */}
                {isAnyPipActive && (
                    <div className="w-full h-full bg-black/60 border border-dashed border-white/15 rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                        <div className="p-4 rounded-full bg-accent/10 border border-accent/20 mb-3 text-accent animate-pulse">
                            <PictureInPicture2 className="h-8 w-8" />
                        </div>
                        <p className="text-white font-bold text-base sm:text-lg">
                            {pipWindow ? "Playing in Always-On-Top Window" : "Playing in Picture-in-Picture"}
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm max-w-sm mt-1 mb-4">
                            {pipWindow
                                ? "Video is floating over other apps, websites, and tabs so you can multitask anywhere."
                                : "Video is playing in the floating mini-player at the bottom-right corner."}
                        </p>
                        <button
                            onClick={returnFromPip}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/15 flex items-center space-x-2 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            <Maximize2 className="h-4 w-4" />
                            <span>Return to Theater View</span>
                        </button>
                    </div>
                )}

                {/* Regular in-page player (or in-page PiP if fallback) */}
                {!pipWindow && (
                    <div className={cn(
                        "bg-black transition-all duration-300",
                        isInPagePip
                            ? "fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[55] w-[290px] sm:w-[380px] md:w-[450px] aspect-video rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] border border-white/20 overflow-hidden ring-1 ring-white/10 group/pip backdrop-blur-md"
                            : "absolute inset-0 w-full h-full group z-40"
                    )}>
                        {/* PiP Overlay Controls (visible on hover) */}
                        {isInPagePip && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/85 opacity-0 group-hover/pip:opacity-100 transition-opacity z-20 flex flex-col justify-between p-3 pointer-events-none">
                                <div className="flex items-center justify-between pointer-events-auto">
                                    <span className="text-xs font-bold text-white truncate max-w-[190px] sm:max-w-[260px] drop-shadow-md">
                                        {tmdbData?.title || tmdbData?.name} {type === "tv" ? `(S${currentSeason}:E${currentEpisode})` : ""}
                                    </span>
                                    <div className="flex items-center space-x-1.5">
                                        <button
                                            onClick={returnFromPip}
                                            className="p-1.5 rounded-lg bg-black/70 hover:bg-accent hover:text-black text-white transition-all backdrop-blur-sm border border-white/10 cursor-pointer"
                                            title="Restore to Theater View"
                                        >
                                            <Maximize2 className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={returnFromPip}
                                            className="p-1.5 rounded-lg bg-black/70 hover:bg-red-500 text-white transition-all backdrop-blur-sm border border-white/10 cursor-pointer"
                                            title="Exit PiP"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pointer-events-auto">
                                    <span className="text-[10px] uppercase font-bold text-accent tracking-wider bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                                        {currentServer.name} Server
                                    </span>
                                    <button
                                        onClick={() => {
                                            returnFromPip();
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }}
                                        className="text-[11px] font-bold text-white/90 hover:text-accent bg-black/70 px-2.5 py-1 rounded backdrop-blur-sm border border-white/10 transition-colors cursor-pointer"
                                    >
                                        Back to Top ↑
                                    </button>
                                </div>
                            </div>
                        )}

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
                        />

                        {/* Theater Mode Overlay Shadow */}
                        {!isInPagePip && (
                            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                    </div>
                )}

                {/* OS-level Document PiP Portal (Always On Top over all apps, tabs, and websites) */}
                {pipWindow && createPortal(
                    <div className="relative w-screen h-screen bg-black flex flex-col overflow-hidden group">
                        <iframe
                            key={`os-pip-${selectedServer}-${currentSeason}-${currentEpisode}-${playerKey}`}
                            src={playerUrl}
                            className="w-full h-full border-none"
                            allowFullScreen
                            frameBorder="0"
                            scrolling="no"
                            referrerPolicy="origin"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            {...(currentServer.useSandbox ? { sandbox: "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation" } : {})}
                        />
                        {/* PiP Window Top-Right Quick Return Overlay */}
                        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <button
                                onClick={returnFromPip}
                                className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-2xl cursor-pointer flex items-center space-x-1.5 transition-all"
                                title="Return to Meowly Tab"
                            >
                                <Maximize2 className="h-3.5 w-3.5" />
                                <span>Return to Tab</span>
                            </button>
                        </div>
                    </div>,
                    pipWindow.document.body
                )}
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
                                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
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
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                        title="Reload Player"
                    >
                        <RefreshCcw className="h-4 w-4" />
                    </button>

                    <button
                        onClick={handleShare}
                        className={cn(
                            "flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all border cursor-pointer",
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
                    {/* Picture-in-Picture (PiP) Toggle */}
                    <button
                        onClick={togglePip}
                        className={cn(
                            "flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all border cursor-pointer",
                            isAnyPipActive
                                ? "bg-accent text-black border-accent font-bold shadow-md shadow-accent/20"
                                : "bg-prime-hover text-gray-300 hover:text-white border-white/5 hover:border-white/10"
                        )}
                        title="Picture-in-Picture (P) - Float over all apps and tabs"
                    >
                        <PictureInPicture2 className="h-4 w-4" />
                        <span className="text-xs font-bold">{isAnyPipActive ? "Exit PiP" : "PiP"}</span>
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
