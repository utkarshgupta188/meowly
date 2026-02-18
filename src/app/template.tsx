"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationEvents({ onStart }: { onStart: () => void }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        onStart();
    }, [pathname, searchParams, onStart]);

    return null;
}

// export default function Template({ children }: { children: React.ReactNode }) {
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         // Normal transition logic
//         if (loading) {
//             const timer = setTimeout(() => {
//                 setLoading(false);
//             }, 500);
//             return () => clearTimeout(timer);
//         }
//     }, [loading]);

//     // Failsafe: If loading gets stuck for more than 3s, force clear it.
//     useEffect(() => {
//         if (loading) {
//             const failsafe = setTimeout(() => {
//                 console.warn("Loading state stuck, forcing clear.");
//                 setLoading(false);
//             }, 3000);
//             return () => clearTimeout(failsafe);
//         }
//     }, [loading]);

//     return (
//         <>
//             <Suspense fallback={null}>
//                 <NavigationEvents onStart={() => setLoading(true)} />
//             </Suspense>
//             {loading && (
//                 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-prime-dark/90 backdrop-blur-md">
//                     <div className="flex flex-col items-center space-y-4">
//                         <div className="flex space-x-2">
//                             <div className="w-3 h-3 bg-prime-blue rounded-full animate-bounce-custom [animation-delay:-0.3s]"></div>
//                             <div className="w-3 h-3 bg-prime-blue rounded-full animate-bounce-custom [animation-delay:-0.15s]"></div>
//                             <div className="w-3 h-3 bg-prime-blue rounded-full animate-bounce-custom"></div>
//                         </div>
//                         <span className="text-sm font-medium text-gray-400 tracking-widest uppercase animate-pulse">
//                             Loading
//                         </span>
//                     </div>
//                 </div>
//             )}
//             <div className={loading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
//                 {children}
//             </div>
//         </>
//     );
// }

export default function Template({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
