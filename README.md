# AI Scout ⚡

> Multi-page frontier AI intelligence and release briefing platform tracking new foundation models, agentic IDEs, autonomous coding agents, venture capital, and breakthrough research.

[![Astro](https://img.shields.io/badge/Astro-v7-BC52EE?style=flat-square&logo=astro)](https://astro.build/)
[![Vue.js](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firecrawl API](https://img.shields.io/badge/Search_Engine-Firecrawl_v2-FF4500?style=flat-square)](https://firecrawl.dev/)

---

## 📖 Overview

**AI Scout** is a high-performance, editorial intelligence platform built with the **Astro Islands Architecture + Vue 3**. It combines curated foundation model datasets, coding agent scorecards, venture capital charts, and ArXiv research takeaways with live web search via the [Firecrawl API](https://firecrawl.dev).

---

## ✨ Radars & Features

- 🏛️ **Executive Dashboard (`/`)**: Hero highlight metrics (Top SWE-bench, Trending Agent, Mega Deal, Top ArXiv), dual-column live release stream + leaderboards.
- ⚡ **Live Release Pulse (`/pulse`)**: Real-time multi-source search querying web releases with company filters (Anthropic, OpenAI, DeepSeek, Google, Meta, Mistral, xAI).
- 🧭 **Frontier Models Radar (`/models`)**: Foundation model directory with context limits, token pricing, SWE-bench %, and a **Side-by-Side Model Comparison Drawer**.
- 🛠️ **Agentic IDEs & CLI Directory (`/agents`)**: Feature scorecard matrix comparing multi-file diffs, terminal autonomy, MCP support, local Ollama models, and pricing.
- 📊 **Startups & Venture Radar (`/funding`)**: Interactive monthly venture volume charts, sector allocation distribution, and verified funding rounds table.
- 🔬 **ArXiv Breakthrough Research (`/papers`)**: Curated preprints distilled into **3-bullet executive takeaways**, PDF links, and GitHub code repos.
- 🔍 **Global `⌘K` Command Palette**: Instant spotlight search across models, tools, papers, startups, and pages.
- ⭐ **Persistent Watchlist**: Slide-over bookmarks drawer synchronized with browser `localStorage`.
- 🎨 **Editorial Dark Theme**: Crafted with Tailwind CSS v4, custom `oklch` color tokens, Google Fonts (*Newsreader* serif & *IBM Plex Sans*), and animated telemetry radar indicators.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Astro v7](https://astro.build/) (Islands Architecture, Server Endpoints) |
| **UI Components** | [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite` |
| **Icons** | [Lucide Vue Next](https://lucide.dev/) |
| **Data Provider** | [Firecrawl API v2](https://firecrawl.dev) (`/v2/search`) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |

---

## 📁 Project Structure

```text
ai-scout/
├── astro.config.mjs          # Astro config with Vue integration & Tailwind v4
├── src/
│   ├── layouts/
│   │   └── RootLayout.astro  # Base HTML shell with Google Fonts & global islands
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro            # Navigation bar with live telemetry pulse
│   │   │   ├── BreakingTicker.vue      # Animated breaking news marquee (Vue Island)
│   │   │   ├── Footer.astro            # 4-column editorial footer with newsletter
│   │   │   ├── CommandPalette.vue      # Global ⌘K spotlight search (Vue Island)
│   │   │   ├── WatchlistDrawer.vue     # Slide-over saved bookmarks (Vue Island)
│   │   │   └── SubmitModal.vue         # Community launch submission (Vue Island)
│   │   ├── models/
│   │   │   └── ModelGrid.vue           # Filterable models & comparison modal (Vue Island)
│   │   ├── agents/
│   │   │   └── AgentGrid.vue           # Coding agents directory & scorecard table (Vue Island)
│   │   ├── funding/
│   │   │   └── FundingCharts.vue       # Venture charts & deals table (Vue Island)
│   │   ├── papers/
│   │   │   └── PaperList.vue           # ArXiv papers & 3-bullet takeaways (Vue Island)
│   │   └── pulse/
│   │       └── LivePulseFeed.vue       # Real-time Firecrawl search & company filters (Vue Island)
│   ├── pages/
│   │   ├── index.astro       # Executive Overview Dashboard
│   │   ├── pulse.astro       # Live News & Release Briefing Stream
│   │   ├── models.astro      # Model Radar & Leaderboards
│   │   ├── agents.astro      # Agentic IDEs & CLI Directory + Feature Matrix
│   │   ├── funding.astro     # Startups & Venture Funding Radar
│   │   ├── papers.astro      # ArXiv Breakthrough Research Digest
│   │   └── api/
│   │       └── news.ts       # POST /api/news (Firecrawl handler & in-memory cache)
│   ├── data/
│   │   ├── models-data.ts    # Curated foundation & open-weight model data
│   │   ├── agents-data.ts    # Curated IDEs & CLI agents data
│   │   ├── funding-data.ts   # Curated venture rounds & sector trends
│   │   └── papers-data.ts    # Curated research preprints & takeaways
│   ├── styles/
│   │   └── globals.css       # Tailwind v4 theme & oklch tokens
│   └── lib/
│       ├── news-cache.server.ts # In-memory TTL cache & rate-limit serializer
│       ├── news-types.ts        # TypeScript definitions
│       ├── news.server.ts       # Firecrawl search query executor
│       └── watchlist-store.ts   # Vue reactive store with localStorage persistence
├── package.json              # Clean Astro + Vue dependencies
└── tsconfig.json             # Astro TypeScript configuration
```

---

## 🚀 Getting Started

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ai-scout.git
cd ai-scout

# 2. Install dependencies
npm install

# 3. Configure Environment Variables
cp .env.example .env
# Set FIRECRAWL_API_KEY=fc-your_actual_api_key_here

# 4. Start the development server
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

---

## ⚙️ Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Astro development server on port 4321 |
| `npm run build` | Compiles the production build with server endpoints |
| `npm run preview` | Previews the compiled production build locally |
