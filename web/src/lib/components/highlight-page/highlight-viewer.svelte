<script lang="ts">
  import { goto } from '$app/navigation';
  import { shortcuts } from '$lib/actions/shortcut';
  import DelayedLoadingSpinner from '$lib/components/DelayedLoadingSpinner.svelte';
  import ControlAppBar from '$lib/components/shared-components/control-app-bar.svelte';
  import { assetViewerFadeDuration } from '$lib/constants';
  import { Route } from '$lib/route';
  import { highlightStore } from '$lib/stores/highlight.store.svelte';
  import { preferences } from '$lib/stores/user.store';
  import { getAssetMediaUrl, handlePromiseError } from '$lib/utils';
  import { AssetMediaSize, AssetTypeEnum, deleteHighlight, type HighlightResponseDto } from '@immich/sdk';
  import { IconButton, toastManager } from '@immich/ui';
  import { mdiChevronLeft, mdiChevronRight, mdiDelete, mdiPause, mdiPlay } from '@mdi/js';
  import { t } from 'svelte-i18n';
  import { fade } from 'svelte/transition';
  import { Tween } from 'svelte/motion';

  interface Props {
    highlight: HighlightResponseDto;
    initialAssetId?: string;
  }

  let { highlight = $bindable(), initialAssetId }: Props = $props();

  const assets = $derived(highlight.assets);

  let currentIndex = $state(
    initialAssetId ? Math.max(0, assets.findIndex((a) => a.id === initialAssetId)) : 0,
  );

  const currentAsset = $derived(assets[currentIndex]);
  const hasPrevious = $derived(currentIndex > 0);
  const hasNext = $derived(currentIndex < assets.length - 1);

  let imageLoaded = $state(false);
  let paused = $state(false);

  // Progress tween: 0 → 1 over the configured memories duration (reuses same setting)
  let progress = new Tween<number>(0, {
    duration: (from, to) => (to ? $preferences.memories.duration * 1000 * (to - from) : 0),
  });

  // Reset + restart the progress bar every time the asset changes
  $effect(() => {
    void currentAsset?.id;
    imageLoaded = false;
    // Reset to 0 instantly (duration returns 0 when `to` is falsy)
    handlePromiseError(progress.set(0));
  });

  // When progress completes, auto-advance unless paused
  $effect(() => {
    if (progress.current === 1 && !paused) {
      if (hasNext) {
        currentIndex++;
      }
      // If on the last asset just stop — leave the image displayed
    }
  });

  // Start animating once the image has loaded
  function onImageLoaded() {
    imageLoaded = true;
    if (!paused) {
      handlePromiseError(progress.set(1));
    }
  }

  async function togglePause() {
    if (paused) {
      paused = false;
      // Resume from where we are
      if (progress.current < 1) {
        handlePromiseError(progress.set(1));
      }
    } else {
      paused = true;
      // Freeze at current position
      handlePromiseError(progress.set(progress.current));
    }
  }

  const handleNext = () => {
    if (hasNext) {
      currentIndex++;
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      currentIndex--;
    }
  };

  async function handleDelete() {
    await deleteHighlight({ id: highlight.id });
    highlightStore.highlights = highlightStore.highlights.filter((h) => h.id !== highlight.id);
    toastManager.primary($t('deleted'));
    await goto(Route.photos());
  }

  const toProgressPercentage = (index: number) => {
    if (index < currentIndex) return 100;
    if (index > currentIndex) return 0;
    return progress.current * 100;
  };
</script>

<svelte:document
  use:shortcuts={[
    { shortcut: { key: 'ArrowRight' }, onShortcut: handleNext },
    { shortcut: { key: 'd' }, onShortcut: handleNext },
    { shortcut: { key: 'ArrowLeft' }, onShortcut: handlePrevious },
    { shortcut: { key: 'a' }, onShortcut: handlePrevious },
    { shortcut: { key: ' ' }, onShortcut: () => handlePromiseError(togglePause()) },
    { shortcut: { key: 'Escape' }, onShortcut: () => goto(Route.photos()) },
  ]}
