<template>
  <div class="border-b border-border bg-card/60 text-xs py-2 px-4 backdrop-blur-md overflow-hidden select-none">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <!-- Left Tag -->
      <div class="flex items-center gap-2 shrink-0">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
          <span class="size-1.5 rounded-full bg-emerald-400 radar-dot"></span>
          BREAKING
        </span>
      </div>

      <!-- Ticker Items Carousel -->
      <div class="flex-1 overflow-hidden relative h-5">
        <transition name="slide-fade" mode="out-in">
          <div :key="currentIndex" class="flex items-center gap-3 text-xs truncate">
            <span class="text-muted-foreground font-mono text-[11px] shrink-0">
              {{ currentItem.time }}
            </span>
            <a
              :href="currentItem.url"
              target="_blank"
              rel="noopener noreferrer"
              class="truncate font-medium text-foreground hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group"
            >
              {{ currentItem.title }}
              <svg class="size-3 text-muted-foreground group-hover:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <span class="px-1.5 py-0.2 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border shrink-0 hidden sm:inline">
              {{ currentItem.category }}
            </span>
          </div>
        </transition>
      </div>

      <!-- Ticker Controls -->
      <div class="flex items-center gap-1 shrink-0 text-muted-foreground">
        <button
          @click="prev"
          class="p-1 rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          title="Previous headline"
        >
          <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="font-mono text-[10px] px-1 text-muted-foreground">
          {{ currentIndex + 1 }}/{{ tickerItems.length }}
        </span>
        <button
          @click="next"
          class="p-1 rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          title="Next headline"
        >
          <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const tickerItems = [
  {
    title: 'Anthropic releases Claude 3.7 Sonnet with hybrid reasoning & Claude Code CLI',
    time: '2h ago',
    category: 'Models',
    url: 'https://anthropic.com',
  },
  {
    title: 'DeepSeek open-sources FlashMLA & DeepSeek-R1 reasoning distillation models',
    time: '5h ago',
    category: 'Open Source',
    url: 'https://github.com/deepseek-ai',
  },
  {
    title: 'Cursor v0.46 ships multi-agent background indexing and terminal self-healing',
    time: '8h ago',
    category: 'IDEs',
    url: 'https://cursor.com',
  },
  {
    title: 'Cognition announces Devin Enterprise with team orchestrator and Jira integration',
    time: '1d ago',
    category: 'Agents',
    url: 'https://cognition.ai',
  },
  {
    title: 'AI infrastructure startup raises $450M Series B for liquid-cooled clusters',
    time: '1d ago',
    category: 'Funding',
    url: 'https://news.ycombinator.com',
  },
];

const currentIndex = ref(0);
const currentItem = computed(() => tickerItems[currentIndex.value] ?? tickerItems[0]);

let timer: NodeJS.Timeout | null = null;

function next() {
  currentIndex.value = (currentIndex.value + 1) % tickerItems.length;
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + tickerItems.length) % tickerItems.length;
}

onMounted(() => {
  timer = setInterval(next, 5000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
