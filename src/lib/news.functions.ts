import { createServerFn } from "@tanstack/react-start";

export type NewsItem = {
  title: string;
  url: string;
  description: string;
  source: string;
  publishedAt?: string;
};

export const NEWS_TOPICS = {
  models: {
    label: "AI Models",
    query:
      "new AI model release announcement launch (GPT OR Claude OR Gemini OR Llama OR Mistral)",
  },
  ides: {
    label: "Agentic IDEs",
    query:
      "agentic IDE AI coding agent release (Cursor OR Windsurf OR Copilot OR Cline OR Devin OR Antigravity)",
  },
  agents: {
    label: "AI Agents",
    query: "new autonomous AI agent platform launch announcement",
  },
  funding: {
    label: "Launches & Funding",
    query: "AI startup launch funding round announcement developer tools",
  },
} as const;

export type TopicKey = keyof typeof NEWS_TOPICS;

type Input = { topic: TopicKey; range: "qdr:d" | "qdr:w" | "qdr:m" };

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "web";
  }
}

export const fetchAiNews = createServerFn({ method: "POST" })
  .inputValidator((input: Input): Input => {
    const topic = (input?.topic ?? "models") as TopicKey;
    const range = (input?.range ?? "qdr:w") as Input["range"];
    return {
      topic: topic in NEWS_TOPICS ? topic : "models",
      range: ["qdr:d", "qdr:w", "qdr:m"].includes(range) ? range : "qdr:w",
    };
  })
  .handler(async ({ data }): Promise<NewsItem[]> => {
    const apiKey = process.env["FIRECRAWL_API_KEY"];
    if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not configured");

    const res = await fetch("https://api.firecrawl.dev/v2/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: NEWS_TOPICS[data.topic].query,
        limit: 12,
        tbs: data.range,
        lang: "en",
      }),
    });

    const json = (await res.json()) as {
      success?: boolean;
      error?: string;
      data?: { web?: unknown[] } | unknown[];
    };

    if (!res.ok) {
      throw new Error(json?.error || `Firecrawl request failed (${res.status})`);
    }

    const raw = Array.isArray(json.data)
      ? json.data
      : ((json.data as { web?: unknown[] })?.web ?? []);

    return (raw as Array<Record<string, string>>)
      .filter((r) => r && r["url"])
      .map((r) => ({
        title: r["title"] || hostOf(r["url"]!),
        url: r["url"]!,
        description: r["description"] || r["snippet"] || "",
        source: hostOf(r["url"]!),
        publishedAt: r["date"] || r["publishedDate"],
      }));
  });
