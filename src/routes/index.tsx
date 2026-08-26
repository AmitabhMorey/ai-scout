import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, Loader2, RefreshCw, Sparkles } from "lucide-react";

import { Aurora } from "@/components/reactbits/Aurora";
import { GradientText } from "@/components/reactbits/GradientText";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchAiNews, NEWS_TOPICS, type RangeKey, type TopicKey } from "@/lib/news.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Pulse — New AI Models & Agentic IDE Releases" },
      {
        name: "description",
        content:
          "Live radar for new AI model launches, agentic IDEs and coding agents — with dates, sources and links, refreshed on demand.",
      },
      { property: "og:title", content: "AI Pulse — New AI Models & Agentic IDE Releases" },
      {
        property: "og:description",
        content:
          "Track what's shipping in AI: new models, agentic IDEs, coding agents and launches, all in one live feed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const RANGES = [
  { key: "qdr:d", label: "24h" },
  { key: "qdr:w", label: "This week" },
  { key: "qdr:m", label: "This month" },
] as const;

function Index() {
  const [topic, setTopic] = useState<TopicKey>("models");
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("qdr:w");
  const [items, setItems] = useState<NewsItem[]>([]);

  const run = useServerFn(fetchAiNews);
  const { mutate, isPending, error } = useMutation({
    mutationFn: (vars: { topic: TopicKey; range: typeof range }) => run({ data: vars }),
    onSuccess: setItems,
  });

  useEffect(() => {
    mutate({ topic, range });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, range]);

  return (
    <>
      <Aurora />
      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-16 sm:pt-24">
        <header className="fade-up max-w-3xl">
          <Badge
            variant="outline"
            className="mb-6 gap-2 rounded-full border-primary/40 bg-primary/10 px-3 py-1 text-primary"
          >
            <Sparkles className="size-3.5" /> Live web radar
          </Badge>
          <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            What&apos;s shipping in <GradientText>AI &amp; agentic IDEs</GradientText>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            A continuously refreshed feed of new model releases, coding agents and IDE launches —
            pulled straight from the live web, with sources and dates.
          </p>
        </header>

        <section className="mt-10 flex flex-wrap items-center gap-3">
          <Tabs value={topic} onValueChange={(v) => setTopic(v as TopicKey)}>
            <TabsList className="h-auto flex-wrap gap-1 rounded-full border border-border bg-card/60 p-1 backdrop-blur">
              {Object.entries(NEWS_TOPICS).map(([key, t]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="rounded-full px-4 py-1.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1 backdrop-blur">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  range === r.key
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            className="ml-auto gap-2 rounded-full border-border bg-card/60 backdrop-blur"
            onClick={() => mutate({ topic, range })}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Refresh
          </Button>
        </section>

        {error ? (
          <p className="mt-10 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
            Couldn&apos;t load updates: {(error as Error).message}
          </p>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isPending && items.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-2xl bg-card/60" />
              ))
            : items.map((item, i) => (
                <SpotlightCard
                  key={item.url}
                  className="fade-up flex h-full flex-col p-5"
                >
                  <div style={{ animationDelay: `${i * 40}ms` }} className="flex h-full flex-col">
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span className="truncate font-medium text-primary">{item.source}</span>
                      {item.publishedAt ? (
                        <span className="shrink-0">
                          {new Date(item.publishedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-3 line-clamp-3 text-lg font-semibold leading-snug">
                      {item.title}
                    </h2>
                    <p className="mt-2 line-clamp-4 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-foreground transition-colors hover:text-primary"
                    >
                      Read update <ArrowUpRight className="size-4" />
                    </a>
                  </div>
                </SpotlightCard>
              ))}
        </section>

        {!isPending && items.length === 0 && !error ? (
          <p className="mt-10 text-sm text-muted-foreground">
            No updates found for this window — try a wider time range.
          </p>
        ) : null}
      </main>
    </>
  );
}
