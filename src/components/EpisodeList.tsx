import React from "react";
import { Play, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Episode {
    id: number;
    name: string;
    episode_number: number;
    season_number: number;
    still_path: string;
    overview: string;
    runtime: number;
    air_date: string;
}

interface EpisodeListProps {
    episodes: Episode[];
    currentSeason: number;
    currentEpisode: number;
    onEpisodeSelect: (episode: number) => void;
    isPlaying?: boolean;
}

export default function EpisodeList({ episodes, currentSeason, currentEpisode, onEpisodeSelect, isPlaying = false }: EpisodeListProps) {
    const activeEpisode = episodes.find((ep) => ep.episode_number === currentEpisode) || episodes[0] || null;

    return (
        <div className="space-y-8">
            {/* Active Episode Featured Details Card at the Top */}
            {activeEpisode && isPlaying && (
                <div className="bg-gradient-to-br from-[#1c2836] to-[#0d151f] rounded-3xl p-6 md:p-8 border border-accent/20 shadow-2xl relative overflow-hidden group">
                    {/* Background Glow Effect */}
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-start relative z-10">
                        {/* Thumbnail with Now Playing Badge */}
                        <div className="relative w-full lg:w-[380px] aspect-video flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-white/10">
                            <img
                                src={activeEpisode.still_path ? `https://image.tmdb.org/t/p/w780${activeEpisode.still_path}` : "/placeholder-episode.png"}
                                alt={activeEpisode.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute top-4 left-4 bg-accent text-black font-black uppercase text-[10px] tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                                <Play className="w-3 h-3 fill-current" />
                                Now Playing
                            </div>
                        </div>

                        {/* Full Detailed Text */}
                        <div className="flex-1 py-1 text-center lg:text-left">
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
                                <span className="text-accent text-sm font-black uppercase tracking-widest">Season {currentSeason} • Episode {activeEpisode.episode_number}</span>
                                <span className="text-gray-500 text-xs">•</span>
                                <span className="text-gray-400 text-xs font-semibold">{activeEpisode.air_date}</span>
                                <span className="text-gray-500 text-xs">•</span>
                                <span className="text-gray-400 text-xs font-semibold">{activeEpisode.runtime || 45} mins</span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
                                {activeEpisode.name}
                            </h2>

                            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-4xl">
                                {activeEpisode.overview || "No description available for this episode."}
                            </p>

                            <div className="flex items-center gap-3 mt-6 justify-center lg:justify-start">
                                <button
                                    disabled={activeEpisode.episode_number <= 1}
                                    onClick={() => onEpisodeSelect(activeEpisode.episode_number - 1)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-bold text-gray-300 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/10 cursor-pointer disabled:cursor-not-allowed select-none"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous Episode
                                </button>
                                
                                <button
                                    disabled={activeEpisode.episode_number >= episodes.length}
                                    onClick={() => onEpisodeSelect(activeEpisode.episode_number + 1)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-black hover:bg-accent/90 transition-all text-xs font-black uppercase tracking-wider disabled:opacity-30 disabled:hover:bg-accent cursor-pointer disabled:cursor-not-allowed select-none"
                                >
                                    Next Episode
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* List of Season Episodes */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Season Episodes
                        <span className="text-gray-500 text-sm font-normal">({episodes.length} total)</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                    {episodes.map((ep) => {
                        const isCurrent = ep.episode_number === currentEpisode;
                        return (
                            <div
                                key={ep.id}
                                onClick={() => onEpisodeSelect(ep.episode_number)}
                                className={cn(
                                    "group flex flex-col sm:flex-row gap-4 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border",
                                    isCurrent 
                                        ? "bg-accent/10 border-accent/40 shadow-[0_4px_20px_rgba(251,191,36,0.05)]" 
                                        : "bg-prime-card/20 border-white/5 hover:bg-prime-card/40 hover:border-white/10 hover:shadow-lg"
                                )}
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full sm:w-48 aspect-video flex-shrink-0 rounded-xl overflow-hidden bg-gray-900 border border-white/5">
                                    <img
                                        src={ep.still_path ? `https://image.tmdb.org/t/p/w500${ep.still_path}` : "/placeholder-episode.png"}
                                        alt={ep.name}
                                        className={cn("w-full h-full object-cover transition-opacity", isCurrent ? "opacity-100" : "opacity-75 group-hover:opacity-100")}
                                    />
                                    
                                    {/* Small Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                        <div className="bg-accent rounded-full p-2.5 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                                            <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Title / Overview */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className={cn("font-bold text-base transition-colors", isCurrent ? "text-accent font-extrabold" : "text-white group-hover:text-accent")}>
                                            Episode {ep.episode_number}: {ep.name}
                                        </h4>
                                        {isCurrent && (
                                            <span className="hidden sm:inline bg-accent/20 text-accent text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-accent/20">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-xs mb-2 font-semibold">
                                        {ep.air_date} • {ep.runtime || 45} mins
                                    </p>
                                    <p className="text-gray-400 text-sm line-clamp-1 group-hover:text-gray-300 transition-colors">
                                        {ep.overview || "No description available."}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
