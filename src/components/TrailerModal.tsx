"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TrailerModalProps {
    isOpen: boolean;
    onClose: () => void;
    trailerUrl: string | null;
    title: string;
}

const TrailerModal = ({ isOpen, onClose, trailerUrl, title }: TrailerModalProps) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            >
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-10">
                        <h2 className="text-white font-bold text-lg md:text-xl truncate mr-8">{title} - Trailer</h2>
                        <button 
                            onClick={onClose}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md border border-white/10"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {trailerUrl ? (
                        <iframe
                            src={trailerUrl}
                            className="w-full h-full border-none"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center space-y-4 text-center p-8">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                                <X className="w-10 h-10 text-gray-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Trailer Not Found</h3>
                                <p className="text-gray-400 mt-1">We couldn't find a trailer for this title.</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TrailerModal;
