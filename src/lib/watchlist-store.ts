import { reactive, computed } from 'vue';

export interface WatchlistItem {
  id: string;
  type: 'model' | 'agent' | 'funding' | 'paper' | 'news';
  title: string;
  subtitle?: string;
  url?: string;
  timestamp?: string;
  badge?: string;
}

interface AppState {
  watchlist: WatchlistItem[];
  compareModels: string[]; // Model IDs
  isCommandPaletteOpen: boolean;
  isWatchlistOpen: boolean;
  isSubmitModalOpen: boolean;
}

const STORAGE_KEY = 'ai_scout_watchlist_v1';
const COMPARE_KEY = 'ai_scout_compare_models_v1';

function loadStoredWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadStoredCompare(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const appStore = reactive<AppState>({
  watchlist: loadStoredWatchlist(),
  compareModels: loadStoredCompare(),
  isCommandPaletteOpen: false,
  isWatchlistOpen: false,
  isSubmitModalOpen: false,
});

export const watchlistCount = computed(() => appStore.watchlist.length);
export const compareCount = computed(() => appStore.compareModels.length);

export function toggleWatchlist(item: WatchlistItem) {
  const idx = appStore.watchlist.findIndex((w) => w.id === item.id);
  if (idx >= 0) {
    appStore.watchlist.splice(idx, 1);
  } else {
    appStore.watchlist.unshift(item);
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appStore.watchlist));
  }
}

export function isItemBookmarked(id: string): boolean {
  return appStore.watchlist.some((w) => w.id === id);
}

export function removeWatchlistItem(id: string) {
  const idx = appStore.watchlist.findIndex((w) => w.id === id);
  if (idx >= 0) {
    appStore.watchlist.splice(idx, 1);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appStore.watchlist));
    }
  }
}

export function toggleCompareModel(modelId: string) {
  const idx = appStore.compareModels.indexOf(modelId);
  if (idx >= 0) {
    appStore.compareModels.splice(idx, 1);
  } else {
    if (appStore.compareModels.length >= 3) {
      appStore.compareModels.shift(); // Keep maximum 3 models
    }
    appStore.compareModels.push(modelId);
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(appStore.compareModels));
  }
}

export function isModelInCompare(modelId: string): boolean {
  return appStore.compareModels.includes(modelId);
}

export function clearCompareModels() {
  appStore.compareModels = [];
  if (typeof window !== 'undefined') {
    localStorage.removeItem(COMPARE_KEY);
  }
}

export function openCommandPalette() {
  appStore.isCommandPaletteOpen = true;
}
export function closeCommandPalette() {
  appStore.isCommandPaletteOpen = false;
}

export function openWatchlist() {
  appStore.isWatchlistOpen = true;
}
export function closeWatchlist() {
  appStore.isWatchlistOpen = false;
}

export function openSubmitModal() {
  appStore.isSubmitModalOpen = true;
}
export function closeSubmitModal() {
  appStore.isSubmitModalOpen = false;
}
