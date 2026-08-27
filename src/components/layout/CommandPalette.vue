<template>
  <div
    v-if="appStore.isCommandPaletteOpen"
    class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    @click.self="closeCommandPalette"
  >
    <div
      class="w-full max-w-2xl rounded-xl bg-card border border-border shadow-2xl overflow-hidden text-foreground"
      @keydown.esc="closeCommandPalette"
    >
      <!-- Search Input Header -->
      <div class="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-background/60">
        <svg class="size-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref="searchInputRef"
          v-model="query"
          type="text"
          placeholder="Search models, coding agents, funding rounds, research papers, or pages..."
          class="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          @keydown.down.prevent="navigateResults(1)"
          @keydown.up.prevent="navigateResults(-1)"
          @keydown.enter.prevent="selectActiveResult"
        />
        <kbd class="px-2 py-0.5 rounded bg-card border border-border text-[10px] font-mono text-muted-foreground">
          ESC
        </kbd>
      </div>

      <!-- Results List -->
      <div class="max-h-96 overflow-y-auto p-2 divide-y divide-border/40 text-xs">
        <!-- Section 1: Quick Page Navigation -->
        <div class="py-1">
          <div class="px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Navigation
          </div>
          <div
            v-for="(page, idx) in filteredPages"
            :key="page.url"
            @click="goToPage(page.url)"
            @mouseenter="activeIndex = idx"
            :class="[
              'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors',
              activeIndex === idx ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
            ]"
          >
            <div class="flex items-center gap-2">
              <span class="text-base">{{ page.icon }}</span>
              <span class="font-medium">{{ page.title }}</span>
            </div>
            <span class="font-mono text-[10px] opacity-70">{{ page.url }}</span>
          </div>
        </div>

        <!-- Section 2: Entities (Models, Agents, Startups, Papers) -->
        <div v-if="filteredEntities.length > 0" class="py-1">
          <div class="px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            AI Entities & Radars
          </div>
          <div
            v-for="(entity, idx) in filteredEntities"
            :key="entity.id"
            @click="goToPage(entity.url)"
            @mouseenter="activeIndex = filteredPages.length + idx"
            :class="[
              'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors',
              activeIndex === filteredPages.length + idx ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
            ]"
          >
            <div class="flex items-center gap-2.5 truncate">
              <span class="px-1.5 py-0.5 rounded text-[10px] font-mono border" :class="getTypeBadgeClass(entity.type)">
                {{ entity.type.toUpperCase() }}
              </span>
              <span class="font-medium truncate">{{ entity.title }}</span>
              <span class="text-muted-foreground text-[11px] truncate hidden sm:inline">{{ entity.subtitle }}</span>
            </div>
            <svg class="size-3.5 opacity-60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredPages.length === 0 && filteredEntities.length === 0" class="p-8 text-center text-muted-foreground">
          <p>No results found for "{{ query }}"</p>
          <p class="mt-1 text-[11px]">Try searching for "Claude", "Cursor", "DeepSeek", "Reasoning", or "Funding".</p>
        </div>
      </div>

      <!-- Footer Guide -->
      <div class="flex items-center justify-between px-4 py-2 bg-background/60 border-t border-border text-[11px] text-muted-foreground font-mono">
        <div class="flex items-center gap-3">
          <span>↑↓ to navigate</span>
          <span>↵ to select</span>
        </div>
        <span>AI Scout Global Intelligence</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { appStore, closeCommandPalette } from '@/lib/watchlist-store';

const query = ref('');
const activeIndex = ref(0);
const searchInputRef = ref<HTMLInputElement | null>(null);

const PAGES = [
  { title: 'Overview Dashboard', url: '/', icon: '🏛️' },
  { title: 'Live Pulse Stream', url: '/pulse', icon: '⚡' },
  { title: 'Frontier Models Radar', url: '/models', icon: '🧭' },
  { title: 'Agentic IDEs & CLI Directory', url: '/agents', icon: '🛠️' },
  { title: 'Startups & Funding Radar', url: '/funding', icon: '📊' },
  { title: 'ArXiv Breakthrough Research', url: '/papers', icon: '🔬' },
];

