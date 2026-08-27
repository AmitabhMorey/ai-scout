# AI Scout — Architecture, Design System & Content Strategy (Astro + Vue 3 Edition)

This document outlines the complete architectural, strategic, and visual design blueprint for **AI Scout** built with **Astro 5+ & Vue 3 Islands**.

---

## 1. Executive Summary & Platform Identity

* **Name**: AI Scout
* **Tagline**: *Continuous Intelligence on Frontier AI Models, Agentic IDEs & Venture Capital.*
* **Core Philosophy**: A high-performance, editorial intelligence platform for developers, AI researchers, founders, and investors, combining zero-JS static publishing with reactive Vue 3 islands.

---

## 2. Design System & Aesthetics

### 2.1 Aesthetic Principles
1. **Editorial Precision**: High typographic contrast using *Newsreader* (editorial serif for headlines, titles, and callouts) paired with *IBM Plex Sans* (utilitarian sans for dense tabular data and telemetry badges).
2. **Dark OKLCH Atmosphere**: Monochromatic dark theme with subtle depth layers, low-opacity borders (`oklch(... / 14%)`), and purposeful accent colors (Radar Green for live telemetry, Amber for benchmark highlights).
3. **Islands Architecture**: Ultra-fast initial page loads (zero client-side JS on static content), hydrating only interactive widgets (search, live feed, comparators, charts).

### 2.2 Color Tokens & Variables
```css
/* Core Palette */
--background: oklch(0.17 0.006 265);      /* Deep Slate Base */
--card: oklch(0.20 0.007 265);            /* Elevated Surface */
--border: oklch(0.93 0.005 95 / 14%);     /* Subtle dividing lines */
--foreground: oklch(0.93 0.005 95);       /* Primary Text */
--muted-foreground: oklch(0.66 0.008 265);/* Secondary Text */
--accent-pulse: oklch(0.72 0.16 142);     /* Live Green */
--accent-gold: oklch(0.75 0.12 75);       /* Benchmark Gold */
```

---

## 3. Global Navigation, Header & Footer Blueprint

### 3.1 Header Structure (`Header.astro`)
```
+----------------------------------------------------------------------------------------------------+
| [● LIVE] AI SCOUT  |  Overview   Pulse   Models   Agents & IDEs   Funding   Research  | [🔍 ⌘K] [★ 3] [Submit] |
+----------------------------------------------------------------------------------------------------+
```
* **Brand Cluster**: Logo in Newsreader Serif + Monospace edition badge (`v2.0 // INTEL`) + Pulsing live radar dot.
* **Navigation Links**:
  * **Overview** (`/`): Executive dashboard, highlights, trending releases, top benchmarks.
  * **Pulse** (`/pulse`): Live Firecrawl-powered web news stream with company filters.
  * **Models** (`/models`): Frontier & Open-Weight LLM radar, specs, pricing, and comparison.
  * **Agents & IDEs** (`/agents`): Coding agent directory, scorecards, and feature matrix.
  * **Funding** (`/funding`): AI venture capital radar, sector breakdown charts, recent rounds.
  * **Research** (`/papers`): ArXiv breakthrough preprints, 3-bullet takeaways, code links.
* **Utility Cluster (Vue Islands)**:
  * `<CommandPalette client:idle />`: Global ⌘K spotlight search modal across all records.
  * `<WatchlistDrawer client:idle />`: Slide-over drawer for locally saved bookmarks.
  * `<SubmitModal client:idle />`: Dialog to submit an AI model, tool launch, or funding event.

### 3.2 Breaking News Ticker (`BreakingTicker.vue`)
* Placed directly below the main header.
* Animated marquee cycling through the top 3 verified live announcements (e.g. *"Anthropic releases Claude 3.7 Sonnet • DeepSeek releases FlashMLA • Cursor hits v0.46"*).

