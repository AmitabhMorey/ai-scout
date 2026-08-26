import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAiNews, NEWS_TOPICS, type RangeKey, type TopicKey } from "@/lib/news.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Pulse — New AI Models & Agentic IDE Releases" },
      {
        name: "description",
        content:
          "A quiet, source-linked briefing on new AI model launches, agentic IDEs and coding agents, refreshed on demand.",
      },
      { property: "og:title", content: "AI Pulse — New AI Models & Agentic IDE Releases" },
      {
        property: "og:description",
        content:
          "Track what's shipping in AI: new models, agentic IDEs, coding agents and launches, in one briefing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const RANGES = [
  { key: "qdr:d", label: "24 hours" },
  { key: "qdr:w", label: "Week" },
  { key: "qdr:m", label: "Month" },
] as const;

function Index() {
  const [topic, setTopic] = useState<TopicKey>("models");
  const [range, setRange] = useState<RangeKey>("qdr:w");

  const run = useServerFn(fetchAiNews);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["ai-news", topic, range],
    queryFn: () => run({ data: { topic, range } }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const items = data?.items ?? [];
  const error = data?.error;
  const isPending = isFetching;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-baseline justify-between px-6 py-5">
          <span className="font-serif-display text-lg tracking-tight">AI Pulse</span>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Release briefing
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 pb-24">
        <section className="border-b border-border py-12">
          <h1 className="font-serif-display max-w-2xl text-balance text-4xl font-normal leading-[1.15] tracking-tight sm:text-5xl">
            What&apos;s shipping in AI and agentic IDEs
          </h1>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
            New model releases, coding agents and IDE launches — collected from the live web with
            sources and dates.
          </p>
        </section>

        <section className="sticky top-0 z-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border bg-background/90 py-3 backdrop-blur">
          <nav className="flex flex-wrap items-center gap-5">
            {Object.entries(NEWS_TOPICS).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setTopic(key as TopicKey)}
                className={`-mb-3 border-b-2 pb-3 text-sm transition-colors ${
                  topic === key
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRange(r.key)}
                  className={`transition-colors ${
                    range === r.key
                      ? "text-foreground underline underline-offset-4"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => refetch()}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw className="size-3.5" />
              )}
              Refresh
            </Button>
          </div>
        </section>

        {error ? (
          <p className="mt-6 border-l-2 border-destructive/50 bg-muted px-4 py-3 text-sm text-muted-foreground">
            {error}
          </p>
        ) : null}

        <section className="divide-y divide-border">
          {isPending && items.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3 py-6">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))
            : items.map((item) => (
                <article key={item.url} className="group grid gap-2 py-6 sm:grid-cols-[8rem_1fr]">
                  <div className="text-xs leading-6 text-muted-foreground">
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Undated"}
                  </div>
                  <div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-serif-display text-xl leading-snug tracking-tight decoration-border underline-offset-4 group-hover:underline"
                    >
                      {item.title}
                      <ArrowUpRight className="ml-1 inline size-4 align-[-0.1em] text-muted-foreground" />
                    </a>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {item.source}
                    </p>
                  </div>
                </article>
              ))}
        </section>

        {!isPending && items.length === 0 && !error ? (
          <p className="py-10 text-sm text-muted-foreground">
            No updates found for this window — try a wider time range.
          </p>
        ) : null}
      </main>
    </div>
  );
}
