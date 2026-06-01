import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Option {
    value: string | number;
    label: string;
}

interface DropdownProps {
    value: string | number;
    onChange: (value: any) => void;
    options: Option[];
    className?: string;
    menuClassName?: string;
}

export default function Dropdown({ value, onChange, options, className, menuClassName }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value) || options[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            // Menu is max-h-64 (256px). If space below is less than 280px, open upward.
            setOpenUpward(spaceBelow < 280);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && menuRef.current) {
            const container = menuRef.current;
            const selectedElement = container.querySelector('[data-selected="true"]') as HTMLElement;
            if (selectedElement) {
                const timeoutId = setTimeout(() => {
                    const containerRect = container.getBoundingClientRect();
                    const selectedRect = selectedElement.getBoundingClientRect();
                    const relativeTop = selectedRect.top - containerRect.top + container.scrollTop;
                    container.scrollTop = relativeTop - (container.clientHeight / 2) + (selectedElement.clientHeight / 2);
                }, 50);
                return () => clearTimeout(timeoutId);
            }
        }
    }, [isOpen]);

    return (
        <div className="relative inline-block" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white px-5 py-3 rounded-full font-bold flex items-center space-x-3 transition-all border border-white/10 shadow-lg text-sm select-none",
                    className
                )}
            >
                <span className="truncate">{selectedOption?.label}</span>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-300 ease-out", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, y: openUpward ? -8 : 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: openUpward ? -8 : 8, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }} // smooth ease-out
                        className={cn(
                            "absolute left-0 min-w-[180px] max-h-64 overflow-y-auto bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-[100] focus:outline-none dropdown-scrollbar",
                            openUpward ? "bottom-full mb-2 origin-bottom-left" : "top-full mt-2 origin-top-left",
                            menuClassName
                        )}
                        style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgba(255, 255, 255, 0.2) transparent"
                        }}
                    >
                        <div className="space-y-0.5">
                            {options.map((option) => {
                                const isSelected = option.value === value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        data-selected={isSelected}
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-between select-none",
                                            isSelected 
                                                ? "bg-white text-black font-bold shadow-md" 
                                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                                        )}
                                    >
                                        <span>{option.label}</span>
                                        {isSelected && <Check className="w-4 h-4 shrink-0 ml-2 stroke-[2.5]" />}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
