import React from "react";
import { Movie, TMDB_CONFIG } from "@/lib/tmdb";
import { Play, Plus, ThumbsUp, ThumbsDown, Download, Share2, Check, MessageSquare, AudioWaveform, ChevronDown } from "lucide-react";
import Link from "next/link";

interface DetailsHeroProps {
    tmdbData: any;
    type: "movie" | "tv";
    onPlay: () => void;
    currentSeason: number;
    onSeasonChange: (season: number) => void;
    currentEpisode: number;
}

const DetailsHero = ({ tmdbData, type, onPlay, currentSeason, onSeasonChange, currentEpisode }: DetailsHeroProps) => {
    const backdropUrl = tmdbData.backdrop_path
        ? `${TMDB_CONFIG.backdropSizes.large}${tmdbData.backdrop_path}`
        : null;

    // Fake metadata for the "Prime" feel if not available
    const rating = tmdbData.vote_average ? tmdbData.vote_average.toFixed(1) : "8.9";
    const year = tmdbData.release_date?.split("-")[0] || tmdbData.first_air_date?.split("-")[0] || "2024";
    const runTime = tmdbData.runtime ? `${Math.floor(tmdbData.runtime / 60)} h ${tmdbData.runtime % 60} min` : type === 'tv' ? `${tmdbData.number_of_episodes || 24} episodes` : "1 h 45 min";

    // Determine season text
    const currentSeasonData = tmdbData.seasons?.find((s: any) => s.season_number === currentSeason);
    const seasonName = currentSeasonData?.name || `Season ${currentSeason}`;

    // Extract Rating
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

    const [copied, setCopied] = React.useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative w-full h-[85vh] md:h-screen min-h-[600px] flex items-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                {backdropUrl && (
                    <img
                        src={backdropUrl}
                        alt={tmdbData.title || tmdbData.name}
                        className="w-full h-full object-cover"
                    />
                )}
                {/* Prime-style Gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-prime-dark via-prime-dark/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-prime-dark via-transparent to-transparent z-10" />
            </div>

            {/* Content Container */}
            <div className="relative z-20 w-full px-4 md:px-12 max-w-7xl mx-auto pt-20 md:pt-0">
                <div className="max-w-2xl space-y-6 animate-in slide-in-from-left-10 fade-in duration-700">
                    {/* Logo/Title */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none drop-shadow-2xl">
                        {tmdbData.title || tmdbData.name}
                    </h1>

                    {/* Ranking Tag (Fake for aesthetic) */}
                    <div className="text-[#00E054] font-bold text-sm md:text-base tracking-wide">
                        #{tmdbData.id ? (tmdbData.id % 10) + 1 : 1} in {tmdbData.genres?.[0]?.name || "Trends"}
                    </div>

                    {/* Season Selector */}
                    {type === 'tv' && (
                        <div className="relative inline-block group">
                            <button className="bg-gray-800/80 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-bold text-xl flex items-center space-x-3 transition-colors border-2 border-gray-600 hover:border-white shadow-lg">
                                <span>{seasonName}</span>
                                <ChevronDown className="w-5 h-5" />
                            </button>
                            {/* Simple dropdown simulation */}
                            <select
                                onChange={(e) => onSeasonChange(Number(e.target.value))}
                                value={currentSeason}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            >
                                {tmdbData.seasons?.filter((s: any) => s.season_number > 0).map((s: any) => (
                                    <option key={s.id} value={s.season_number}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-lg md:text-xl text-white font-medium drop-shadow-md line-clamp-3 leading-relaxed">
                        {tmdbData.overview}
                    </p>

                    {/* Metadata Line */}
                    <div className="flex flex-wrap items-center gap-3 text-gray-300 font-medium text-sm md:text-base">
                        <span className="flex items-center text-gray-400">IMDb <span className="text-white ml-1">{rating}</span></span>
                        <span>{year}</span>
                        <span>{runTime}</span>

                        {/* Badges */}
                        <span className="bg-gray-700/60 px-1.5 py-0.5 rounded-[3px] text-xs font-bold text-gray-300 ring-1 ring-gray-500/50">X-RAY</span>
                        <span className="bg-gray-700/60 px-1.5 py-0.5 rounded-[3px] text-xs font-bold text-gray-300 ring-1 ring-gray-500/50">HDR</span>
                        <span className="bg-gray-700/60 px-1.5 py-0.5 rounded-[3px] text-xs font-bold text-gray-300 ring-1 ring-gray-500/50">UHD</span>

                        {certification && certification !== "NR" && (
                            <span className="border border-white/40 px-1.5 rounded-[3px] text-xs font-bold">{certification}</span>
                        )}

                        <MessageSquare className="w-5 h-5 text-gray-400" />
                        <AudioWaveform className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Genres */}
                    <div className="flex items-center space-x-2 text-prime-blue font-medium text-sm md:text-base underline decoration-transparent hover:decoration-prime-blue transition-all cursor-pointer">
                        {tmdbData.genres?.map((g: any) => g.name).join(" • ")}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 pt-4">
                        {/* Play Button */}
                        <button
                            onClick={onPlay}
                            className="flex items-center space-x-3 bg-white hover:bg-gray-200 text-prime-dark px-8 py-4 rounded-[4px] font-bold text-lg transition-transform hover:scale-105"
                        >
                            <Play className="fill-current w-7 h-7" />
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[10px] uppercase font-black tracking-wider text-prime-dark/70">
                                    {type === 'tv' ? `Episode ${currentEpisode}` : "Movie"}
                                </span>
                                <span>{type === 'tv' ? "Continue watching" : "Watch now"}</span>
                            </div>
                        </button>

                        {/* Circular Buttons */}
                        <div className="flex items-center gap-3">
                            {tmdbData.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube") && (
                                <button
                                    onClick={() => window.open(`https://www.youtube.com/watch?v=${tmdbData.videos.results.find((v: any) => v.type === "Trailer" && v.site === "YouTube").key}`, "_blank")}
                                    className="flex items-center space-x-2 bg-gray-600/40 hover:bg-gray-500/60 backdrop-blur-sm text-gray-100 px-6 py-3 rounded-md font-bold text-lg transition-transform hover:scale-105 border-2 border-transparent hover:border-white/20"
                                >
                                    <Play className="w-6 h-6 fill-current" />
                                    <span>Trailer</span>
                                </button>
                            )}



                            <button
                                onClick={handleShare}
                                className={`w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 border-2 ${copied ? "bg-green-600/80 border-green-500 text-white" : "bg-gray-600/40 hover:bg-gray-500/60 border-transparent hover:border-white/20 text-gray-100"}`}
                                title="Share"
                            >
                                {copied ? <Check className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Gradient Fade for transition to tabs */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-prime-dark to-transparent z-10" />
        </div>
    );
};

export default DetailsHero;
