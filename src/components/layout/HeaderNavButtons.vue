<template>
  <div class="flex items-center gap-2.5">
    <!-- Search Button / ⌘K Trigger -->
    <button
      @click="openCommandPalette"
      class="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card hover:bg-muted text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-xs"
      aria-label="Search"
    >
      <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span class="hidden sm:inline">Search</span>
      <kbd class="hidden sm:inline-block px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono text-muted-foreground">⌘K</kbd>
    </button>

    <!-- Watchlist Trigger with dynamic badge -->
    <button
      @click="openWatchlist"
      class="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-card hover:bg-muted text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer"
      title="Saved Watchlist"
    >
      <svg class="size-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
      <span class="hidden md:inline">Watchlist</span>
      <span
        v-if="watchlistCount > 0"
        class="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-semibold border border-amber-500/30"
      >
        {{ watchlistCount }}
      </span>
    </button>

    <!-- Submit Launch Button -->
    <button
      @click="openSubmitModal"
      class="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-medium transition-all cursor-pointer shadow-xs"
    >
      <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Submit Launch
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  watchlistCount,
  openCommandPalette,
  openWatchlist,
  openSubmitModal,
} from '@/lib/watchlist-store';
</script>
