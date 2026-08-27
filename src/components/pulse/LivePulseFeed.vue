<template>
  <div class="space-y-6">
    <!-- Header Controls: Categories & Time Ranges -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
      <!-- Category Tabs -->
      <div class="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
        <button
          v-for="(t, key) in TOPICS"
          :key="key"
          @click="selectTopic(key)"
          :class="[
            'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap',
            activeTopic === key
              ? 'bg-foreground text-background font-semibold shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-card'
          ]"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- Time Windows & Refresh -->
      <div class="flex items-center gap-3 shrink-0 text-xs">
        <div class="flex items-center bg-card p-1 rounded-lg border border-border">
          <button
            v-for="r in RANGES"
            :key="r.key"
            @click="selectRange(r.key)"
            :class="[
              'px-2.5 py-1 rounded text-xs transition-colors cursor-pointer',
              activeRange === r.key
                ? 'bg-background text-foreground font-medium shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            {{ r.label }}
          </button>
        </div>

        <button
          @click="fetchNews"
          :disabled="isLoading"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
        >
          <svg :class="['size-3.5', isLoading ? 'animate-spin' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </div>

    <!-- Company Filter Pills & Search Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/40 p-3 rounded-lg border border-border">
      <div class="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span class="text-[10px] font-mono uppercase text-muted-foreground mr-1 shrink-0">Company:</span>
        <button
          v-for="company in COMPANIES"
          :key="company"
          @click="selectedCompany = company"
          :class="[
            'px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-colors cursor-pointer shrink-0 border',
            selectedCompany === company
              ? 'bg-primary text-primary-foreground border-transparent font-medium'
              : 'border-border bg-background text-muted-foreground hover:text-foreground'
          ]"
        >
          {{ company }}
        </button>
      </div>

      <!-- Quick Text Filter -->
      <div class="relative min-w-50">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter in results..."
          class="w-full pl-7 pr-3 py-1 text-xs rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <svg class="size-3.5 absolute left-2 top-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
      <svg class="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading && items.length === 0" class="space-y-4 py-4">
      <div v-for="i in 5" :key="i" class="p-5 rounded-xl border border-border bg-card/40 animate-pulse space-y-3">
        <div class="h-3 bg-muted rounded w-24"></div>
        <div class="h-5 bg-muted rounded w-3/4"></div>
        <div class="h-4 bg-muted rounded w-full"></div>
      </div>
    </div>

    <!-- News Items Stream -->
    <div v-else class="space-y-3 divide-y divide-border/40">
      <article
        v-for="(item, idx) in filteredItems"
        :key="item.url + idx"
        class="pt-5 pb-3 first:pt-0 group grid gap-3 sm:grid-cols-[7.5rem_1fr] items-start"
      >
        <!-- Published Time & Source -->
        <div class="text-[11px] font-mono text-muted-foreground space-y-1">
          <div>{{ item.publishedAt || 'Recent' }}</div>
          <div class="inline-block px-1.5 py-0.5 rounded bg-card border border-border text-[10px] uppercase truncate max-w-26">
            {{ item.source }}
          </div>
        </div>

        <!-- Content & Actions -->
        <div class="space-y-2">
          <div class="flex items-start justify-between gap-4">
            <a
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="font-serif-display text-lg font-normal leading-snug tracking-tight text-foreground group-hover:text-amber-300 transition-colors inline-flex items-center gap-1.5"
            >
              {{ item.title }}
              <svg class="size-3.5 text-muted-foreground group-hover:text-amber-300 inline shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <!-- Action buttons: Bookmark / Copy Link -->
            <div class="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                @click="saveItem(item)"
                class="p-1.5 rounded-md hover:bg-card text-muted-foreground hover:text-amber-400 transition-colors cursor-pointer"
                :title="isItemBookmarked(item.url) ? 'Remove Bookmark' : 'Bookmark to Watchlist'"
              >
                <svg class="size-4" :fill="isItemBookmarked(item.url) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>

              <button
                @click="copyUrl(item.url)"
                class="p-1.5 rounded-md hover:bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Copy link"
              >
                <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          <p class="text-xs leading-relaxed text-muted-foreground line-clamp-3">
            {{ item.description }}
          </p>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && filteredItems.length === 0 && !error" class="text-center py-16 text-muted-foreground space-y-2">
      <p class="text-sm">No intelligence items found matching this filter.</p>
      <p class="text-xs">Try selecting "All" companies or switching the time range to "Month".</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { toggleWatchlist, isItemBookmarked } from '@/lib/watchlist-store';

interface NewsItem {
  title: string;
  url: string;
  description: string;
  source: string;
  publishedAt?: string;
}

const TOPICS = {
  models: { label: 'AI Models' },
  ides: { label: 'Agentic IDEs' },
  agents: { label: 'AI Agents' },
  funding: { label: 'Launches & Funding' },
} as const;

const RANGES = [
  { key: 'qdr:d', label: '24 hours' },
  { key: 'qdr:w', label: 'Week' },
  { key: 'qdr:m', label: 'Month' },
] as const;

const COMPANIES = ['All', 'Anthropic', 'OpenAI', 'DeepSeek', 'Google', 'Meta', 'Mistral', 'xAI'];

const activeTopic = ref<keyof typeof TOPICS>('models');
const activeRange = ref<string>('qdr:w');
const selectedCompany = ref<string>('All');
const searchQuery = ref<string>('');
const items = ref<NewsItem[]>([]);
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);

const filteredItems = computed(() => {
  let result = items.value;

  // Filter by company
  if (selectedCompany.value !== 'All') {
    const comp = selectedCompany.value.toLowerCase();
    result = result.filter(
      (i) =>
        i.title.toLowerCase().includes(comp) ||
        i.description.toLowerCase().includes(comp) ||
        i.source.toLowerCase().includes(comp)
    );
  }

  // Filter by custom search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
    );
  }

  return result;
});

async function fetchNews() {
  isLoading.value = true;
  error.value = null;

  try {
    const res = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: activeTopic.value,
        range: activeRange.value,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned error ${res.status}`);
    }

    const data = await res.json();
    items.value = data.items || [];
    if (data.error) {
      error.value = data.error;
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load news';
  } finally {
    isLoading.value = false;
  }
}

function selectTopic(t: keyof typeof TOPICS) {
  activeTopic.value = t;
  fetchNews();
}

function selectRange(r: string) {
  activeRange.value = r;
  fetchNews();
}

function saveItem(item: NewsItem) {
  toggleWatchlist({
    id: item.url,
    title: item.title,
    subtitle: item.description,
    url: item.url,
    type: 'news',
    timestamp: item.publishedAt,
    badge: item.source,
  });
}

function copyUrl(url: string) {
  if (typeof navigator !== 'undefined') {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }
}

onMounted(() => {
  fetchNews();
});
</script>
