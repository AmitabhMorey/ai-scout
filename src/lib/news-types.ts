export type NewsItem = {
  title: string;
  url: string;
  description: string;
  source: string;
  publishedAt?: string | undefined;
};

export type NewsResult = {
  items: NewsItem[];
  error?: string | undefined;
  cached?: boolean | undefined;
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
export type RangeKey = "qdr:d" | "qdr:w" | "qdr:m";
