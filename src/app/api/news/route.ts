import { NextResponse } from "next/server";
import { searchNews } from "@/lib/news.server";
import { NEWS_TOPICS, type RangeKey, type TopicKey } from "@/lib/news-types";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawTopic = body?.topic as TopicKey;
    const rawRange = body?.range as RangeKey;

    const topic: TopicKey = rawTopic in NEWS_TOPICS ? rawTopic : "models";
    const range: RangeKey = ["qdr:d", "qdr:w", "qdr:m"].includes(rawRange)
      ? rawRange
      : "qdr:w";

    const result = await searchNews(topic, range);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("API /api/news error:", err);
    return NextResponse.json(
      { items: [], error: "Failed to fetch news feed" },
      { status: 500 }
    );
  }
}
