<template>
  <div class="space-y-8">
    <!-- Filter & Search Controls -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/50 p-4 rounded-xl border border-border">
      <!-- Topic Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        <button
          v-for="t in TOPICS"
          :key="t.key"
          @click="activeTopic = t.key"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap border',
            activeTopic === t.key
              ? 'bg-primary text-primary-foreground border-transparent font-semibold shadow-xs'
              : 'border-border bg-background text-muted-foreground hover:text-foreground'
          ]"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative min-w-60">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search papers, authors, topics..."
          class="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <svg class="size-4 absolute left-2.5 top-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Paper Cards List -->
    <div class="space-y-5">
      <article
        v-for="paper in filteredPapers"
        :key="paper.id"
        class="p-6 rounded-xl border border-border bg-card/60 hover:bg-card transition-all space-y-4 hover:border-primary/40 hover:shadow-lg group"
      >
        <!-- Top Bar: Institution, Topic, Bookmark -->
        <div class="flex items-center justify-between text-[11px] font-mono">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {{ paper.topic }}
            </span>
            <span class="text-muted-foreground">•</span>
            <span class="text-foreground font-medium">{{ paper.institution }}</span>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-muted-foreground">ArXiv: {{ paper.arxivId }}</span>
            <button
              @click="savePaper(paper)"
              class="text-muted-foreground hover:text-amber-400 transition-colors cursor-pointer p-0.5"
              :title="isItemBookmarked(paper.id) ? 'Remove Bookmark' : 'Save to Watchlist'"
            >
              <svg class="size-4" :fill="isItemBookmarked(paper.id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Title & Authors -->
        <div class="space-y-1">
          <h3 class="font-serif-display text-xl font-normal leading-snug text-foreground group-hover:text-purple-300 transition-colors">
            {{ paper.title }}
          </h3>
          <p class="text-xs text-muted-foreground font-mono">
            {{ paper.authors }} • <span class="text-foreground">{{ paper.date }}</span>
          </p>
        </div>

        <!-- 3-Bullet Executive Takeaways -->
        <div class="p-4 rounded-lg bg-background/70 border border-border space-y-2">
          <div class="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
            <span>⚡</span> Key Executive Takeaways
          </div>
          <ul class="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
            <li v-for="(takeaway, idx) in paper.summaryTakeaways" :key="idx" class="leading-relaxed">
              <span class="text-foreground">{{ takeaway }}</span>
            </li>
          </ul>
        </div>

        <!-- Action Links: ArXiv PDF & GitHub Repo -->
        <div class="flex items-center justify-between pt-1 text-xs">
          <div class="flex items-center gap-3">
            <a
              :href="paper.arxivUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
            >
              Read Preprint (PDF)
              <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <a
              v-if="paper.githubUrl"
              :href="paper.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-1.5 rounded-md border border-border bg-card hover:bg-muted text-foreground font-medium transition-colors inline-flex items-center gap-1.5"
            >
              <svg class="size-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub Code
            </a>
          </div>

          <span class="text-[11px] font-mono text-muted-foreground hidden sm:inline">
            Peer Reviewed / ArXiv Verified
          </span>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PAPERS_DATA, type ResearchPaper } from '@/data/papers-data';
import { toggleWatchlist, isItemBookmarked } from '@/lib/watchlist-store';

const TOPICS = [
  { key: 'all', label: 'All Domains' },
  { key: 'Reasoning & RL', label: '🧠 Reasoning & RL' },
  { key: 'Agent Architectures', label: '🤖 Agent Systems' },
  { key: 'Inference Optimization', label: '⚡ Inference' },
  { key: 'Safety & Alignment', label: '🛡️ Safety' },
];

const activeTopic = ref('all');
const searchQuery = ref('');

const filteredPapers = computed(() => {
  let list = PAPERS_DATA;

  if (activeTopic.value !== 'all') {
    list = list.filter((p) => p.topic === activeTopic.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.institution.toLowerCase().includes(q) ||
        p.summaryTakeaways.some((t) => t.toLowerCase().includes(q))
    );
  }

  return list;
});

function savePaper(p: ResearchPaper) {
  toggleWatchlist({
    id: p.id,
    title: p.title,
    subtitle: `${p.institution} • ${p.topic} • ArXiv ${p.arxivId}`,
    type: 'paper',
    url: p.arxivUrl,
    timestamp: p.date,
    badge: p.topic,
  });
}
</script>
