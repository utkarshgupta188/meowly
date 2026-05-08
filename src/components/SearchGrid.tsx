"use client";

import React from "react";
import { motion } from "framer-motion";
import MovieCard from "./MovieCard";
import { Movie } from "@/lib/tmdb";

interface SearchGridProps {
    results: Movie[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
};

const SearchGrid = ({ results }: SearchGridProps) => {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
        >
            {results.map((movie) => (
                <motion.div key={`${movie.id}-${movie.media_type}`} variants={item}>
                    <MovieCard movie={movie} isFluid={true} />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default SearchGrid;
