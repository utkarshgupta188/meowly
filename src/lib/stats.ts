export type MediaType = "movie" | "tv";

export interface WatchEvent {
  type: MediaType;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  genres: string[];
  runtimeMinutes: number;
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

export function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function datesForRange(range: StatsRange, now = new Date()): string[] {
  const days: string[] = [];
  const start = new Date(now);
  if (range === "today") {
    days.push(dayKey(start));
  } else if (range === "yesterday") {
    start.setUTCDate(start.getUTCDate() - 1);
    days.push(dayKey(start));
  } else if (range === "week") {
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - i);
      days.push(dayKey(d));
    }
  } else if (range === "month") {
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - i);
      days.push(dayKey(d));
    }
  }
  return days;
}