### 3.3 Multi-Column Editorial Footer (`Footer.astro`)
```
+----------------------------------------------------------------------------------------------------+
|                                    AI SCOUT INTELLIGENCE                                           |
| Continuous intelligence on frontier AI models, agentic workflows, autonomous IDEs, and capital.    |
+----------------------------------------------------------------------------------------------------+
| RADARS & FEEDS         TOOLS & COMPARATORS      ECOSYSTEM & DATA       WEEKLY BRIEFING             |
| • Live News Pulse      • Model Comparator       • Firecrawl v2 API     +-------------------------+ |
| • Frontier Models      • Agent Feature Matrix   • ArXiv Research API   | Enter your email...     | |
| • Coding Agents        • Pricing Calculator     • Open Benchmarks      +-------------------------+ |
| • Startup Rounds       • RSS XML Feeds          • Submit AI Launch     [ Join 12,000+ Builders ]   |
| • ArXiv Papers         • API Feeds              • GitHub Source                                    |
+----------------------------------------------------------------------------------------------------+
| © 2026 AI Scout Platform • Verified Benchmarks & Real-time Feeds • [● All Systems Online]          |
+----------------------------------------------------------------------------------------------------+
```

---

## 4. Page Content & Data Specifications

### 4.1 Home Dashboard (`src/pages/index.astro`)
* **Hero Overview**: Executive summary of the AI ecosystem state today.
* **4 Metric Highlights**:
  * *Top Model Benchmark Score* (e.g., Claude 3.7 Sonnet — 70.3% SWE-bench).
  * *Trending Coding Agent* (e.g., Cursor / Windsurf / Claude Code).
  * *Past 30d Venture Volume* (e.g., $1.85B across 42 rounds).
  * *Breakthrough Paper* (e.g., GRPO Reasoning architectures).
* **Trending Launches Carousel**: Horizontal slider featuring latest releases.
* **Dual-Column Feed**:
  * Left: Live breaking intelligence cards.
  * Right: Model leaderboard mini-table, venture funding breakdown mini-chart, and quick shortcuts.

### 4.2 Live Pulse Stream (`src/pages/pulse.astro`)
* **Vue Island (`<LivePulseFeed client:load />`)**:
  * Company Tag Pills: `All`, `OpenAI`, `Anthropic`, `Google`, `DeepSeek`, `Meta`, `Mistral`, `xAI`.
  * Category Tabs: `All`, `AI Models`, `Agentic IDEs`, `AI Agents`, `Launches & Funding`.
  * Time Windows: `Past 24 Hours`, `Past Week`, `Past Month`.
  * Outbound links, source attribution, copy link, and bookmark triggers.

### 4.3 Models Radar & Comparator (`src/pages/models.astro`)
* **Content Collection Schema (`src/content/models/`)**:
  * `name`, `creator`, `releaseDate`, `license`, `contextWindow`, `inputPrice`, `outputPrice`, `benchmarks` (`sweBench`, `mmluPro`, `math500`), `modalities`, `description`.
* **Vue Island (`<ModelGrid client:load />` & `<ModelComparator client:idle />`)**:
  * Live filter pills (Reasoning, Coding, Multimodal, Open-Weights).
  * Multi-select comparison drawer comparing 2 or 3 models side-by-side.

### 4.4 Agentic IDEs & Coding Agents (`src/pages/agents.astro`)
* **Content Collection Schema (`src/content/agents/`)**:
  * `name`, `creator`, `type` (`IDE` | `CLI Agent` | `Extension`), `multiFileEditing`, `terminalExecution`, `mcpSupport`, `localModelSupport`, `pricing`, `website`, `github`.
* **Static Matrix (`AgentMatrix.astro`)**: High-density capability table comparing tools.

### 4.5 Startups & Funding Radar (`src/pages/funding.astro`)
* **Content Collection Schema (`src/content/funding/`)**:
  * `company`, `stage`, `amount`, `leadInvestors`, `sector`, `valuation`, `description`, `date`, `sourceUrl`.
* **Vue Island (`<FundingCharts client:visible />`)**: Interactive SVG/Canvas charts for monthly volume and sector allocation.

### 4.6 Research & Paper Radar (`src/pages/papers.astro`)
* **Content Collection Schema (`src/content/papers/`)**:
  * `title`, `authors`, `institution`, `topic`, `summaryTakeaways` (`string[3]`), `arxivUrl`, `githubUrl`, `date`.
* **Static Paper Cards (`PaperCard.astro`)**: Clean cards with 3-bullet takeaways, PDF links, and GitHub code links.

---

## 5. Technical Stack & Dependencies

* **Core Framework**: Astro v7+ (Islands Architecture, Server Endpoints)
* **Interactive UI**: Vue 3 (Composition API, `<script setup>`)
* **Icons**: `lucide-vue-next`
* **Styling**: Tailwind CSS v4 + custom OKLCH tokens
* **Data Layer**: Astro Content Collections (`zod` validated) + Firecrawl v2 Search API
