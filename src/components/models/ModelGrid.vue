<template>
  <div class="space-y-6">
    <!-- Top Filter & Search Controls -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/50 p-4 rounded-xl border border-border">
      <!-- Filter Tags -->
      <div class="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        <button
          v-for="f in FILTERS"
          :key="f.key"
          @click="activeFilter = f.key"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap border',
            activeFilter === f.key
              ? 'bg-primary text-primary-foreground border-transparent font-semibold shadow-xs'
              : 'border-border bg-background text-muted-foreground hover:text-foreground'
          ]"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative min-w-60">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search models, creators..."
          class="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <svg class="size-4 absolute left-2.5 top-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Active Compare Floating Bar (Appears when >= 1 model selected) -->
    <div
      v-if="appStore.compareModels.length > 0"
      class="sticky top-20 z-30 flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs backdrop-blur-md shadow-lg animate-fade-in"
    >
      <div class="flex items-center gap-3">
        <span class="font-medium">
          {{ appStore.compareModels.length }} / 3 models selected for comparison:
        </span>
        <div class="flex items-center gap-1.5">
          <span
            v-for="mid in appStore.compareModels"
            :key="mid"
            class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 text-[11px] font-mono"
          >
            {{ getModelName(mid) }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="showCompareModal = true"
          class="px-3 py-1.5 rounded-md bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-colors cursor-pointer text-xs flex items-center gap-1"
        >
          Compare Side-by-Side
        </button>
        <button
          @click="clearCompareModels"
          class="p-1.5 rounded hover:bg-amber-500/20 text-amber-400 transition-colors cursor-pointer"
          title="Clear selection"
        >
          <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Model Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="model in filteredModels"
        :key="model.id"
        class="group p-5 rounded-xl border border-border bg-card/60 hover:bg-card transition-all flex flex-col justify-between space-y-4 hover:border-primary/40 hover:shadow-lg"
      >
        <!-- Card Top: Creator, License, Bookmark -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-[11px] font-mono">
            <span class="text-muted-foreground">{{ model.creator }}</span>
            <div class="flex items-center gap-2">
              <span
                class="px-2 py-0.5 rounded text-[10px] font-semibold border"
                :class="model.license === 'Open Weights' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'"
              >
                {{ model.license }}
              </span>
              <button
                @click="saveModel(model)"
                class="text-muted-foreground hover:text-amber-400 transition-colors cursor-pointer p-0.5"
                :title="isItemBookmarked(model.id) ? 'Remove Bookmark' : 'Save to Watchlist'"
              >
                <svg class="size-4" :fill="isItemBookmarked(model.id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Model Name & Reasoning Badge -->
          <div class="flex items-baseline justify-between gap-2">
            <h3 class="font-serif-display text-xl font-medium tracking-tight text-foreground group-hover:text-amber-300 transition-colors">
              {{ model.name }}
            </h3>
            <span v-if="model.isReasoning" class="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-mono font-medium shrink-0">
              Reasoning
            </span>
          </div>

          <p class="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {{ model.description }}
          </p>
        </div>

        <!-- Card Middle: Benchmark & Spec Chips -->
        <div class="grid grid-cols-3 gap-2 py-3 border-y border-border/60 text-center">
          <div class="space-y-0.5">
            <div class="text-[10px] font-mono text-muted-foreground uppercase">SWE-bench</div>
            <div class="font-mono text-sm font-semibold text-foreground">
              {{ model.sweBenchScore ? model.sweBenchScore + '%' : '—' }}
            </div>
          </div>
          <div class="space-y-0.5">
            <div class="text-[10px] font-mono text-muted-foreground uppercase">Context</div>
            <div class="font-mono text-sm font-semibold text-foreground">
              {{ formatContext(model.contextWindow) }}
            </div>
          </div>
          <div class="space-y-0.5">
            <div class="text-[10px] font-mono text-muted-foreground uppercase">$/1M Out</div>
            <div class="font-mono text-sm font-semibold text-emerald-400">
              ${{ model.outputPrice }}
            </div>
          </div>
        </div>

        <!-- Card Bottom: Modalities & Compare Checkbox -->
        <div class="flex items-center justify-between pt-1">
          <div class="flex items-center gap-1 overflow-hidden">
            <span
              v-for="mod in model.modalities.slice(0, 3)"
              :key="mod"
              class="px-1.5 py-0.5 rounded bg-background border border-border text-[9px] font-mono text-muted-foreground"
            >
              {{ mod }}
            </span>
          </div>

          <!-- Compare Button -->
          <button
            @click="toggleCompare(model.id)"
            :class="[
              'px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer border flex items-center gap-1',
              isModelInCompare(model.id)
                ? 'bg-amber-500 text-black border-amber-500 font-semibold'
                : 'border-border bg-card text-muted-foreground hover:text-foreground'
            ]"
          >
            <span v-if="isModelInCompare(model.id)">✓ Added</span>
            <span v-else>+ Compare</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Side-by-Side Comparison Modal -->
    <div
      v-if="showCompareModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      @click.self="showCompareModal = false"
    >
      <div class="w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-y-auto flex flex-col text-foreground">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-border bg-background/70">
          <div class="flex items-center gap-2">
            <span class="text-lg">⚖️</span>
            <h3 class="font-serif-display text-xl font-medium">Frontier Model Comparison</h3>
          </div>
          <button
            @click="showCompareModal = false"
            class="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Comparison Table -->
        <div class="p-6 overflow-x-auto text-xs">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-border text-left">
                <th class="py-3 px-4 font-mono uppercase text-muted-foreground w-1/4">Specification</th>
                <th
                  v-for="m in comparedModelObjects"
                  :key="m.id"
                  class="py-3 px-4 font-serif-display text-base font-medium text-foreground"
                >
                  {{ m.name }}
                  <div class="text-[11px] font-mono font-normal text-muted-foreground">{{ m.creator }}</div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/40 font-mono">
              <tr>
                <td class="py-3 px-4 text-muted-foreground">License & Weights</td>
                <td v-for="m in comparedModelObjects" :key="m.id" class="py-3 px-4 font-medium">
                  {{ m.license }}
                </td>
              </tr>
              <tr>
                <td class="py-3 px-4 text-muted-foreground">Reasoning Paradigm</td>
                <td v-for="m in comparedModelObjects" :key="m.id" class="py-3 px-4 font-medium">
                  <span v-if="m.isReasoning" class="text-purple-400 font-semibold">Native CoT / Thinking</span>
                  <span v-else class="text-muted-foreground">Standard Direct Inference</span>
                </td>
              </tr>
              <tr>
                <td class="py-3 px-4 text-muted-foreground">Context Window</td>
                <td v-for="m in comparedModelObjects" :key="m.id" class="py-3 px-4 font-medium text-foreground">
                  {{ formatContext(m.contextWindow) }} tokens
                </td>
              </tr>
              <tr>
                <td class="py-3 px-4 text-muted-foreground">Input Token Price</td>
                <td v-for="m in comparedModelObjects" :key="m.id" class="py-3 px-4 text-emerald-400 font-medium">
                  ${{ m.inputPrice }} / 1M
                </td>
              </tr>
              <tr>
                <td class="py-3 px-4 text-muted-foreground">Output Token Price</td>
                <td v-for="m in comparedModelObjects" :key="m.id" class="py-3 px-4 text-emerald-400 font-medium">
                  ${{ m.outputPrice }} / 1M
                </td>
              </tr>
              <tr>
                <td class="py-3 px-4 text-muted-foreground">SWE-bench Verified</td>
                <td v-for="m in comparedModelObjects" :key="m.id" class="py-3 px-4 font-semibold text-amber-300">
                  {{ m.sweBenchScore ? m.sweBenchScore + '%' : 'N/A' }}
                </td>
              </tr>
              <tr>
                <td class="py-3 px-4 text-muted-foreground">MMLU-Pro Score</td>
                <td v-for="m in comparedModelObjects" :key="m.id" class="py-3 px-4 font-semibold text-foreground">
                  {{ m.mmluProScore ? m.mmluProScore + '%' : 'N/A' }}
                </td>
              </tr>
              <tr>
                <td class="py-3 px-4 text-muted-foreground">MATH 500 Score</td>
                <td v-for="m in comparedModelObjects" :key="m.id" class="py-3 px-4 font-semibold text-foreground">
                  {{ m.math500Score ? m.math500Score + '%' : 'N/A' }}
                </td>
              </tr>
              <tr>
                <td class="py-3 px-4 text-muted-foreground">Modalities</td>
                <td v-for="m in comparedModelObjects" :key="m.id" class="py-3 px-4 font-sans text-xs">
                  {{ m.modalities.join(', ') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 border-t border-border bg-background/60 flex items-center justify-between text-xs font-mono">
          <span class="text-muted-foreground">Comparing {{ comparedModelObjects.length }} foundation models</span>
          <button
            @click="clearCompareModels(); showCompareModal = false"
            class="text-red-400 hover:underline cursor-pointer"
          >
            Reset Comparison
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MODELS_DATA, type AIModel } from '@/data/models-data';
import {
  appStore,
  toggleCompareModel,
  isModelInCompare,
  clearCompareModels,
  toggleWatchlist,
  isItemBookmarked,
} from '@/lib/watchlist-store';

const FILTERS = [
  { key: 'all', label: 'All Models' },
  { key: 'reasoning', label: '🧠 Reasoning' },
  { key: 'open', label: '🔓 Open Weights' },
  { key: 'coding', label: '💻 Code Specialized' },
  { key: 'multimodal', label: '👁️ Multimodal' },
];

const activeFilter = ref('all');
const searchQuery = ref('');
const showCompareModal = ref(false);

const filteredModels = computed(() => {
  let list = MODELS_DATA;

  if (activeFilter.value === 'reasoning') {
    list = list.filter((m) => m.isReasoning);
  } else if (activeFilter.value === 'open') {
    list = list.filter((m) => m.license === 'Open Weights' || m.license === 'Open Source');
  } else if (activeFilter.value === 'coding') {
    list = list.filter((m) => m.modalities.includes('Code'));
  } else if (activeFilter.value === 'multimodal') {
    list = list.filter((m) => m.modalities.includes('Vision') || m.modalities.includes('Audio'));
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.creator.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    );
  }

  return list;
});

const comparedModelObjects = computed(() => {
  return appStore.compareModels
    .map((id) => MODELS_DATA.find((m) => m.id === id))
    .filter((m): m is AIModel => Boolean(m));
});

function getModelName(mid: string): string {
  const found = MODELS_DATA.find((m) => m.id === mid);
  return found ? found.name : mid;
}

function formatContext(tokens: number): string {
  if (tokens >= 1000000) return `${tokens / 1000000}M`;
  if (tokens >= 1000) return `${tokens / 1000}k`;
  return String(tokens);
}

function toggleCompare(mid: string) {
  toggleCompareModel(mid);
}

function saveModel(m: AIModel) {
  toggleWatchlist({
    id: m.id,
    title: m.name,
    subtitle: `${m.creator} • ${m.license} • ${formatContext(m.contextWindow)} ctx`,
    type: 'model',
    badge: m.license,
  });
}
</script>
