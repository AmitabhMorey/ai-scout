<template>
  <div
    v-if="appStore.isWatchlistOpen"
    class="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-fade-in"
    @click.self="closeWatchlist"
  >
    <div
      class="w-full max-w-md h-full bg-card border-l border-border shadow-2xl flex flex-col text-foreground"
      @keydown.esc="closeWatchlist"
    >
      <!-- Drawer Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-border bg-background/70">
        <div class="flex items-center gap-2">
          <svg class="size-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          <h3 class="font-serif-display text-lg font-medium">Saved Watchlist</h3>
          <span class="px-2 py-0.5 rounded-full bg-muted text-[10px] font-mono text-muted-foreground">
            {{ appStore.watchlist.length }}
          </span>
        </div>
        <button
          @click="closeWatchlist"
          class="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Drawer Content List -->
      <div class="flex-1 overflow-y-auto p-4 divide-y divide-border/40 text-xs">
        <div v-if="appStore.watchlist.length === 0" class="h-64 flex flex-col items-center justify-center text-center text-muted-foreground p-6">
          <svg class="size-10 text-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p class="font-medium text-sm text-foreground">Your Watchlist is empty</p>
          <p class="text-xs mt-1 max-w-xs">Click the bookmark icon on any model card, research paper, coding agent, or news item to pin it here.</p>
        </div>

        <div
          v-for="item in appStore.watchlist"
          :key="item.id"
          class="py-3 flex items-start justify-between gap-3 group"
        >
          <div class="space-y-1 flex-1">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-semibold border" :class="getTypeBadgeClass(item.type)">
                {{ item.type }}
              </span>
              <span v-if="item.timestamp" class="text-[10px] font-mono text-muted-foreground">
                {{ item.timestamp }}
              </span>
            </div>
            <a
              v-if="item.url"
              :href="item.url"
              target="_blank"
              class="font-medium text-foreground hover:text-amber-300 transition-colors inline-block leading-snug"
            >
              {{ item.title }}
            </a>
            <span v-else class="font-medium text-foreground leading-snug">
              {{ item.title }}
            </span>
            <p v-if="item.subtitle" class="text-[11px] text-muted-foreground line-clamp-1">
              {{ item.subtitle }}
            </p>
          </div>

          <button
            @click="removeWatchlistItem(item.id)"
            class="p-1.5 rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
            title="Remove from watchlist"
          >
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Drawer Footer -->
      <div class="p-4 border-t border-border bg-background/60 flex items-center justify-between text-xs">
        <span class="text-[11px] font-mono text-muted-foreground">Saved locally in browser</span>
        <button
          v-if="appStore.watchlist.length > 0"
          @click="clearAll"
          class="text-[11px] font-mono text-red-400 hover:underline cursor-pointer"
        >
          Clear All
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { appStore, closeWatchlist, removeWatchlistItem } from '@/lib/watchlist-store';

function getTypeBadgeClass(type: string) {
  switch (type) {
    case 'model': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'agent': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'funding': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'paper': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  }
}

function clearAll() {
  if (confirm('Clear all saved items in your watchlist?')) {
    appStore.watchlist = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ai_scout_watchlist_v1');
    }
  }
}
</script>
