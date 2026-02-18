import React from "react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-prime-dark/95 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-prime-blue rounded-full animate-bounce-custom [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-prime-blue rounded-full animate-bounce-custom [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 bg-prime-blue rounded-full animate-bounce-custom"></div>
                </div>
                <span className="text-sm font-medium text-gray-400 tracking-widest uppercase animate-pulse">
                    Loading
                </span>
            </div>
        </div>
    );
}
