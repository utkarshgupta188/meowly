import React from "react";
import { Play, Download } from "lucide-react";
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
}

export default function EpisodeList({ episodes, currentSeason, currentEpisode, onEpisodeSelect }: EpisodeListProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">Episodes <span className="text-gray-400 text-lg font-normal ml-2">Season {currentSeason}</span></h3>
                <span className="text-gray-400 text-sm">{episodes.length} episodes</span>
            </div>

            <div className="space-y-1">
                {episodes.map((ep) => {
                    const isCurrent = ep.episode_number === currentEpisode;
                    return (
                        <div
                            key={ep.id}
                            onClick={() => onEpisodeSelect(ep.episode_number)}
                            className={cn(
                                "group flex flex-col md:flex-row gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 border border-transparent",
                                isCurrent ? "bg-prime-card border-prime-blue/50" : "hover:bg-prime-card/50 hover:border-white/10"
                            )}
                        >
                            {/* Thumbnail */}
                            <div className="relative w-full md:w-64 aspect-video flex-shrink-0 rounded overflow-hidden bg-gray-900">
                                <img
                                    src={ep.still_path ? `https://image.tmdb.org/t/p/w500${ep.still_path}` : "/placeholder-episode.png"}
                                    alt={ep.name}
                                    className={cn("w-full h-full object-cover transition-opacity", isCurrent ? "opacity-100" : "opacity-80 group-hover:opacity-100")}
                                />



                                {/* Play Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black/60 rounded-full p-2">
                                        <Play className="w-8 h-8 text-white fill-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 py-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className={cn("font-bold text-base mb-1", isCurrent ? "text-prime-blue" : "text-white group-hover:text-prime-blue transition-colors")}>
                                            {ep.episode_number}. {ep.name}
                                        </h4>
                                        <p className="text-gray-400 text-xs mb-2">
                                            {ep.air_date} • {ep.runtime || 45}min
                                        </p>
                                    </div>

                                </div>

                                <p className="text-gray-400 text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
                                    {ep.overview || "No description available for this episode."}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
