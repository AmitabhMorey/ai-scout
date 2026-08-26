import { createServerFn } from "@tanstack/react-start";
import { NEWS_TOPICS, type NewsResult, type RangeKey, type TopicKey } from "./news-types";

export {
  NEWS_TOPICS,
  type NewsItem,
  type NewsResult,
  type RangeKey,
  type TopicKey,
} from "./news-types";

type Input = { topic: TopicKey; range: RangeKey };

export const fetchAiNews = createServerFn({ method: "POST" })
  .inputValidator((input: Input): Input => {
    const topic = (input?.topic ?? "models") as TopicKey;
    const range = (input?.range ?? "qdr:w") as RangeKey;
    return {
      topic: topic in NEWS_TOPICS ? topic : "models",
      range: ["qdr:d", "qdr:w", "qdr:m"].includes(range) ? range : "qdr:w",
    };
  })
  .handler(async ({ data }): Promise<NewsResult> => {
    const { searchNews } = await import("./news.server");
    return searchNews(data.topic, data.range);
  });
