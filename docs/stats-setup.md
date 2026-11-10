# Site Stats — setup

The `/stats` page shows site-wide totals: most watched titles and genres,
and total watch hours for today, yesterday, this week, this month, and all time.

## 1. Setup (VPS — nothing to install)

Meowly is deployed on a VPS, so stats use a local file on the server disk —
no Vercel KV, no external database, no extra service.

- Events are appended to `data/stats/events.jsonl` (one line per anonymous
  watch event). That folder is git-ignored.
- **Do not wipe `data/` on deploy.** If your deploy script clears the app
  folder, keep `data/` or move it with `STATS_DATA_DIR=/path/to/stats-data`.
- Back up `data/stats/events.jsonl` like any other site data — it is the
  whole stats history. Deleting it resets all stats to zero.

Without write access to that folder, the site still builds and runs;
`/stats` just shows empty totals and watch events are dropped
(`{ ok: true, stored: false }`).

## 2. What gets counted

When a player has been open for 60 seconds, the browser sends one event to
`POST /api/stats/watch` with only:

- `type` — `movie` or `tv`
- `tmdbId`, `title`, `posterPath`
- `genres` — names only, max 5
- `runtimeMinutes` — capped at 5–300

No accounts, no names, no emails, no IP addresses, no device info, no
cookies, no fingerprint. One event per title per 30 minutes in the same
browser tab session, so refreshes don't inflate the numbers.

## 3. How it is stored

One JSONL line per event, with a UTC date (`day`) on each line. The
`/stats` page and `GET /api/stats?range=week` read the file and aggregate
in memory — plays, watch hours, top titles, top genres. `GET /api/stats`
is cached for 5 minutes.

At ~10k plays a month the file stays small. If traffic grows a lot, swap
`src/lib/stats-store.ts` for SQLite/Redis and keep the same
`recordWatch` / `getSiteStats` API.

## 4. Watch hours are estimates

The video is embedded from another source, so Meowly cannot see actual
playback time. Watch hours = sum of title runtimes for counted plays.
The `/stats` page says this plainly.
