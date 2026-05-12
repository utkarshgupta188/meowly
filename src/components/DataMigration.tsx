"use client";

import React, { useEffect, useState } from "react";

const MIGRATION_DONE_KEY = "meowly_migration_completed";
const SOURCE_ORIGIN = "https://meowly.vercel.app";
const MIGRATION_URL = `${SOURCE_ORIGIN}/migration.html`;

export default function DataMigration() {
  const [shouldLoadIframe, setShouldLoadIframe] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hostname = window.location.hostname;
    // Do not run if we are already on the source old domain, or if migration has already been completed
    const isOldDomain = hostname === "meowly.vercel.app";
    const isMigrationDone = localStorage.getItem(MIGRATION_DONE_KEY) === "true";

    if (!isOldDomain && !isMigrationDone) {
      setShouldLoadIframe(true);

      const handleMessage = (event: MessageEvent) => {
        // Security check: Only allow messages originating from the old trusted domain
        if (event.origin !== SOURCE_ORIGIN) return;

        const data = event.data;
        if (data && data.type === "meowly-migration-data") {
          console.log("[Migration] Received cross-domain storage data from origin:", event.origin);

          try {
            // 1. Merge Recently Played History
            if (data.recentlyPlayed && data.recentlyPlayed !== "[]") {
              const oldPlayed = JSON.parse(data.recentlyPlayed);
              if (Array.isArray(oldPlayed)) {
                const currentPlayedStr = localStorage.getItem("meowly_recently_played");
                const currentPlayed = currentPlayedStr ? JSON.parse(currentPlayedStr) : [];
                
                // Combine lists using unique ID + Type as key
                const mergedMap = new Map();
                
                // Load old domain's items first
                oldPlayed.forEach((item: any) => {
                  if (item && item.id && item.type) {
                    mergedMap.set(`${item.type}_${item.id}`, item);
                  }
                });
                
                // Current domain's items overwrite old ones if there's a conflict
                if (Array.isArray(currentPlayed)) {
                  currentPlayed.forEach((item: any) => {
                    if (item && item.id && item.type) {
                      mergedMap.set(`${item.type}_${item.id}`, item);
                    }
                  });
                }
                
                // Sort by last_played descending, cap at 20 items
                const mergedList = Array.from(mergedMap.values())
                  .sort((a: any, b: any) => (b.last_played || 0) - (a.last_played || 0))
                  .slice(0, 20);

                localStorage.setItem("meowly_recently_played", JSON.stringify(mergedList));
                window.dispatchEvent(new Event("recentlyPlayedUpdated"));
              }
            }

            // 2. Merge Watchlist History
            if (data.watchlist && data.watchlist !== "[]") {
              const oldWatch = JSON.parse(data.watchlist);
              if (Array.isArray(oldWatch)) {
                const currentWatchStr = localStorage.getItem("meowly_watchlist");
                const currentWatch = currentWatchStr ? JSON.parse(currentWatchStr) : [];

                const mergedMap = new Map();
                
                // Add old items
                oldWatch.forEach((item: any) => {
                  if (item && item.id && item.type) {
                    mergedMap.set(`${item.type}_${item.id}`, item);
                  }
                });
                
                // Add current items (overwriting)
                if (Array.isArray(currentWatch)) {
                  currentWatch.forEach((item: any) => {
                    if (item && item.id && item.type) {
                      mergedMap.set(`${item.type}_${item.id}`, item);
                    }
                  });
                }

                const mergedList = Array.from(mergedMap.values())
                  .sort((a: any, b: any) => (b.last_played || 0) - (a.last_played || 0));

                localStorage.setItem("meowly_watchlist", JSON.stringify(mergedList));
                window.dispatchEvent(new Event("watchlistUpdated"));
              }
            }

            // 3. Sync PWA installation status
            if (data.installed === "true") {
              localStorage.setItem("pwa-installed", "true");
            }

            // Set final completion marker
            localStorage.setItem(MIGRATION_DONE_KEY, "true");
            console.log("[Migration] Cross-origin migration completed successfully!");
          } catch (err) {
            console.error("[Migration] Error parsing/merging migrated data:", err);
          } finally {
            setShouldLoadIframe(false);
          }
        }
      };

      window.addEventListener("message", handleMessage);
      return () => {
        window.removeEventListener("message", handleMessage);
      };
    }
  }, []);

  if (!shouldLoadIframe) return null;

  return (
    <iframe
      src={MIGRATION_URL}
      style={{ display: "none", width: 0, height: 0, border: "none" }}
      title="Meowly Cross-Domain Migration"
    />
  );
}
