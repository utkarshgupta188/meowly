"use client";

import React, { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Movie } from "@/lib/tmdb";
import EpisodeList from "@/components/EpisodeList";
import MovieRow from "@/components/MovieRow";
import DetailsHero from "@/components/DetailsHero";
import { Star, Calendar, Clock } from "lucide-react";
import { getSeasonDetailsAction } from "@/app/actions";
import Link from "next/link";

interface WatchContainerProps {
    type: "movie" | "tv";
    id: string;
    tmdbData: any;
}

export default function WatchContainer({ type, id, tmdbData }: WatchContainerProps) {
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);
    const [activeTab, setActiveTab] = useState<"episodes" | "related" | "details">(type === "movie" ? "details" : "episodes");
    const [showAllCast, setShowAllCast] = useState(false);

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
            air_date: new Date().toISOString()
        }))
        : []);

    const TabButton = ({ name, label }: { name: typeof activeTab, label: string }) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`relative px-6 py-3 text-lg font-bold transition-all duration-300 ${activeTab === name ? "text-prime-blue" : "text-gray-400 hover:text-white"
                }`}
        >
            {label}
            {activeTab === name && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-prime-blue rounded-t-full shadow-[0_0_10px_#00A8E1]" />
            )}
        </button>
    );

    // Playback state
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="flex flex-col animate-in fade-in duration-700">
            {/* Hero / Player Section */}
            <div className={`relative w-full z-20 transition-all duration-700 ${isPlaying ? "md:min-h-[85vh] shadow-[0_4px_40px_rgba(0,0,0,0.5)]" : "h-auto"}`}>

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
            <div className="bg-prime-dark/95 backdrop-blur-sm sticky top-[60px] z-30 border-b border-gray-800 shadow-md">
                <div className="flex items-center space-x-2 px-4 md:px-12">
                    {type === 'tv' && <TabButton name="episodes" label="Episodes" />}
                    <TabButton name="related" label="Related" />
                    <TabButton name="details" label="Details" />
                </div>
            </div>

            {/* Tab Content */}
            <div className="px-4 md:px-12 py-8 min-h-[500px]">
                {activeTab === "episodes" && type === "tv" && (
                    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
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
                    </div>
                )}

                {activeTab === "related" && (
                    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                        <MovieRow
                            title="Recommendations"
                            movies={tmdbData.recommendations?.results?.slice(0, 10).map((r: any) => ({ ...r, media_type: type })) || []}
                        />
                    </div>
                )}

                {activeTab === "details" && (
                    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 space-y-12">
                        {/* Movie Info */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white mb-4">{tmdbData.title || tmdbData.name}</h2>
                            <p className="text-gray-300 text-lg leading-relaxed font-light">{tmdbData.overview}</p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="bg-gray-800/50 p-4 rounded-lg flex-1 min-w-[200px]">
                                    <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Genres</span>
                                    <span className="text-white font-medium">{tmdbData.genres?.map((g: any) => g.name).join(", ")}</span>
                                </div>
                                <div className="bg-gray-800/50 p-4 rounded-lg flex-1 min-w-[200px]">
                                    <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Status</span>
                                    <span className="text-white font-medium">{tmdbData.status}</span>
                                </div>
                                <div className="bg-gray-800/50 p-4 rounded-lg flex-1 min-w-[200px]">
                                    <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Release Date</span>
                                    <span className="text-white font-medium">{tmdbData.release_date || tmdbData.first_air_date}</span>
                                </div>
                            </div>
                        </div>

                        {/* Cast & Crew */}
                        <div className="space-y-6">
                            <div className="bg-prime-card p-6 rounded-lg border border-gray-800">
                                <h3 className="text-gray-400 text-xs uppercase font-bold mb-6 tracking-wider">Cast & Crew</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {(activeTab === "details" ? (showAllCast ? tmdbData.credits?.cast : tmdbData.credits?.cast?.slice(0, 5)) : []).map((person: any) => (
                                        <Link href={`/person/${person.id}`} key={person.id} className="flex items-center space-x-4 group cursor-pointer hover:bg-white/5 p-3 rounded-lg transition-all border border-transparent hover:border-white/10">
                                            <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden border-2 border-transparent group-hover:border-prime-blue transition-colors flex-shrink-0">
                                                {person.profile_path ? (
                                                    <img src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-600 text-[10px] text-gray-400">NA</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-white text-base font-bold group-hover:text-prime-blue transition-colors">{person.name}</p>
                                                <p className="text-gray-500 text-sm">{person.character}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {tmdbData.credits?.cast?.length > 5 && (
                                    <div className="mt-8 text-center md:text-left">
                                        <button
                                            onClick={() => setShowAllCast(!showAllCast)}
                                            className="text-prime-blue text-sm font-bold hover:underline"
                                        >
                                            {showAllCast ? "Show less" : "Show more"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
