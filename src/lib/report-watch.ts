import type { WatchEvent } from "@/lib/stats";

const REPORT_DELAY_MS = 60_000;
const DEDUPE_WINDOW_MS = 30 * 60_000;

export function reportWatch(event: WatchEvent): () => void {
  if (typeof window === "undefined") return () => {};
  const key = `meowly_stats_reported:${event.type}:${event.tmdbId}`;
  try {
    const last = Number(sessionStorage.getItem(key) || 0);
    if (Date.now() - last < DEDUPE_WINDOW_MS) return () => {};
  } catch {
    return () => {};
  }

  const timer = window.setTimeout(() => {
    try {
      sessionStorage.setItem(key, String(Date.now()));
    } catch {
      // ignore
    }
    fetch("/api/stats/watch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
    }).catch(() => {});
  }, REPORT_DELAY_MS);

  return () => window.clearTimeout(timer);
}
