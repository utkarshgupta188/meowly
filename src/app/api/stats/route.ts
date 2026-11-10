import { NextResponse } from "next/server";
import { getSiteStats } from "@/lib/stats-store";
import type { StatsRange } from "@/lib/stats";

const RANGES: StatsRange[] = ["today", "yesterday", "week", "month", "all"];

export async function GET(req: Request) {
  const range = new URL(req.url).searchParams.get("range") as StatsRange | null;
  const picked = RANGES.includes(range as StatsRange) ? (range as StatsRange) : "week";
  const stats = await getSiteStats(picked);
  return NextResponse.json(stats, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
