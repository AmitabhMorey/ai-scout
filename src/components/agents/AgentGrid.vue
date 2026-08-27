<template>
  <div class="space-y-10">
    <!-- Top Filter Controls -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/50 p-4 rounded-xl border border-border">
      <!-- Type Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        <button
          v-for="t in TYPES"
          :key="t.key"
          @click="activeType = t.key"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap border',
            activeType === t.key
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
          placeholder="Search coding agents, IDEs..."
          class="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <svg class="size-4 absolute left-2.5 top-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Agent Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="agent in filteredAgents"
        :key="agent.id"
        class="p-5 rounded-xl border border-border bg-card/60 hover:bg-card transition-all flex flex-col justify-between space-y-4 hover:border-primary/40 hover:shadow-lg group"
      >
        <!-- Top Section -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-[11px] font-mono">
            <span class="text-muted-foreground">{{ agent.creator }}</span>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                {{ agent.releaseVersion }}
              </span>
              <button
                @click="saveAgent(agent)"
                class="text-muted-foreground hover:text-amber-400 transition-colors cursor-pointer p-0.5"
                :title="isItemBookmarked(agent.id) ? 'Remove Bookmark' : 'Save to Watchlist'"
              >
                <svg class="size-4" :fill="isItemBookmarked(agent.id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-baseline justify-between gap-2">
            <h3 class="font-serif-display text-xl font-medium tracking-tight text-foreground group-hover:text-emerald-400 transition-colors">
              {{ agent.name }}
            </h3>
            <span class="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border">
              {{ agent.type }}
            </span>
          </div>

          <p class="text-xs leading-relaxed text-muted-foreground line-clamp-3">
            {{ agent.description }}
          </p>
        </div>

        <!-- Capability Chips -->
        <div class="space-y-2 py-3 border-y border-border/60 text-xs font-mono">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-[11px]">Multi-File Diffs:</span>
            <span class="text-emerald-400 font-semibold">{{ agent.multiFileDiff }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-[11px]">Terminal Exec:</span>
            <span :class="agent.terminalExecution === 'Autonomous' ? 'text-purple-400 font-semibold' : 'text-foreground'">
              {{ agent.terminalExecution }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-[11px]">MCP Protocol:</span>
            <span :class="agent.mcpSupport === 'Native' ? 'text-amber-300 font-semibold' : 'text-muted-foreground'">
              {{ agent.mcpSupport }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-[11px]">Pricing:</span>
            <span class="text-foreground text-[11px] truncate max-w-40">{{ agent.pricing }}</span>
          </div>
        </div>

        <!-- Links Footer -->
        <div class="flex items-center justify-between pt-1">
          <a
            :href="agent.website"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-medium text-foreground hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
          >
            Official Website
            <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <a
            v-if="agent.github"
            :href="agent.github"
            target="_blank"
            rel="noopener noreferrer"
            class="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            title="GitHub Repository"
          >
            <svg class="size-4" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Feature Scorecard Matrix Table -->
    <div class="space-y-4 pt-6 border-t border-border">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-serif-display text-2xl font-normal text-foreground">Feature Scorecard Matrix</h2>
          <p class="text-xs text-muted-foreground mt-1">Direct side-by-side comparison of autonomous developer tooling architectures.</p>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card/50 overflow-x-auto">
        <table class="w-full border-collapse text-xs">
          <thead>
            <tr class="border-b border-border bg-background/60 text-left font-mono">
              <th class="py-3 px-4 text-muted-foreground uppercase">Tool / Platform</th>
              <th class="py-3 px-4 text-muted-foreground uppercase">Type</th>
              <th class="py-3 px-4 text-muted-foreground uppercase">Multi-File Diffs</th>
              <th class="py-3 px-4 text-muted-foreground uppercase">Terminal Autonomy</th>
              <th class="py-3 px-4 text-muted-foreground uppercase">MCP Protocol</th>
              <th class="py-3 px-4 text-muted-foreground uppercase">Local Ollama</th>
              <th class="py-3 px-4 text-muted-foreground uppercase">Pricing Model</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/40 font-mono">
            <tr v-for="a in AGENTS_DATA" :key="a.id" class="hover:bg-card transition-colors">
              <td class="py-3.5 px-4 font-serif-display text-sm font-medium text-foreground">
                {{ a.name }}
                <div class="text-[10px] font-mono text-muted-foreground">{{ a.creator }}</div>
              </td>
              <td class="py-3.5 px-4 text-muted-foreground">{{ a.type }}</td>
              <td class="py-3.5 px-4 text-emerald-400 font-semibold">{{ a.multiFileDiff }}</td>
              <td class="py-3.5 px-4">
                <span :class="a.terminalExecution === 'Autonomous' ? 'text-purple-400 font-semibold' : 'text-foreground'">
                  {{ a.terminalExecution }}
                </span>
              </td>
              <td class="py-3.5 px-4">
                <span :class="a.mcpSupport === 'Native' ? 'text-amber-300 font-semibold' : 'text-muted-foreground'">
                  {{ a.mcpSupport }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-muted-foreground">{{ a.localModelSupport }}</td>
              <td class="py-3.5 px-4 text-foreground text-[11px]">{{ a.pricing }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { AGENTS_DATA, type AgentTool } from '@/data/agents-data';
import { toggleWatchlist, isItemBookmarked } from '@/lib/watchlist-store';

const TYPES = [
  { key: 'all', label: 'All Developer Tools' },
  { key: 'IDE', label: '💻 Full IDEs' },
  { key: 'CLI Agent', label: '📟 CLI / Terminal' },
  { key: 'VS Code Extension', label: '🧩 Extensions' },
];

const activeType = ref('all');
const searchQuery = ref('');

const filteredAgents = computed(() => {
  let list = AGENTS_DATA;

  if (activeType.value !== 'all') {
    list = list.filter((a) => a.type === activeType.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.creator.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }

  return list;
});

function saveAgent(a: AgentTool) {
  toggleWatchlist({
    id: a.id,
    title: a.name,
    subtitle: `${a.creator} • ${a.type} • ${a.releaseVersion}`,
    type: 'agent',
    url: a.website,
    badge: a.type,
  });
}
</script>
