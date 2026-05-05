"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
    type: "movie" | "tv";
    genres: { id: number; name: string }[];
    isFloating?: boolean;
}

const FilterBar = ({ type, genres, isFloating = true }: FilterBarProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") || "");
    const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || "");
    const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "popularity.desc");
    const [isOpen, setIsOpen] = useState(false);

    const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

    const updateFilters = (genre?: string, year?: string, sort?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (genre !== undefined) {
            if (genre) params.set("genre", genre);
            else params.delete("genre");
        }
        if (year !== undefined) {
            if (year) params.set("year", year);
            else params.delete("year");
        }
        if (sort !== undefined) {
            params.set("sort", sort);
        }
        
        router.push(`/${type}s?${params.toString()}`);
    };

    const clearFilters = () => {
        setSelectedGenre("");
        setSelectedYear("");
        setSelectedSort("popularity.desc");
        router.push(`/${type}s`);
    };

    const activeFiltersCount = [selectedGenre, selectedYear].filter(Boolean).length;

    return (
        <div className={cn(
            "relative z-40 w-full mb-10 flex flex-col md:flex-row md:items-center gap-4",
            isFloating ? "px-6 md:px-16 lg:px-24 -mt-12 md:-mt-16" : "px-0 mt-0"
        )}>
            <div className="flex flex-wrap items-center gap-4">
                {/* Filter Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex items-center space-x-2 px-6 py-2.5 rounded-full font-bold transition-all backdrop-blur-xl border",
                        isOpen || activeFiltersCount > 0 
                            ? "bg-accent text-black border-accent" 
                            : "bg-black/60 text-white border-white/10 hover:bg-black/80"
                    )}
                >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filters</span>
                    {activeFiltersCount > 0 && (
                        <span className="ml-1 bg-black/20 px-2 py-0.5 rounded-full text-[10px]">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>

                {/* Quick Sort (Always Visible) */}
                <div className="flex items-center bg-black/60 backdrop-blur-xl rounded-full border border-white/10 p-1">
                    {[
                        { label: "Popular", value: "popularity.desc" },
                        { label: "Newest", value: "primary_release_date.desc" },
                        { label: "Top Rated", value: "vote_average.desc" },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                setSelectedSort(opt.value);
                                updateFilters(undefined, undefined, opt.value);
                            }}
                            className={cn(
                                "px-5 py-1.5 rounded-full text-[11px] font-bold transition-all",
                                selectedSort === opt.value 
                                    ? "bg-white text-black shadow-lg" 
                                    : "text-gray-400 hover:text-white"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="text-gray-400 hover:text-white text-sm font-medium flex items-center"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Clear All
                    </button>
                )}
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-6 right-6 md:left-12 md:right-12 mt-4 p-8 bg-neutral-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Genres */}
                        <div className="space-y-4">
                            <h4 className="text-gray-500 text-xs font-black uppercase tracking-widest">Genres</h4>
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {genres.map((genre) => (
                                    <button
                                        key={genre.id}
                                        onClick={() => {
                                            const newVal = selectedGenre === genre.id.toString() ? "" : genre.id.toString();
                                            setSelectedGenre(newVal);
                                            updateFilters(newVal);
                                        }}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                                            selectedGenre === genre.id.toString()
                                                ? "bg-accent border-accent text-black"
                                                : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
                                        )}
                                    >
                                        {genre.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Release Year */}
                        <div className="space-y-4">
                            <h4 className="text-gray-500 text-xs font-black uppercase tracking-widest">Release Year</h4>
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => {
                                            const newVal = selectedYear === year ? "" : year;
                                            setSelectedYear(newVal);
                                            updateFilters(undefined, newVal);
                                        }}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                                            selectedYear === year
                                                ? "bg-accent border-accent text-black"
                                                : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
                                        )}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort Order (Mobile) */}
                        <div className="md:hidden space-y-4">
                            <h4 className="text-gray-500 text-xs font-black uppercase tracking-widest">Sort By</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { label: "Popularity", value: "popularity.desc" },
                                    { label: "Newest", value: "primary_release_date.desc" },
                                    { label: "Rating", value: "vote_average.desc" },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setSelectedSort(opt.value);
                                            updateFilters(undefined, undefined, opt.value);
                                        }}
                                        className={cn(
                                            "px-4 py-3 rounded-xl text-left text-sm font-bold border",
                                            selectedSort === opt.value
                                                ? "bg-accent border-accent text-black"
                                                : "bg-white/5 border-white/10 text-white"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="bg-white text-black px-8 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-all"
                        >
                            Show Results
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterBar;
