"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastLoggedPath = useRef<string | null>(null);

  useEffect(() => {
    // Generate or retrieve persistent visitor ID
    let visitorId = localStorage.getItem("meowly_visitor_id");
    if (!visitorId) {
      visitorId = "visitor_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("meowly_visitor_id", visitorId);
    }

    // Only log if the pathname changes
    if (lastLoggedPath.current === pathname) return;
    lastLoggedPath.current = pathname;

    const logPageVisit = async () => {
      try {
        await fetch("/api/log-visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            visitorId,
            userAgent: navigator.userAgent
          })
        });
      } catch (e) {
        // Silently ignore tracking failures to not disrupt user experience
      }
    };

    logPageVisit();
  }, [pathname]);

  return null;
}