/>

<!--
  The ControlAppBar positions itself as `absolute top-0`. To prevent the image
  area from sliding behind it, we use `pt-20` on the main content section
  (matching the ~80px height of the app bar). This matches how memory-viewer
  uses `pt-32 md:pt-20` on its content section.
-->
<section class="fixed inset-0 z-[100] flex flex-col bg-immich-dark-gray">
  <!-- App bar wrapper: h-20 takes up flex space, z-10 keeps it above the content div -->
  <div class="relative z-10 h-20 shrink-0">
    <ControlAppBar onClose={() => goto(Route.photos())} forceDark multiRow>
    {#snippet leading()}
      <p class="text-lg text-white truncate">{highlight.name}</p>
    {/snippet}

    <!-- Centre: progress bars + play/pause + counter — same layout as memory viewer -->
    <div class="flex place-content-center place-items-center gap-2 overflow-hidden w-full dark">
      <div class="w-12.5">
        <IconButton
          shape="round"
          variant="ghost"
          color="secondary"
          aria-label={paused ? $t('play_memories') : $t('pause_memories')}
          icon={paused ? mdiPlay : mdiPause}
          onclick={() => handlePromiseError(togglePause())}
        />
      </div>

      {#each assets as _, index (index)}
        <button
          type="button"
          class="relative w-full py-2 cursor-pointer"
          onclick={() => (currentIndex = index)}
          aria-label="{index + 1} / {assets.length}"
        >
          <span class="absolute start-0 h-0.5 w-full bg-gray-500"></span>
          <span
            class="absolute start-0 h-0.5 bg-white transition-none"
            style:width="{toProgressPercentage(index)}%"
          ></span>
        </button>
      {/each}

      <div class="shrink-0">
        <p class="text-sm text-white">{currentIndex + 1}/{assets.length}</p>
      </div>
    </div>

    {#snippet trailing()}
      <IconButton
        shape="round"
        color="secondary"
        variant="ghost"
        aria-label={$t('delete')}
        icon={mdiDelete}
        onclick={handleDelete}
      />
    {/snippet}
  </ControlAppBar>
  </div>

  <!-- Content: flex-1 fills remaining height below the wrapper -->
  <div class="relative flex-1 flex items-center justify-center overflow-hidden">
    {#if currentAsset}
      {#key currentAsset.id}
        <div
          class="h-full w-full flex items-center justify-center"
          in:fade={{ duration: assetViewerFadeDuration }}
        >
          {#if !imageLoaded}
            <DelayedLoadingSpinner />
          {/if}
          <img
            src={getAssetMediaUrl({ id: currentAsset.id, size: AssetMediaSize.Preview })}
            alt={currentAsset.originalFileName}
            class="max-h-full max-w-full object-contain transition-opacity duration-300 {imageLoaded
              ? 'opacity-100'
              : 'opacity-0'}"
            onload={onImageLoaded}
          />
          {#if currentAsset.type === AssetTypeEnum.Video}
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="bg-black/40 rounded-full p-4">
                <svg viewBox="0 0 24 24" class="w-12 h-12 fill-white">
                  <path d={mdiPlay} />
                </svg>
              </div>
            </div>
          {/if}
        </div>
      {/key}
    {:else}
      <p class="text-gray-400">{$t('no_assets_message')}</p>
    {/if}

    <!-- Previous / Next nav buttons -->
    {#if hasPrevious}
      <div class="absolute start-4 top-1/2 -translate-y-1/2 dark">
        <IconButton
          shape="round"
          aria-label={$t('previous')}
          icon={mdiChevronLeft}
          variant="ghost"
          color="secondary"
          size="giant"
          onclick={handlePrevious}
        />
      </div>
    {/if}
    {#if hasNext}
      <div class="absolute end-4 top-1/2 -translate-y-1/2 dark">
        <IconButton
          shape="round"
          aria-label={$t('next')}
          icon={mdiChevronRight}
          variant="ghost"
          color="secondary"
          size="giant"
          onclick={handleNext}
        />
      </div>
    {/if}
  </div>
</section>
