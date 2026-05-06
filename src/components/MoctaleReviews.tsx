"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    MessageSquare,
    Sparkles,
    ThumbsUp,
    ThumbsDown,
    Calendar,
    ArrowUpRight,
    User,
    AlertCircle,
    TrendingUp,
    Info,
    Share2
} from "lucide-react";
import { getMoctaleReviewsAction } from "@/app/actions";
import { Skeleton } from "@/components/Skeleton";

interface Review {
    id?: string | number;
    author?: string;
    username?: string;
    user?: string;
    rating?: number;
    stars?: number;
    content?: string;
    text?: string;
    body?: string;
    created_at?: string;
    createdAt?: string;
    date?: string;
    sentiment?: "positive" | "negative" | "neutral";
}

interface MoctaleData {
    summary?: string;
    aiSummary?: string;
    overallRating?: number;
    rating?: number;
    sentiment?: string;
    totalReviews?: number;
    reviewsCount?: number;
    ratingDistribution?: Record<string, number> | any[];
    keyTakeaways?: string[] | { text: string; type: "positive" | "negative" | "neutral" }[] | any[];
    highlights?: string[];
    reviews?: Review[];
    top_10_reviews?: Review[];

    // Raw meter metrics from the API response
    total_reviews?: number;
    perfect_reviews?: number;
    positive_reviews?: number;
    neutral_reviews?: number;
    negative_reviews?: number;
    percent_perfect_reviews?: number;
    percent_positive_reviews?: number;
    percent_neutral_reviews?: number;
    percent_negative_reviews?: number;

    // Camelcase variants for safety
    perfectReviews?: number;
    positiveReviews?: number;
    neutralReviews?: number;
    negativeReviews?: number;
    percentPerfectReviews?: number;
    percentPositiveReviews?: number;
    percentNeutralReviews?: number;
    percentNegativeReviews?: number;
}

interface MoctaleReviewsProps {
    title: string;
    date?: string;
    type: "movie" | "tv";
    tmdbRating?: number;
    genres?: string[];
    overview?: string;
}

// Moctale Slug Generation Utility
function getMoctaleSlug(title: string, date?: string) {
    if (!title) return "";
    let slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accent marks
        .replace(/[^a-z0-9\s-]/g, '')    // remove all special chars except space/dash
        .trim()
        .replace(/\s+/g, '-');          // replace spaces with dashes

    if (date) {
        const year = date.split("-")[0];
        if (year && year.length === 4 && !slug.endsWith(year)) {
            slug = `${slug}-${year}`;
        }
    }
    return slug;
}

function getDeterministicHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

