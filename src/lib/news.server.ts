import { getCached, getStale, setCached } from "./news-cache.server";
import { NEWS_TOPICS, type NewsItem, type NewsResult, type RangeKey, type TopicKey } from "./news-types";

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "web";
  }
}

/** Serialize provider calls so a burst of UI requests can't blow the rate limit. */
let chain: Promise<unknown> = Promise.resolve();
function queued<T>(fn: () => Promise<T>): Promise<T> {
  const next = chain.then(fn, fn);
  chain = next.catch(() => undefined);
  return next;
}

export async function searchNews(topic: TopicKey, range: RangeKey): Promise<NewsResult> {
  const key = `${topic}:${range}`;
  const fresh = getCached(key);
  if (fresh) return { items: fresh, cached: true };

  const apiKey = process.env["FIRECRAWL_API_KEY"];
  if (!apiKey) return { items: [], error: "FIRECRAWL_API_KEY is not configured" };

  return queued(async () => {
    const again = getCached(key);
    if (again) return { items: again, cached: true };

    const res = await fetch("https://api.firecrawl.dev/v2/search", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        query: NEWS_TOPICS[topic].query,
        limit: 12,
        tbs: range,
        lang: "en",
      }),
    });

    const json = (await res.json().catch(() => ({}))) as {
      error?: string;
      data?: { web?: unknown[] } | unknown[];
    };

    if (!res.ok) {
      const stale = getStale(key);
      const message =
        res.status === 429
          ? "Too many requests to the news provider — showing the latest cached results. Try again in a minute."
          : json?.error || `News provider request failed (${res.status})`;
      console.error(`Firecrawl search failed [${res.status}]: ${json?.error ?? ""}`);
      return { items: stale ?? [], error: message, cached: Boolean(stale) };
    }

    const raw = Array.isArray(json.data)
      ? json.data
      : ((json.data as { web?: unknown[] })?.web ?? []);

    const items: NewsItem[] = (raw as Array<Record<string, string>>)
      .filter((r) => r && r["url"])
      .map((r) => ({
        title: r["title"] || hostOf(r["url"]!),
        url: r["url"]!,
        description: r["description"] || r["snippet"] || "",
        source: hostOf(r["url"]!),
        publishedAt: r["date"] || r["publishedDate"],
      }));

    setCached(key, items);
    return { items };
  });
}
