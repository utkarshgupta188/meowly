"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Building2, MapPin, Globe, ArrowRight, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TMDB_CONFIG } from "@/lib/tmdb";

interface Company {
    id: number;
    name: string;
    logo_path: string | null;
    headquarters: string;
    homepage: string;
    origin_country: string;
}

interface CompaniesClientProps {
    initialCompanies: Company[];
}

export default function CompaniesClient({ initialCompanies }: CompaniesClientProps) {

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    } as any;

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 15
            }
        }
    } as any;

    return (
        <div className="w-full">
            {/* Spotlight Header / Hero */}
            <div className="relative overflow-hidden py-16 md:py-24 rounded-3xl mb-12 border border-white/10 bg-gradient-to-br from-zinc-900/60 via-black/80 to-zinc-900/60 shadow-3xl">
                {/* Visual accents */}
                <div className="absolute -top-12 -left-12 w-72 h-72 rounded-full bg-white/5 blur-3xl animate-pulse" />
                <div className="absolute -bottom-12 -right-12 w-72 h-72 rounded-full bg-white/5 blur-3xl animate-pulse" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-semibold tracking-wider uppercase backdrop-blur-sm shadow-inner"
                    >
                        <Sparkles className="h-4 w-4 text-white animate-pulse" />
                        Production Studios
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white tracking-tight"
                    >
                        Iconic <span className="text-white italic">Studios</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-medium"
                    >
                        Browse films and tv catalogs sorted by the world&apos;s greatest production companies, studios, and distributors.
                    </motion.p>
                </div>
            </div>


            {/* Companies Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key="companies-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                >
                    {initialCompanies.length > 0 ? (
                        initialCompanies.map((company) => {
                            const logoUrl = company.logo_path
                                ? `${TMDB_CONFIG.imageBase}/w500${company.logo_path}`
                                : null;

                            return (
                                <motion.div
                                    key={company.id}
                                    variants={cardVariants}
                                    layout
                                    className="group relative flex flex-col bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/15 rounded-3xl p-6 transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                                >
                                    {/* Abstract background tint on hover */}
                                    <div className="absolute -right-16 -bottom-16 w-36 h-36 rounded-full bg-white/[0.01] group-hover:bg-accent/[0.02] blur-2xl transition-all duration-700" />

                                    <div className="flex flex-col h-full justify-between space-y-6">
                                        <div className="space-y-4">
                                            {/* Logo Container */}
                                            <div className="w-20 h-20 bg-white/90 p-3 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-105 transition-all duration-500">
                                                {logoUrl ? (
                                                    <img
                                                        src={logoUrl}
                                                        alt={company.name}
                                                        loading="lazy"
                                                        className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                                                    />
                                                ) : (
                                                    <Building2 className="h-10 w-10 text-gray-400" />
                                                )}
                                            </div>

                                            {/* Meta Names */}
                                            <div className="space-y-1.5">
                                                <h3 className="text-xl font-black text-white leading-tight group-hover:text-accent transition-colors">
                                                    {company.name}
                                                </h3>
                                                
                                                <div className="flex flex-col gap-1 text-xs text-gray-400 font-medium">
                                                    {company.headquarters && (
                                                        <div className="flex items-center gap-1.5 truncate">
                                                            <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                                                            <span className="truncate">{company.headquarters}</span>
                                                        </div>
                                                    )}
                                                    {company.origin_country && (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[9px] uppercase font-bold text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-md border border-white/5">Country:</span>
                                                            <span className="font-bold text-gray-300">{company.origin_country}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons & layout link */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            {company.homepage ? (
                                                <a
                                                    href={company.homepage}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-accent transition-colors font-semibold"
                                                    id={`studio-website-link-${company.id}`}
                                                >
                                                    <Globe className="h-3.5 w-3.5" />
                                                    <span>Website</span>
                                                </a>
                                            ) : (
                                                <div />
                                            )}

                                            <Link
                                                href={`/company/${company.id}`}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-accent text-white hover:text-black text-xs font-bold tracking-wide transition-all duration-300 border border-white/10 hover:border-transparent group/btn"
                                                id={`studio-explore-btn-${company.id}`}
                                            >
                                                <span>Explore</span>
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-4 rounded-full bg-white/5 border border-white/10 text-gray-500">
                                <Film className="h-10 w-10" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-white">No production studios available</h3>
                                <p className="text-sm text-gray-400">Please check back later.</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