const ENTITIES = [
  { id: 'm1', title: 'Claude 3.7 Sonnet', subtitle: 'Anthropic • 70.3% SWE-bench • Hybrid Reasoning', type: 'model', url: '/models' },
  { id: 'm2', title: 'DeepSeek-R1', subtitle: 'DeepSeek • Open Weights • GRPO Reasoning', type: 'model', url: '/models' },
  { id: 'm3', title: 'GPT-4.5 Orion', subtitle: 'OpenAI • 2M Context • Multimodal', type: 'model', url: '/models' },
  { id: 'm4', title: 'Gemini 2.0 Flash', subtitle: 'Google DeepMind • High Speed Real-Time Audio/Vision', type: 'model', url: '/models' },
  { id: 'a1', title: 'Cursor', subtitle: 'Anysphere • Multi-file diffs & Agentic Indexing', type: 'agent', url: '/agents' },
  { id: 'a2', title: 'Windsurf', subtitle: 'Codeium • Cascade Flows & Context Awareness', type: 'agent', url: '/agents' },
  { id: 'a3', title: 'Claude Code', subtitle: 'Anthropic • Autonomous Terminal CLI Coding Agent', type: 'agent', url: '/agents' },
  { id: 'a4', title: 'Devin', subtitle: 'Cognition • Autonomous Software Engineer', type: 'agent', url: '/agents' },
  { id: 'f1', title: 'Cognition Series B', subtitle: '$175M at $2B valuation • Founders Fund', type: 'funding', url: '/funding' },
  { id: 'f2', title: 'Magic.dev Supercomputer', subtitle: '$320M Series C • Eric Schmidt, Sequoia', type: 'funding', url: '/funding' },
  { id: 'p1', title: 'DeepSeek-R1: Incentivizing Reasoning via RL', subtitle: 'ArXiv 2501.12948 • DeepSeek AI', type: 'paper', url: '/papers' },
  { id: 'p2', title: 'SWE-bench: Can Language Models Resolve GitHub Issues?', subtitle: 'ArXiv 2310.06770 • Princeton NLP', type: 'paper', url: '/papers' },
];

const filteredPages = computed(() => {
  if (!query.value.trim()) return PAGES;
  const q = query.value.toLowerCase();
  return PAGES.filter((p) => p.title.toLowerCase().includes(q) || p.url.toLowerCase().includes(q));
});

const filteredEntities = computed(() => {
  if (!query.value.trim()) return ENTITIES.slice(0, 6);
  const q = query.value.toLowerCase();
  return ENTITIES.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.subtitle.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q)
  );
});

function getTypeBadgeClass(type: string) {
  switch (type) {
    case 'model': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'agent': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'funding': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'paper': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  }
}

function totalResultCount() {
  return filteredPages.value.length + filteredEntities.value.length;
}

function navigateResults(direction: number) {
  const count = totalResultCount();
  if (count === 0) return;
  activeIndex.value = (activeIndex.value + direction + count) % count;
}

function selectActiveResult() {
  if (activeIndex.value < filteredPages.value.length) {
    const p = filteredPages.value[activeIndex.value];
    if (p) goToPage(p.url);
  } else {
    const e = filteredEntities.value[activeIndex.value - filteredPages.value.length];
    if (e) goToPage(e.url);
  }
}

function goToPage(url: string) {
  closeCommandPalette();
  if (typeof window !== 'undefined') {
    window.location.href = url;
  }
}

watch(() => appStore.isCommandPaletteOpen, (open) => {
  if (open) {
    query.value = '';
    activeIndex.value = 0;
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
});

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (appStore.isCommandPaletteOpen) {
      closeCommandPalette();
    } else {
      appStore.isCommandPaletteOpen = true;
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});
</script>
