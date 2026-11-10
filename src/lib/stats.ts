export type MediaType = "movie" | "tv";

export interface WatchEvent {
  type: MediaType;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  genres: string[];
  // Minutes actually counted by this heartbeat (5 per heartbeat).
  minutes: number;
  // True only on the first heartbeat of a viewing: that is when the title
  // counts as one play. Later heartbeats add minutes only.
  isPlay: boolean;
  season?: number;
  episode?: number;
}

export interface TitleStat {
  type: MediaType;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  plays: number;
}

export interface GenreStat {
  name: string;
  plays: number;
}

export interface SiteStats {
  range: string;
  plays: number;
  watchHours: number;
  titles: TitleStat[];
  genres: GenreStat[];
}

export type StatsRange = "today" | "yesterday" | "week" | "month" | "all";

export const RANGE_LABELS: Record<StatsRange, string> = {
  today: "Today",
  yesterday: "Yesterday",
  week: "This week",
  month: "This month",
  all: "All time",
};

// Day buckets use Asia/Kolkata, not UTC: most viewers are in India, so
// "today" should flip at midnight IST (05:30 UTC), not at midnight UTC.
const TIMEZONE = "Asia/Kolkata";

const dayFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function dayKey(date: Date): string {
  return dayFormat.format(date);
}

export function datesForRange(range: StatsRange, now = new Date()): string[] {
  const days: string[] = [];
  // The IST calendar date, treated as a UTC date so plain day arithmetic
  // steps through IST days (midnight UTC is 05:30 IST, same IST date).
  const base = new Date(`${dayKey(now)}T00:00:00Z`);
  const pushDay = (offset: number) => {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() - offset);
    days.push(dayKey(d));
  };
  if (range === "today") {
    pushDay(0);
  } else if (range === "yesterday") {
    pushDay(1);
  } else if (range === "week") {
    for (let i = 0; i < 7; i++) pushDay(i);
  } else if (range === "month") {
    for (let i = 0; i < 30; i++) pushDay(i);
  }
  return days;
}
