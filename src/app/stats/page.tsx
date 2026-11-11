import Link from "next/link";
import { BarChart3, Clock, Play, ShieldCheck, TrendingUp } from "lucide-react";
import { getSiteStats } from "@/lib/stats-store";
import { RANGE_LABELS, type StatsRange } from "@/lib/stats";
import { TMDB_CONFIG } from "@/lib/tmdb";

export const metadata = {
  title: "Stats | Meowly",
  description: "What everyone is watching on Meowly right now — most watched titles and genres, and total watch hours. No personal data, just anonymous totals.",
  alternates: { canonical: "https://meowly.qzz.io/stats" },
};

const RANGES: StatsRange[] = ["today", "yesterday", "week", "month", "all"];

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const range: StatsRange = RANGES.includes(params.range as StatsRange)
    ? (params.range as StatsRange)
    : "week";

  const [stats, today, yesterday, week, month] = await Promise.all([
    getSiteStats(range),
    getSiteStats("today"),
    getSiteStats("yesterday"),
    getSiteStats("week"),
    getSiteStats("month"),
  ]);

  const maxGenrePlays = Math.max(1, ...stats.genres.map((g) => g.plays));

  return (
    <main className="min-h-screen bg-prime-dark text-white pb-20">
      <div className="pt-24 sm:pt-28 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
        <header className="mb-10">
          <p className="text-accent text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Site stats
          </p>
          <h1 className="text-4xl md:text-5xl font-black mt-3">What everyone is watching</h1>
          <p className="text-gray-400 mt-3 max-w-2xl">
            Totals for the whole site, not for any one person. Every title below is ranked by how
            many times it was played.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 mb-8">
          {RANGES.map((r) => (
            <Link
              key={r}
              href={`/stats?range=${r}`}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                r === range
                  ? "bg-accent text-black border-accent"
                  : "bg-white/5 text-gray-300 border-white/10 hover:border-accent"
              }`}
            >
              {RANGE_LABELS[r]}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
              <Play className="w-4 h-4" /> Plays · {RANGE_LABELS[range]}
            </p>
            <p className="text-4xl font-black mt-2">{stats.plays.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4" /> Watch hours · {RANGE_LABELS[range]}
            </p>
            <p className="text-4xl font-black mt-2">{stats.watchHours.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Watch hours · today</p>
            <p className="text-4xl font-black mt-2">{today.watchHours.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-1">Yesterday: {yesterday.watchHours.toLocaleString()} hrs</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Watch hours · this week / month</p>
            <p className="text-4xl font-black mt-2">{week.watchHours.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-1">This month: {month.watchHours.toLocaleString()} hrs</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-black flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-accent" /> Most watched · {RANGE_LABELS[range]}
          </h2>
          {stats.titles.length === 0 ? (
            <p className="text-gray-400 bg-white/5 border border-white/10 rounded-3xl p-8">
              No plays counted yet for this period. Once people start watching, the most played
              titles will show up here.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {stats.titles.map((t, i) => (
                <Link key={`${t.type}-${t.tmdbId}`} href={`/watch/${t.type}/${t.tmdbId}`} className="group">
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    <span className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur px-2.5 py-1 rounded-full text-xs font-black">
                      #{i + 1}
                    </span>
                    {t.posterPath ? (
                      <img
                        src={`${TMDB_CONFIG.imageBase}/w342${t.posterPath}`}
                        alt={t.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm px-4 text-center">
                        {t.title}
                      </div>
                    )}
                  </div>
                  <p className="font-bold mt-2 line-clamp-1 group-hover:text-accent">{t.title}</p>
                  <p className="text-gray-500 text-xs">{t.plays.toLocaleString()} plays</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black mb-6">Most watched genres · {RANGE_LABELS[range]}</h2>
          {stats.genres.length === 0 ? (
            <p className="text-gray-400">No genre data yet for this period.</p>
          ) : (
            <div className="space-y-4 max-w-2xl">
              {stats.genres.map((g) => (
                <div key={g.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold">{g.name}</span>
                    <span className="text-gray-400">{g.plays.toLocaleString()} plays</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${Math.round((g.plays / maxGenrePlays) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex gap-4">
          <ShieldCheck className="w-6 h-6 text-accent shrink-0 mt-1" />
          <div>
            <h3 className="font-black text-lg">Privacy: no personal data</h3>
            <p className="text-gray-400 mt-1 leading-relaxed">
              Stats count anonymous watch events only: which title was played, its genres, and
              how long the player stayed open. No accounts, no names, no emails, no IP addresses,
              no device info, and nothing that can identify a viewer. While a title plays, the
              browser sends one heartbeat every 5 minutes, each recording 5 minutes — so a
              2-hour movie only counts as 2 hours if the player stays open for 2 hours, and
              closing it early records only the minutes actually played. A title counts as one
              play on its first heartbeat, at most once every 30 minutes in the same browser.
              Watch hours are player-open time, not exact playback time: the video is embedded
              from another source, so pauses inside the player are not visible to Meowly.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
