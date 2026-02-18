"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Info, Plus, Check } from "lucide-react";
import { Movie, TMDB_CONFIG } from "@/lib/tmdb";

interface HeroProps {
    movies: Movie[];
}

const Hero = ({ movies }: HeroProps) => {
    // Filter out movies without a backdrop path to prevent blank slides
    const validMovies = movies.filter(m => m.backdrop_path);

    const [current, setCurrent] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (!validMovies.length) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % Math.min(validMovies.length, 10));
            setImageLoaded(false); // Reset load state for fade effect
        }, 8000);
        return () => clearInterval(interval);
    }, [validMovies]);

    if (!validMovies.length) return null;

    const heroMovies = validMovies.slice(0, 10);

    return (
        <div className="relative h-[85vh] w-full overflow-hidden bg-gray-800 group">


            {/* Carousel Container */}
            <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] h-full"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {heroMovies.map((movie, index) => (
                    <div key={movie.id} className="min-w-full h-full relative">
                        {/* Background */}
                        <div className="absolute inset-0 bg-gray-900" />

                        <div className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"}`}>
                            <div className="absolute inset-0">
                                <img
                                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    onLoad={() => setImageLoaded(true)}
                                />
                            </div>
                            {/* Prime Video Style Gradients */}
                            <div className="absolute inset-0 bg-gradient-to-r from-prime-dark via-prime-dark/70 to-transparent lg:via-prime-dark/40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-prime-dark via-prime-dark/20 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-20">
                            <div className="max-w-3xl space-y-6 z-10 pl-2">
                                {/* Title */}
                                <h1 className={`text-4xl md:text-6xl lg:text-7xl font-sans font-light text-white tracking-tight leading-[1.1] transition-all duration-700 delay-200 ${index === current ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                                    {movie.title || movie.name}
                                </h1>

                                {/* Metadata Row */}
                                <div className={`flex items-center space-x-4 text-gray-300 text-sm md:text-base font-medium transition-all duration-700 delay-300 ${index === current ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                                    <span className="flex items-center text-gray-400">
                                        IMDb <span className="text-white ml-1.5 font-bold">{movie.vote_average.toFixed(1)}</span>
                                    </span>
                                    <span className="text-gray-600">•</span>
                                    <span className="text-white">{movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}</span>
                                    <span className="text-gray-600">•</span>
                                    <span className="ml-2 bg-gray-700/50 rounded px-2 py-0.5 text-xs">4K UHD</span>
                                </div>

                                {/* Description */}
                                <p className={`text-gray-300 text-base md:text-lg line-clamp-3 font-light leading-relaxed max-w-2xl transition-all duration-700 delay-400 ${index === current ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                                    {movie.overview}
                                </p>

                                {/* Buttons */}
                                <div className={`flex items-center space-x-4 pt-4 transition-all duration-700 delay-500 ${index === current ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                                    <Link
                                        href={`/watch/${movie.media_type || 'movie'}/${movie.id}`}
                                        className="flex items-center space-x-3 bg-white text-prime-dark px-8 py-4 rounded-[4px] font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105"
                                    >
                                        <Play className="fill-current w-6 h-6" />
                                        <span>Watch now</span>
                                    </Link>

                                    <button className="p-4 rounded-full bg-gray-600/40 backdrop-blur-md text-gray-200 hover:bg-gray-600/60 hover:text-white hover:scale-110 transition-all border-2 border-transparent hover:border-white/20">
                                        <Info className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>




        </div>
    );
};

export default Hero;
