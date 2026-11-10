import { NextResponse } from "next/server";
import { recordWatch } from "@/lib/stats-store";
import type { WatchEvent } from "@/lib/stats";

function cleanTitle(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const title = value.trim().slice(0, 120);
  return title.length > 0 ? title : null;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "invalid event" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  const title = cleanTitle(b.title);
  const tmdbId = Number(b.tmdbId);
  const minutes = Math.round(Number(b.minutes));
  const isPlay = b.isPlay === true;
  const genres = Array.isArray(b.genres)
    ? (b.genres as unknown[]).filter((g): g is string => typeof g === "string").map((g) => g.trim().slice(0, 40)).filter(Boolean).slice(0, 5)
    : [];

  if ((b.type !== "movie" && b.type !== "tv") || !Number.isInteger(tmdbId) || tmdbId <= 0 || !title || !Number.isInteger(minutes) || minutes < 1 || minutes > 10) {
    return NextResponse.json({ ok: false, error: "invalid event" }, { status: 400 });
  }

  const event: WatchEvent = {
    type: b.type,
    tmdbId,
    title,
    posterPath: typeof b.posterPath === "string" ? b.posterPath.slice(0, 120) : null,
    genres,
    minutes,
    isPlay,
  };
  const season = Number(b.season);
  const episode = Number(b.episode);
  if (Number.isInteger(season) && season >= 1) event.season = season;
  if (Number.isInteger(episode) && episode >= 1) event.episode = episode;

  const stored = await recordWatch(event);
  return NextResponse.json({ ok: true, stored });
}