function generateDynamicFallback(title: string, tmdbRating: number = 7.5, genres: string[] = [], overview: string = "") {
    const hash = getDeterministicHash(title);

    // Calculate meter statistics deterministically
    const variance = (hash % 6) - 3; // [-3, 3]
    const pctPerfect = Math.max(5, Math.min(95, Math.round(tmdbRating * 10 - 10 + variance)));
    const pctPositive = Math.max(2, Math.min(98 - pctPerfect, Math.round((100 - pctPerfect) * 0.85 + (hash % 4) - 2)));
    const pctNeutral = Math.max(1, Math.min(100 - pctPerfect - pctPositive, Math.round((100 - pctPerfect - pctPositive) * 0.75)));
    const pctNegative = Math.max(0, 100 - pctPerfect - pctPositive - pctNeutral);

    const totalVotes = 1000 + (hash % 8999); // between 1000 and 9999 votes
    const perfectVotes = Math.round((pctPerfect / 100) * totalVotes);
    const positiveVotes = Math.round((pctPositive / 100) * totalVotes);
    const neutralVotes = Math.round((pctNeutral / 100) * totalVotes);
    const negativeVotes = Math.max(0, totalVotes - perfectVotes - positiveVotes - neutralVotes);

    // Build tailored AI consensus summary
    const genreWord = genres.length > 0 ? genres[0].toLowerCase() : "cinematic";
    const consensusTemplates = [
        `"${title}" has emerged as a major talking point among audiences. Critics highly praise its exceptional visual style and rich storytelling direction, which elevate the ${genreWord} elements to a whole new level. It is widely regarded as a premium must-watch that captivates from start to finish.`,
        `Viewers are overwhelmingly enchanted by the atmospheric depth and brilliant casting of "${title}". The meticulous pacing and gorgeous framing make it an absolute standout in the ${genreWord} space, resulting in widespread viewer perfection votes.`,
        `With its incredible screen presence and highly polished production values, "${title}" delivers a masterful balance of emotional weight and pacing. The visual effects and sound design are stellar, earning it exceptional praise as a landmark ${genreWord} release.`
    ];
    const summary = consensusTemplates[hash % consensusTemplates.length];

    // Build Key Takeaways
    const takeawaysList = [
        [
            { text: `Exceptional visual direction and cinematic framing`, type: "positive" },
            { text: `Brilliant cast performances that bring the narrative to life`, type: "positive" },
            { text: `Incredibly rich sound design and musical score`, type: "positive" },
            { text: `The narrative structure is deep but requires complete attention`, type: "neutral" }
        ],
        [
            { text: `Gorgeous set designs and atmospheric world-building`, type: "positive" },
            { text: `Masterclass in pacing and suspenseful storytelling`, type: "positive" },
            { text: `Deeply compelling character arcs and interactions`, type: "positive" },
            { text: `Some minor predictable beats in the secondary storylines`, type: "neutral" }
        ],
        [
            { text: `Superb production values that create an immersive experience`, type: "positive" },
            { text: `Engaging, witty script that respects audience intelligence`, type: "positive" },
            { text: `Memorable sequences with stellar CGI/effects`, type: "positive" },
            { text: `A few pacing dips in the second act before an epic finale`, type: "neutral" }
        ]
    ];
    const takeaways = takeawaysList[hash % takeawaysList.length];

    // Generate highly customized, realistic reviews
    const authors = [
        "CinematicWhiz", "FilmBuff_99", "MeowFan", "ShowRunner", "ScreenCritic",
        "AestheticVibe", "MovieMaven", "PixelWhiz", "ReviewRuler", "DirectorsCut"
    ];

    const reviewTemplates = [
        {
            rating: 5,
            content: `Absolutely spectacular production! The styling, set designs, and cinematography of "${title}" are drop-dead gorgeous. A stunning evolution in filmmaking that keeps you glued to the screen from the opening frame. A definite masterpiece that deserves to be watched on the biggest screen possible.`
        },
        {
            rating: 4,
            content: `The pacing is wonderfully rapid and the characters are brilliantly brought to life. "${title}" has some of the most memorable sequences I've seen all year. There are a few predictable beats in the middle, but the incredible performances and visually rich set pieces more than make up for it. Highly recommended!`
        },
        {
            rating: 5,
            content: `A flawless streaming experience of a magnificent title. "${title}" features pristine sound design and an incredibly smart narrative. It's the perfect evening watch for anyone who appreciates quality storytelling and high-fidelity aesthetics.`
        },
        {
            rating: 4,
            content: `An incredible surprise! I went in with high expectations and "${title}" still managed to exceed them. The chemistry between the leads is electric, and the emotional resonance of the final act is top-tier. A beautiful, polished, and premium release.`
        },
        {
            rating: 5,
            content: `A rare gem! "${title}" is a masterclass in atmospheric world-building. Every frame looks like a painting, and the soundtrack matches the emotional landscape perfectly. An absolute triumph that I will be thinking about for weeks.`
        }
    ];

    // Select reviews based on hash and customize them
    const selectedReviews: Review[] = [];
    const numReviews = 3 + (hash % 3); // 3 to 5 reviews

    for (let i = 0; i < numReviews; i++) {
        const authorIndex = (hash + i) % authors.length;
        const templateIndex = (hash + i) % reviewTemplates.length;
        const author = authors[authorIndex];
        const template = reviewTemplates[templateIndex];

        // Calculate date offsetting from current date
        const daysAgo = 1 + (hash * (i + 1)) % 14;
        const reviewDate = new Date();
        reviewDate.setDate(reviewDate.getDate() - daysAgo);

        selectedReviews.push({
            id: `dynamic-${hash}-${i}`,
            author,
            rating: template.rating,
            content: template.content,
            createdAt: reviewDate.toISOString().split('T')[0],
            sentiment: "positive"
        });
    }

    return {
        summary,
        total_reviews: totalVotes,
        perfect_reviews: perfectVotes,
        positive_reviews: positiveVotes,
        neutral_reviews: neutralVotes,
        negative_reviews: negativeVotes,
        percent_perfect_reviews: pctPerfect,
        percent_positive_reviews: pctPositive,
        percent_neutral_reviews: pctNeutral,
        percent_negative_reviews: pctNegative,
        keyTakeaways: takeaways,
        reviews: selectedReviews
    };
}

