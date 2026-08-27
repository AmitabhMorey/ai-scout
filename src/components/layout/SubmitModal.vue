<template>
  <div
    v-if="appStore.isSubmitModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    @click.self="closeSubmitModal"
  >
    <div
      class="w-full max-w-lg rounded-xl bg-card border border-border shadow-2xl overflow-hidden text-foreground"
      @keydown.esc="closeSubmitModal"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-border bg-background/60">
        <div class="flex items-center gap-2">
          <span class="text-base">🚀</span>
          <h3 class="font-serif-display text-lg font-medium">Submit AI Launch</h3>
        </div>
        <button
          @click="closeSubmitModal"
          class="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 text-xs">
        <div>
          <label class="block font-medium text-foreground mb-1">Launch Category</label>
          <select
            v-model="category"
            class="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="model">Foundation Model / Weight Release</option>
            <option value="agent">Agentic IDE / Coding Agent / Tool</option>
            <option value="funding">Startup Funding / Venture Round</option>
            <option value="paper">Breakthrough Research Paper</option>
          </select>
        </div>

        <div>
          <label class="block font-medium text-foreground mb-1">Title / Name</label>
          <input
            v-model="title"
            type="text"
            required
            placeholder="e.g. Claude 3.7 Sonnet or Windsurf v1.2"
            class="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label class="block font-medium text-foreground mb-1">Official Announcement / Source URL</label>
          <input
            v-model="url"
            type="url"
            required
            placeholder="https://..."
            class="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label class="block font-medium text-foreground mb-1">Summary / Key Specs</label>
          <textarea
            v-model="description"
            rows="3"
            required
            placeholder="Key benchmarks, context window, pricing, or unique features..."
            class="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
          ></textarea>
        </div>

        <!-- Submit Buttons -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            @click="closeSubmitModal"
            class="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
          >
            Submit for Indexing
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { appStore, closeSubmitModal } from '@/lib/watchlist-store';

const category = ref('model');
const title = ref('');
const url = ref('');
const description = ref('');

function handleSubmit() {
  alert(`Thank you! "${title.value}" has been queued for verification and indexing into AI Scout.`);
  title.value = '';
  url.value = '';
  description.value = '';
  closeSubmitModal();
}
</script>
