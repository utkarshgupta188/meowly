import type { WatchEvent } from "@/lib/stats";

// One heartbeat per 5 minutes the player stays open. Each heartbeat records
// 5 minutes — nothing is credited for just opening a title, and a 2-hour
// movie only reaches 2 hours if the player stays open for 2 hours.
const HEARTBEAT_MS = 5 * 60_000;
const HEARTBEAT_MINUTES = 5;
// A viewing counts as one play at most once per title/episode per 30 minutes.
const PLAY_DEDUPE_MS = 30 * 60_000;

function playKey(event: WatchEvent): string {
  return `meowly_stats_play:${event.type}:${event.tmdbId}:${event.season ?? ""}:${event.episode ?? ""}`;
}

export function reportWatch(event: Omit<WatchEvent, "minutes" | "isPlay">): () => void {
  if (typeof window === "undefined") return () => {};

  const sendHeartbeat = () => {
    let isPlay = false;
    try {
      const key = playKey(event as WatchEvent);
      const last = Number(sessionStorage.getItem(key) || 0);
      if (Date.now() - last >= PLAY_DEDUPE_MS) {
        isPlay = true;
        sessionStorage.setItem(key, String(Date.now()));
      }
    } catch {
      // No storage (e.g. private mode): still record minutes, never a play.
    }
    fetch("/api/stats/watch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...event, minutes: HEARTBEAT_MINUTES, isPlay }),
      keepalive: true,
    }).catch(() => {});
  };

  const timer = window.setInterval(sendHeartbeat, HEARTBEAT_MS);
  return () => window.clearInterval(timer);
}