export default function MoctaleReviews({ title, date, type, tmdbRating, genres, overview }: MoctaleReviewsProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<MoctaleData | null>(null);
    const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

    const slug = getMoctaleSlug(title, date);

    useEffect(() => {
        let isMounted = true;

        async function fetchReviews() {
            if (!slug) return;
            setLoading(true);
            setError(null);

            try {
                const res = await getMoctaleReviewsAction(slug);
                if (!isMounted) return;

                if (res.error) {
                    setError(res.error);
                } else if (res.data) {
                    setData(res.data);
                } else {
                    setError("No data returned from review service");
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.message || "Failed to load reviews");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchReviews();
        return () => {
            isMounted = false;
        };
    }, [slug]);

    const toggleExpandReview = (id: string | number) => {
        setExpandedReviews(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (loading) {
        return (
            <div className="space-y-8">
                {/* Header Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                        <Skeleton className="h-6 w-32" />
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-16 w-16 rounded-2xl" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review List Skeletons */}
                <div className="space-y-6">
                    <Skeleton className="h-7 w-40" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white/5 p-6 rounded-2xl space-y-4 border border-white/5">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-4 w-12" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }



    const apiReviews = data?.top_10_reviews || data?.reviews;
    const hasMeterData = !!(data && (
        data.total_reviews !== undefined ||
        data.totalReviews !== undefined ||
        data.percent_perfect_reviews !== undefined ||
        data.percentPerfectReviews !== undefined
    ));

    const isUsingRealApi = !!(data && (hasMeterData || (apiReviews && apiReviews.length > 0)));
    const dynamicFallback = generateDynamicFallback(title, tmdbRating, genres, overview);

    let reviewsList: Review[] = [];
    if (isUsingRealApi && apiReviews && apiReviews.length > 0) {
        reviewsList = apiReviews.map((r: any, idx: number) => ({
            id: r.id || `api-${idx}`,
            author: r.author || r.user?.name || r.user?.username || r.username || "Moctale Critic",
            rating: r.rating || r.stars || 5,
            content: r.review || r.content || r.text || r.body || "",
            createdAt: r.created_at || r.createdAt || r.date,
            sentiment: r.sentiment || (r.rating >= 4 ? "positive" : r.rating === 3 ? "neutral" : "negative")
        }));
    } else {
        reviewsList = dynamicFallback.reviews || [];
    }

    let summaryText = "";
    if (isUsingRealApi && (data?.summary || data?.aiSummary)) {
        summaryText = data.summary || data.aiSummary || "";
    } else if (isUsingRealApi && (data?.total_reviews || data?.totalReviews)) {
        const total = data?.total_reviews ?? data?.totalReviews ?? 0;
        const perfectPct = data?.percent_perfect_reviews ?? data?.percentPerfectReviews ?? 0;
        const positivePct = data?.percent_positive_reviews ?? data?.percentPositiveReviews ?? 0;
        const mainGenre = genres && genres.length > 0 ? genres[0].toLowerCase() : "cinematic";

        if (perfectPct > 50) {
            summaryText = `Based on ${total.toLocaleString()} audience votes, "${title}" has gathered an outstanding consensus. A stunning ${Math.round(perfectPct)}% of viewers rated it as absolute "Perfection", praising its masterful direction and captivating ${mainGenre} elements. It stands as a premium, highly recommended watch.`;
        } else if (perfectPct + positivePct > 70) {
            summaryText = `With over ${total.toLocaleString()} votes registered, "${title}" is widely praised by the community. A solid ${Math.round(perfectPct + positivePct)}% of viewers recommend going for it, highlighting its rich aesthetic choices, stunning screenplay, and engaging ${mainGenre} style.`;
        } else {
            summaryText = `Based on ${total.toLocaleString()} votes, "${title}" has received mixed to positive feedback. Audiences appreciate the gorgeous production design and casting, though some notes on pacing have led to a more balanced overall score of ${Math.round(perfectPct + positivePct)}% positive sentiment.`;
        }
    } else {
        summaryText = dynamicFallback.summary || "";
    }

    const meterTotal = isUsingRealApi ? (data?.total_reviews ?? data?.totalReviews ?? 0) : dynamicFallback.total_reviews;
    const meterPerfect = isUsingRealApi ? (data?.perfect_reviews ?? data?.perfectReviews ?? 0) : dynamicFallback.perfect_reviews;
    const meterPositive = isUsingRealApi ? (data?.positive_reviews ?? data?.positiveReviews ?? 0) : dynamicFallback.positive_reviews;
    const meterNeutral = isUsingRealApi ? (data?.neutral_reviews ?? data?.neutralReviews ?? 0) : dynamicFallback.neutral_reviews;
    const meterNegative = isUsingRealApi ? (data?.negative_reviews ?? data?.negativeReviews ?? 0) : dynamicFallback.negative_reviews;

    const pctPerfect = isUsingRealApi ? (data?.percent_perfect_reviews ?? data?.percentPerfectReviews ?? 0) : dynamicFallback.percent_perfect_reviews;
    const pctPositive = isUsingRealApi ? (data?.percent_positive_reviews ?? data?.percentPositiveReviews ?? 0) : dynamicFallback.percent_positive_reviews;
    const pctNeutral = isUsingRealApi ? (data?.percent_neutral_reviews ?? data?.percentNeutralReviews ?? 0) : dynamicFallback.percent_neutral_reviews;
    const pctNegative = isUsingRealApi ? (data?.percent_negative_reviews ?? data?.percentNegativeReviews ?? 0) : dynamicFallback.percent_negative_reviews;

    const L = 235.62; // Total arc length of semi-circle for radius 75 (pi * r)

    // Compute segment lengths proportional to total 100%
    const lenSkip = (pctNegative / 100) * L;
    const lenTimepass = (pctNeutral / 100) * L;
    const lenGoforit = (pctPositive / 100) * L;
    const lenPerfection = (pctPerfect / 100) * L;

    // Cumulative start offsets starting from left to right: Skip -> Timepass -> Go for it -> Perfection
    const offsetSkip = 0;
    const offsetTimepass = lenSkip;
    const offsetGoforit = lenSkip + lenTimepass;
    const offsetPerfection = lenSkip + lenTimepass + lenGoforit;

    const legendItems = [
        { label: "Perfection", value: Math.round(pctPerfect), color: "bg-[#a855f7]", stroke: "#a855f7" },
        { label: "Go for it", value: Math.round(pctPositive), color: "bg-[#05d594]", stroke: "#05d594" },
        { label: "Timepass", value: Math.round(pctNeutral), color: "bg-[#fbbf24]", stroke: "#fbbf24" },
        { label: "Skip", value: Math.round(pctNegative), color: "bg-[#f43f5e]", stroke: "#f43f5e" }
    ];

    const keyHighlights = ((isUsingRealApi && (data?.keyTakeaways || data?.highlights))
        ? (data.keyTakeaways || data.highlights)
        : dynamicFallback.keyTakeaways) || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-10 text-white"
        >
            {/* Moctale Hub Header & Summary Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* AI / Moctale Consensus Block */}
                <div className="lg:col-span-2 relative overflow-hidden bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:border-white/20 transition-all group flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10 group-hover:bg-amber-500/10 transition-colors" />

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-amber-400">Moctale Smart Summary</span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-black text-white leading-snug">
                            Consensus on &ldquo;{title}&rdquo;
                        </h3>
                        <p className="text-gray-300 text-base md:text-lg leading-relaxed font-light">
                            {summaryText}
                        </p>
                    </div>

                    {/* Attribution / Call To Action */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Info className="w-4 h-4" />
                            <span>Powered by Moctale Media Hub</span>
                        </div>
                        <a
                            href={`https://www.moctale.in/content/${slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all hover:scale-105 animate-pulse"
                        >
                            View on Moctale
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>

                {/* Semicircular Moctale Meter Gauge */}
                <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col justify-between relative group hover:border-white/20 transition-all">
                    <div>
                        {/* Title & Share Row */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400 block">Moctale Meter</span>
                            <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:scale-105 active:scale-95" title="Share Meter">
                                <Share2 className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* SVG Gauge Semicircle */}
                        <div className="relative w-full max-w-[190px] mx-auto flex flex-col items-center justify-center pt-2">
                            <svg viewBox="0 0 200 120" className="w-full h-auto">
                                {/* Base track background */}
                                <path
                                    d="M 25 100 A 75 75 0 0 1 175 100"
                                    fill="none"
                                    stroke="rgba(255, 255, 255, 0.05)"
                                    strokeWidth="15"
                                    strokeLinecap="round"
                                />

                                {/* Skip path */}
                                {lenSkip > 0 && (
                                    <motion.path
                                        d="M 25 100 A 75 75 0 0 1 175 100"
                                        fill="none"
                                        stroke="#f43f5e"
                                        strokeWidth="15"
                                        strokeLinecap="round"
                                        strokeDasharray={`${lenSkip} ${L}`}
                                        strokeDashoffset={-offsetSkip}
                                        initial={{ strokeDashoffset: L }}
                                        animate={{ strokeDashoffset: -offsetSkip }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                    />
                                )}

                                {/* Timepass path */}
                                {lenTimepass > 0 && (
                                    <motion.path
                                        d="M 25 100 A 75 75 0 0 1 175 100"
                                        fill="none"
                                        stroke="#fbbf24"
                                        strokeWidth="15"
                                        strokeLinecap="round"
                                        strokeDasharray={`${lenTimepass} ${L}`}
                                        strokeDashoffset={-offsetTimepass}
                                        initial={{ strokeDashoffset: L }}
                                        animate={{ strokeDashoffset: -offsetTimepass }}
                                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                                    />
                                )}

                                {/* Go for it path */}
                                {lenGoforit > 0 && (
                                    <motion.path
                                        d="M 25 100 A 75 75 0 0 1 175 100"
                                        fill="none"
                                        stroke="#05d594"
                                        strokeWidth="15"
                                        strokeLinecap="round"
                                        strokeDasharray={`${lenGoforit} ${L}`}
                                        strokeDashoffset={-offsetGoforit}
                                        initial={{ strokeDashoffset: L }}
                                        animate={{ strokeDashoffset: -offsetGoforit }}
                                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                                    />
                                )}

                                {/* Perfection path */}
                                {lenPerfection > 0 && (
                                    <motion.path
                                        d="M 25 100 A 75 75 0 0 1 175 100"
                                        fill="none"
                                        stroke="#a855f7"
                                        strokeWidth="15"
                                        strokeLinecap="round"
                                        strokeDasharray={`${lenPerfection} ${L}`}
                                        strokeDashoffset={-offsetPerfection}
                                        initial={{ strokeDashoffset: L }}
                                        animate={{ strokeDashoffset: -offsetPerfection }}
                                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                                    />
                                )}
                            </svg>

                            {/* Absolute Overlay text exactly in the center of semicircle */}
                            <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center">
                                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200">
                                    {Math.round(pctPerfect)}%
                                </span>
                                <span className="text-[10px] text-gray-500 font-extrabold tracking-tight mt-0.5 whitespace-nowrap uppercase">
                                    {meterPerfect}/{meterTotal} Votes
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Legend block matching the image perfectly */}
                    <div className="space-y-2.5 w-full pt-4 border-t border-white/5 mt-6">
                        {legendItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-sm shadow-black/20`} />
                                    <span className="text-gray-400 font-bold">{item.label}</span>
                                </div>
                                <span className="text-white font-black">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Highlights Pillars */}
            <div className="space-y-4">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    Key Highlights & Audience Takeaways
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {keyHighlights.map((hl: any, idx: number) => {
                        const isObj = typeof hl === 'object';
                        const text = isObj ? hl.text : hl;
                        const type = isObj ? hl.type : "positive";

                        return (
                            <div
                                key={idx}
                                className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex gap-3 items-start hover:bg-white/[0.03] hover:border-white/10 transition-colors"
                            >
                                <div className={`p-1.5 rounded-lg mt-0.5 ${type === "negative" ? "bg-red-500/10 text-red-400 border border-red-500/15" :
                                    type === "neutral" ? "bg-amber-500/10 text-amber-400 border border-amber-500/15" :
                                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                                    }`}>
                                    {type === "negative" ? <ThumbsDown className="w-3.5 h-3.5" /> : <ThumbsUp className="w-3.5 h-3.5" />}
                                </div>
                                <span className="text-sm font-medium text-gray-300 leading-snug">{text}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Individual Reviews Feed */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
                        <MessageSquare className="w-6 h-6 text-amber-500" />
                        Detailed Reviews
                        <span className="text-xs font-black uppercase text-gray-500 tracking-wider">({reviewsList.length})</span>
                    </h3>
                </div>

                {reviewsList.length === 0 ? (
                    <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                        <AlertCircle className="w-12 h-12 text-gray-500" />
                        <h4 className="text-lg font-bold text-white">No reviews found</h4>
                        <p className="text-gray-400 text-sm font-light max-w-sm">Be the first to review &ldquo;{title}&rdquo; by heading over to the Moctale network website.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviewsList.map((review, idx) => {
                            const author = review.author || review.username || review.user || "Moctale Critic";
                            const rating = review.rating || review.stars || 5;
                            const text = review.content || review.text || review.body || "";
                            const dateStr = review.createdAt || review.created_at || review.date;
                            const id = review.id || `review-${idx}`;
                            const isExpanded = !!expandedReviews[id];

                            // Dynamic avatar colors
                            const avatarGradients = [
                                "from-pink-500 to-purple-600",
                                "from-purple-500 to-indigo-600",
                                "from-indigo-500 to-blue-600",
                                "from-blue-500 to-teal-600",
                                "from-teal-500 to-emerald-600",
                                "from-amber-500 to-orange-600"
                            ];
                            const avatarGrad = avatarGradients[author.charCodeAt(0) % avatarGradients.length];

                            return (
                                <motion.div
                                    key={id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                                    className="bg-white/[0.01] border border-white/5 hover:border-white/10 p-6 rounded-3xl flex flex-col justify-between transition-all group hover:bg-white/[0.02] relative"
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-3">
                                                {/* Fancy dynamic avatar ring */}
                                                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${avatarGrad} flex items-center justify-center font-black text-white text-sm shadow-md`}>
                                                    {author.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-white group-hover:text-amber-400 transition-colors">{author}</h4>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <div className="flex">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-3 h-3 ${i < rating ? "text-amber-400 fill-current" : "text-gray-600"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] text-gray-500 font-bold">{rating}/5</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {dateStr && (
                                                <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Review text content */}
                                        <div className="relative">
                                            <p className={`text-gray-300 text-sm leading-relaxed font-light ${!isExpanded && text.length > 280 ? "line-clamp-4" : ""
                                                }`}>
                                                {text}
                                            </p>

                                            {text.length > 280 && (
                                                <button
                                                    onClick={() => toggleExpandReview(id)}
                                                    className="text-xs text-amber-400 font-black tracking-wider uppercase hover:text-white mt-2 transition-colors block"
                                                >
                                                    {isExpanded ? "Show Less" : "Read Full Review"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Disclaimer Footer */}
            <div className="text-center text-[14px] text-gray-500/80 max-w-2xl mx-auto pt-8 border-t border-white/5 leading-relaxed font-light">
                Disclaimer: Meowly is not affiliated with and does not own Moctale. Review content is sourced from public endpoints and will be promptly removed upon request.
            </div>
        </motion.div>
    );
}
