<template>
  <div class="space-y-10">
    <!-- Top Market Analytics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Monthly Funding Trajectory (Visual Bar Chart) -->
      <div class="lg:col-span-2 p-5 rounded-xl border border-border bg-card/60 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-serif-display text-lg font-medium text-foreground">Monthly AI Capital Deployed</h3>
            <p class="text-xs text-muted-foreground">Aggregate venture capital invested across frontier AI startups ($ Millions).</p>
          </div>
          <span class="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
            +$2.81B in Feb 2025
          </span>
        </div>

        <!-- Visual Bar Chart using CSS & SVG -->
        <div class="pt-4 space-y-3">
          <div class="h-44 flex items-end justify-between gap-3 border-b border-border pb-2 pt-6 px-2">
            <div
              v-for="item in MONTHLY_FUNDING_TRENDS"
              :key="item.month"
              class="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end"
            >
              <!-- Bar Tooltip -->
              <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2 py-1 rounded bg-background border border-border text-[10px] font-mono text-foreground shadow-md pointer-events-none whitespace-nowrap z-10">
                ${{ item.totalMillions }}M total
              </div>

              <!-- Multi-Segment Colored Stacked Bar -->
              <div
                class="w-full max-w-12 rounded-t-sm transition-all duration-300 group-hover:brightness-125 overflow-hidden flex flex-col-reverse"
                :style="{ height: `${(item.totalMillions / 3000) * 100}%` }"
              >
                <div class="w-full bg-[#38bdf8]" :style="{ height: `${(item.agenticInfra / item.totalMillions) * 100}%` }"></div>
                <div class="w-full bg-[#a855f7]" :style="{ height: `${(item.foundationModels / item.totalMillions) * 100}%` }"></div>
                <div class="w-full bg-[#34d399]" :style="{ height: `${(item.devTools / item.totalMillions) * 100}%` }"></div>
                <div class="w-full bg-[#fbbf24]" :style="{ height: `${(item.robotics / item.totalMillions) * 100}%` }"></div>
              </div>

              <span class="text-[10px] font-mono text-muted-foreground truncate">{{ item.month }}</span>
            </div>
          </div>

          <!-- Legend -->
          <div class="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-muted-foreground pt-2">
            <div class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-sm bg-[#38bdf8]"></span>
              <span>Agentic Infra</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-sm bg-[#a855f7]"></span>
              <span>Foundation Models</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-sm bg-[#34d399]"></span>
              <span>DevTools</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-sm bg-[#fbbf24]"></span>
              <span>Robotics</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sector Allocation Distribution -->
      <div class="p-5 rounded-xl border border-border bg-card/60 space-y-4 flex flex-col justify-between">
        <div>
          <h3 class="font-serif-display text-lg font-medium text-foreground">Capital by Sector</h3>
          <p class="text-xs text-muted-foreground">Breakdown of venture allocation (Q1 2025).</p>
        </div>

        <div class="space-y-3.5 py-2">
          <div v-for="sec in SECTOR_DISTRIBUTION" :key="sec.name" class="space-y-1.5">
            <div class="flex items-center justify-between text-xs font-mono">
              <span class="text-foreground">{{ sec.name }}</span>
              <span class="font-semibold" :style="{ color: sec.color }">{{ sec.percentage }}%</span>
            </div>
            <div class="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500" :style="{ width: `${sec.percentage}%`, backgroundColor: sec.color }"></div>
            </div>
          </div>
        </div>

        <div class="p-3 rounded-lg bg-background/80 border border-border text-[11px] font-mono text-muted-foreground">
          💡 Agentic infrastructure investments have surged 180% year-over-year.
        </div>
      </div>
    </div>

    <!-- Deals Directory & Search Table -->
    <div class="space-y-4 pt-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="font-serif-display text-2xl font-normal text-foreground">Verified Funding Rounds</h2>
          <p class="text-xs text-muted-foreground mt-0.5">Disclosed venture capital financings, valuations, and lead syndicates.</p>
        </div>

        <div class="relative min-w-55">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search startups, investors..."
            class="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          <svg class="size-4 absolute left-2.5 top-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Deals Table -->
      <div class="rounded-xl border border-border bg-card/50 overflow-x-auto">
        <table class="w-full border-collapse text-xs">
          <thead>
            <tr class="border-b border-border bg-background/60 text-left font-mono">
              <th class="py-3 px-4 text-muted-foreground uppercase">Company</th>
              <th class="py-3 px-4 text-muted-foreground uppercase">Round</th>
              <th class="py-3 px-4 text-muted-foreground uppercase">Amount</th>
              <th class="py-3 px-4 text-muted-foreground uppercase">Valuation</th>
              <th class="py-3 px-4 text-muted-foreground uppercase">Lead Investors</th>
              <th class="py-3 px-4 text-muted-foreground uppercase">Sector</th>
              <th class="py-3 px-4 text-muted-foreground uppercase">Date</th>
              <th class="py-3 px-4 text-muted-foreground uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/40 font-mono">
            <tr v-for="d in filteredDeals" :key="d.id" class="hover:bg-card transition-colors">
              <td class="py-3.5 px-4">
                <div class="font-serif-display text-sm font-medium text-foreground">{{ d.company }}</div>
                <div class="text-[11px] font-sans text-muted-foreground line-clamp-1 max-w-xs">{{ d.description }}</div>
              </td>
              <td class="py-3.5 px-4">
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold border bg-purple-500/10 text-purple-300 border-purple-500/20">
                  {{ d.stage }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-emerald-400 font-semibold text-sm">
                ${{ d.amountMillions }}M
              </td>
              <td class="py-3.5 px-4 text-foreground">
                {{ d.valuationMillions ? '$' + d.valuationMillions + 'M' : 'Undisclosed' }}
              </td>
              <td class="py-3.5 px-4 font-sans text-xs text-foreground">
                {{ d.leadInvestors.join(', ') }}
              </td>
              <td class="py-3.5 px-4 text-muted-foreground">{{ d.sector }}</td>
              <td class="py-3.5 px-4 text-muted-foreground">{{ d.date }}</td>
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="saveDeal(d)"
                    class="p-1 rounded text-muted-foreground hover:text-amber-400 cursor-pointer"
                    :title="isItemBookmarked(d.id) ? 'Remove Bookmark' : 'Save to Watchlist'"
                  >
                    <svg class="size-4" :fill="isItemBookmarked(d.id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                  <a
                    :href="d.sourceUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-1 rounded text-muted-foreground hover:text-foreground"
                    title="Source link"
                  >
                    <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  MONTHLY_FUNDING_TRENDS,
  SECTOR_DISTRIBUTION,
  FUNDING_ROUNDS_DATA,
  type FundingRound,
} from '@/data/funding-data';
import { toggleWatchlist, isItemBookmarked } from '@/lib/watchlist-store';

const searchQuery = ref('');

const filteredDeals = computed(() => {
  if (!searchQuery.value.trim()) return FUNDING_ROUNDS_DATA;
  const q = searchQuery.value.toLowerCase();
  return FUNDING_ROUNDS_DATA.filter(
    (d) =>
      d.company.toLowerCase().includes(q) ||
      d.sector.toLowerCase().includes(q) ||
      d.leadInvestors.some((inv) => inv.toLowerCase().includes(q))
  );
});

function saveDeal(d: FundingRound) {
  toggleWatchlist({
    id: d.id,
    title: `${d.company} — $${d.amountMillions}M ${d.stage}`,
    subtitle: `${d.sector} • Led by ${d.leadInvestors.join(', ')}`,
    type: 'funding',
    url: d.sourceUrl,
    timestamp: d.date,
    badge: d.stage,
  });
}
</script>
