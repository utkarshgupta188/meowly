import { promises as fs } from "fs";
import path from "path";
import {
  datesForRange,
  dayKey,
  type GenreStat,
  type SiteStats,
  type StatsRange,
  type TitleStat,
  type WatchEvent,
} from "@/lib/stats";

// VPS deployment: no external database. Events are appended to a local
// JSONL file on the server disk and aggregated on read. One line per
// anonymous watch event — title, genres and runtime only, no personal data.
// At ~10k plays a month this file stays small; if traffic grows a lot,
// swap this file for SQLite/Redis and keep the same recordWatch/getSiteStats API.
function dataDir(): string {
  return process.env.STATS_DATA_DIR || path.join(process.cwd(), "data", "stats");
}

function eventsFile(): string {
  return path.join(dataDir(), "events.jsonl");
}

interface StoredEvent extends WatchEvent {
  day: string;
  // Lines written before heartbeats existed carry runtimeMinutes instead of
  // minutes/isPlay; those count as one play of the full runtime.
  runtimeMinutes?: number;
}

// Serialise writes so concurrent plays can't interleave lines.
let writeQueue: Promise<void> = Promise.resolve();

export async function recordWatch(event: WatchEvent): Promise<boolean> {
  const line = JSON.stringify({ ...event, day: dayKey(new Date()) }) + "\n";
  const run = writeQueue.then(async () => {
    await fs.mkdir(dataDir(), { recursive: true });
    await fs.appendFile(eventsFile(), line, "utf8");
  });
  writeQueue = run.catch(() => {});
  try {
    await run;
    return true;
  } catch {
    return false;
  }
}

async function readEvents(): Promise<StoredEvent[]> {
  try {
    const text = await fs.readFile(eventsFile(), "utf8");
    const events: StoredEvent[] = [];
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      try {
        events.push(JSON.parse(line) as StoredEvent);
      } catch {
        // Skip a corrupt line, keep the rest.
      }
    }
    return events;
  } catch {
    return [];
  }
}

export async function getSiteStats(range: StatsRange): Promise<SiteStats> {
  const empty: SiteStats = { range, plays: 0, watchHours: 0, titles: [], genres: [] };
  const events = await readEvents();
  if (events.length === 0) return empty;

  const inRange =
    range === "all"
      ? events
      : (() => {
          const days = new Set(datesForRange(range));
          return events.filter((e) => days.has(e.day));
        })();

  if (inRange.length === 0) return empty;

  const titleTotals = new Map<string, { event: StoredEvent; plays: number }>();
  const genreTotals = new Map<string, number>();
  let minutes = 0;
  let plays = 0;
  for (const e of inRange) {
    // Heartbeat line: minutes counted, play only on the first heartbeat.
    // Old-format line: one play of the full runtime.
    const isPlay = e.isPlay ?? true;
    const mins = e.minutes ?? e.runtimeMinutes ?? 0;
    minutes += mins;
    if (!isPlay) continue;
    plays += 1;
    const key = `${e.type}:${e.tmdbId}`;
    const existing = titleTotals.get(key);
    if (existing) existing.plays += 1;
    else titleTotals.set(key, { event: e, plays: 1 });
    for (const g of e.genres) genreTotals.set(g, (genreTotals.get(g) ?? 0) + 1);
  }

  const titles: TitleStat[] = [...titleTotals.values()]
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 10)
    .map(({ event, plays }) => ({
      type: event.type,
      tmdbId: event.tmdbId,
      title: event.title,
      posterPath: event.posterPath,
      plays,
    }));

  const genres: GenreStat[] = [...genreTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, plays]) => ({ name, plays }));

  return {
    range,
    plays,
    watchHours: Math.round((minutes / 60) * 10) / 10,
    titles,
    genres,
  };
}
