import type { NewsItem } from "./news-types";

type Entry = { at: number; items: NewsItem[] };

const TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, Entry>();

export function getCached(key: string): NewsItem[] | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > TTL_MS) return null;
  return hit.items;
}

/** Stale entry, used as a fallback when the provider rate-limits us. */
export function getStale(key: string): NewsItem[] | null {
  return cache.get(key)?.items ?? null;
}

export function setCached(key: string, items: NewsItem[]) {
  cache.set(key, { at: Date.now(), items });
}
