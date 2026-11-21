/**
 * Central list of TMDB IDs that must never be shown to users.
 *
 * Add an ID here and it is automatically removed from every list, search
 * result and related/recommendation row that comes through `src/lib/tmdb.ts`.
 * Direct visits to `/watch/<type>/<id>` are turned into a 404 by the watch page.
 *
 * Example:
 *   movie: new Set([1542674, 1234567]),
 */
const BLOCKED_IDS: Record<string, Set<number>> = {
    movie: new Set([1542674]),
    tv: new Set<number>(),
    person: new Set<number>(),
    company: new Set<number>(),
};

export type BlockableMediaType = "movie" | "tv" | "person" | "company";

export function isBlocked(
    mediaType: string | undefined | null,
    id: number | string | undefined | null
): boolean {
    if (id === undefined || id === null || id === "") return false;

    const numericId = typeof id === "number" ? id : Number(id);
    if (!Number.isFinite(numericId)) return false;

    const blocked = BLOCKED_IDS[mediaType || "movie"];
    return blocked ? blocked.has(numericId) : false;
}

/**
 * Returns the items that are allowed to be displayed. `fallbackType` is used
 * for responses (trending, popular, discover, ...) whose items do not carry a
 * `media_type` field.
 */
export function filterBlocked(items: any[] | null | undefined, fallbackType?: string): any[] {
    if (!Array.isArray(items)) return [];

    return items.filter((item) => {
        if (!item || typeof item !== "object") return true;

        const entry = item as { id?: number | string; media_type?: string };
        return !isBlocked(entry.media_type || fallbackType, entry.id);
    });
}
