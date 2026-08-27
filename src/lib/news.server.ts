import { getCached, getStale, setCached } from "./news-cache.server";
import { NEWS_TOPICS, type NewsItem, type NewsResult, type RangeKey, type TopicKey } from "./news-types";

function hostOf(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "google.com" && parsed.pathname.includes("goto")) {
      return "News Source";
    }
    return host;
  } catch {
    return "web";
  }
}

function cleanSnippet(raw?: string): string {
  if (!raw) return "";
  return raw
    .replace(/!\[.*?\]\(.*?\)/g, "") // remove markdown images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // convert markdown links to text
    .replace(/^#+\s+/gm, "") // remove headers
    .replace(/[*_`]/g, "") // remove bold/italic/code markers
    .replace(/\\n/g, " ") // unescape newlines
    .replace(/\s+/g, " ") // collapse whitespaces
    .trim();
}

function extractDate(item: Record<string, unknown>, range: RangeKey): string {
  if (typeof item["date"] === "string" && item["date"].trim()) {
    return item["date"].trim();
  }
  if (typeof item["publishedDate"] === "string" && item["publishedDate"].trim()) {
    return item["publishedDate"].trim();
  }
  if (typeof item["published_date"] === "string" && item["published_date"].trim()) {
    return item["published_date"].trim();
  }

  const url = typeof item["url"] === "string" ? item["url"] : "";
  // Check for ISO / YYYY/MM/DD in URL path
  const urlMatch = url.match(/\/(202\d)[\/-](\d{1,2})[\/-](\d{1,2})\//);
  if (urlMatch && urlMatch[1] && urlMatch[2] && urlMatch[3]) {
    return `${urlMatch[1]}-${urlMatch[2].padStart(2, "0")}-${urlMatch[3].padStart(2, "0")}`;
  }

  // Check for explicit dates in title or snippet (e.g. Aug 25, 2026 or August 25, 2026)
  const text = `${item["title"] ?? ""} ${item["description"] ?? ""} ${item["snippet"] ?? ""}`;
  const textMatch = text.match(
    /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(202\d)\b/i
  );
  if (textMatch && textMatch[1] && textMatch[2] && textMatch[3]) {
    return `${textMatch[1]} ${textMatch[2]}, ${textMatch[3]}`;
  }

  // Contextual fallback based on active range
  if (range === "qdr:d") return "Past 24 hours";
  if (range === "qdr:w") return "This week";
  return "This month";
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

  const apiKey =
    process.env["FIRECRAWL_API_KEY"] ||
    // @ts-ignore
    (typeof import.meta !== "undefined" && import.meta.env?.FIRECRAWL_API_KEY);
  if (!apiKey) return { items: [], error: "FIRECRAWL_API_KEY is not configured" };

  return queued(async () => {
    const again = getCached(key);
    if (again) return { items: again, cached: true };

    const res = await fetch("https://api.firecrawl.dev/v2/search", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        query: NEWS_TOPICS[topic].query,
        limit: 10,
        sources: ["news", "web"],
        tbs: range,
        lang: "en",
      }),
    });

    const json = (await res.json().catch(() => ({}))) as {
      error?: string;
      data?: { news?: unknown[]; web?: unknown[] } | unknown[];
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

    const newsList = Array.isArray((json.data as { news?: unknown[] })?.news)
      ? ((json.data as { news?: unknown[] }).news as Array<Record<string, unknown>>)
      : [];
    const webList = Array.isArray((json.data as { web?: unknown[] })?.web)
      ? ((json.data as { web?: unknown[] }).web as Array<Record<string, unknown>>)
      : Array.isArray(json.data)
        ? (json.data as Array<Record<string, unknown>>)
        : [];

    const combined = [...newsList, ...webList];
    const seenUrls = new Set<string>();
    const items: NewsItem[] = [];

    for (const r of combined) {
      const url = typeof r["url"] === "string" ? r["url"].trim() : "";
      if (!url || seenUrls.has(url)) continue;
      seenUrls.add(url);

      const title =
        typeof r["title"] === "string" && r["title"].trim()
          ? r["title"].trim()
          : hostOf(url);

      const rawDescription =
        (typeof r["snippet"] === "string" ? r["snippet"] : "") ||
        (typeof r["description"] === "string" ? r["description"] : "");

      const description = cleanSnippet(rawDescription);
      const publishedAt = extractDate(r, range);

      items.push({
        title,
        url,
        description,
        source: hostOf(url),
        publishedAt,
      });
    }

    setCached(key, items);
    return { items };
  });
}
