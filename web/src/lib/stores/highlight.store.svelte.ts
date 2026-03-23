import { eventManager } from '$lib/managers/event-manager.svelte';
import { user } from '$lib/stores/user.store';
import {
  deleteHighlight,
  removeHighlightAssets,
  searchHighlights,
  updateHighlight,
  type HighlightResponseDto,
} from '@immich/sdk';
import { get } from 'svelte/store';

class HighlightStoreSvelte {
  #loading: Promise<void> | undefined;

  constructor() {
    eventManager.on({
      AuthLogout: () => this.clearCache(),
      AuthUserLoaded: () => this.initialize(),
    });

    if (get(user)) {
      void this.initialize();
    }
  }

  ready() {
    return this.initialize();
  }

  highlights = $state<HighlightResponseDto[]>([]);

  async deleteHighlight(id: string) {
    const highlight = this.highlights.find((h) => h.id === id);
    if (highlight) {
      await deleteHighlight({ id: highlight.id });
      this.highlights = this.highlights.filter((h) => h.id !== id);
    }
  }

  async deleteAssetFromHighlight(assetId: string) {
    const highlight = this.highlights.find((h) => h.assets.some((a) => a.id === assetId));
    if (highlight) {
      if (highlight.assets.length === 1) {
        await this.deleteHighlight(highlight.id);
      } else {
        await removeHighlightAssets({ id: highlight.id, bulkIdsDto: { ids: [assetId] } });
        highlight.assets = highlight.assets.filter((a) => a.id !== assetId);
      }
    }
  }

  async updateHighlightPinned(id: string, isPinned: boolean) {
    const highlight = this.highlights.find((h) => h.id === id);
    if (highlight) {
      await updateHighlight({ id, highlightUpdateDto: { isPinned } });
      highlight.isPinned = isPinned;
    }
  }

  private clearCache() {
    this.#loading = undefined;
    this.highlights = [];
  }

  private initialize() {
    if (!this.#loading) {
      this.#loading = this.load();
    }
    return this.#loading;
  }

  private async load() {
    console.log('[HighlightStore] Loading highlights from API...');
    const highlights = await searchHighlights({});
    console.log('[HighlightStore] Loaded', highlights.length, 'highlights');
    this.highlights = highlights.filter((h) => h.assets.length > 0);
    console.log('[HighlightStore] Filtered to', this.highlights.length, 'highlights with assets');
  }
}

export const highlightStore = new HighlightStoreSvelte();
