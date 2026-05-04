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


export default function Template({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
