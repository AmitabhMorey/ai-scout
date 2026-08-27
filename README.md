# AI Pulse ⚡ (AI Scout)

> Real-time intelligence and release briefing on frontier AI models, agentic IDEs, autonomous AI agents, and startup funding launches.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firecrawl API](https://img.shields.io/badge/Search_Engine-Firecrawl_v2-FF4500?style=flat-square)](https://firecrawl.dev/)

---

## 📖 Overview

**AI Pulse** is a fast, source-linked editorial briefing platform built for developers, founders, and AI researchers. It continuously scans and synthesizes what's shipping across the AI landscape—combining deep web searches and live news feeds into a clean, minimalist reading experience.

---

## ✨ Features

- 🛰️ **Live Multi-Source Search**: Queries both real-time news sources and verified web releases via the [Firecrawl API](https://firecrawl.dev).
- ⏱️ **Relative & Absolute Timestamps**: Parses real-time timestamps (`9 hours ago`, `1 day ago`, `Aug 25, 2026`) so you always know when updates happen.
- 🎯 **Domain-Specific Briefings**:
  - **AI Models**: Frontier LLMs, multimodal models, open-weight releases, and benchmarks.
  - **Agentic IDEs**: Coding agent updates across Cursor, Windsurf, Devin, Copilot, Cline, Antigravity, and Zed.
  - **AI Agents**: Autonomous agent frameworks, orchestration engines, and tool-use breakthroughs.
  - **Launches & Funding**: Startup launches, funding rounds, and developer tool announcements.
- 📅 **Flexible Time Windows**: Switch between **24 hours**, **Past Week**, and **Past Month** on demand.
- ⚡ **High Performance Caching**: In-memory 5-minute TTL caching and serialized queuing to protect API rate limits and deliver instantaneous tab switches.
- 🎨 **Editorial Dark Theme**: Crafted with Tailwind CSS v4, custom `oklch` color tokens, typography from Google Fonts (*Newsreader* serif & *IBM Plex Sans*), and responsive layouts.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss` |
| **State & Data Fetching** | [TanStack React Query v5](https://tanstack.com/query) |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/) |
| **Data Provider** | [Firecrawl API v2](https://firecrawl.dev) (`/v2/search`) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |

---

## 📁 Project Structure

```text
ai-scout/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/
│   │   │   └── news/
│   │   │       └── route.ts      # POST /api/news (Firecrawl handler & cache)
│   │   ├── error.tsx             # Error boundary
│   │   ├── globals.css           # Tailwind v4 theme & oklch tokens
│   │   ├── layout.tsx            # Root layout with Google Fonts & metadata
│   │   ├── not-found.tsx         # 404 page
│   │   ├── page.tsx              # Main AI Pulse dashboard
│   │   └── providers.tsx         # React Query Client provider
│   ├── components/
│   │   └── ui/                   # Reusable UI component library (Radix primitives)
│   ├── hooks/
│   │   └── use-mobile.tsx        # Responsive viewport detection hook
│   └── lib/
│       ├── lovable-error-reporting.ts # Telemetry error capture
│       ├── news-cache.server.ts  # In-memory TTL cache & stale-while-revalidate
│       ├── news-types.ts         # TypeScript definitions & topic queries
│       ├── news.server.ts        # Firecrawl query executor & date parser
│       └── utils.ts              # Classname merge utility (clsx + tailwind-merge)
├── public/                       # Static assets (favicons, images)
├── .env.example                  # Environment variables template
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.mjs            # PostCSS plugin config for Tailwind v4
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) version **18.18+** (Node 20+ or 24+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A **Firecrawl API Key** from [firecrawl.dev](https://firecrawl.dev)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ai-scout.git
   cd ai-scout
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and insert your Firecrawl API key:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your key:
   ```env
   FIRECRAWL_API_KEY=fc-your_actual_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server |
| `npm run build` | Compiles the production build (Static & Server Routes) |
| `npm run start` | Launches the compiled Next.js production server |
| `npm run lint` | Runs ESLint checks across the codebase |

---

## 📡 API Reference

### `POST /api/news`

Fetches search results and news items for a given topic and time window.

#### Request Body
```json
{
  "topic": "models", // "models" | "ides" | "agents" | "funding"
  "range": "qdr:w"   // "qdr:d" (24h) | "qdr:w" (Week) | "qdr:m" (Month)
}
```

#### Response Payload
```json
{
  "items": [
    {
      "title": "Jalapeño’s first results show industry-leading speed...",
      "url": "https://openai.com/index/jalapeno-first-results/",
      "description": "Analysis and inference benchmarks for new architectures...",
      "source": "openai.com",
      "publishedAt": "1 day ago"
    }
  ],
  "cached": false
}
```

---

## 🔒 Security & Best Practices

- `.env` and API credentials are kept strictly out of git version control via `.gitignore`.
- Production builds run in strict TypeScript mode with 0 compilation errors.
- Server-side rate-limit queuing prevents API exhaustion during rapid client filtering.

