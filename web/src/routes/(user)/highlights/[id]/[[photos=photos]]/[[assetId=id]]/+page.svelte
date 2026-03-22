<script lang="ts">
  import { goto } from '$app/navigation';
  import UserPageLayout from '$lib/components/layouts/user-page-layout.svelte';
  import GalleryViewer from '$lib/components/shared-components/gallery-viewer/gallery-viewer.svelte';
  import ControlAppBar from '$lib/components/shared-components/control-app-bar.svelte';
  import DownloadAction from '$lib/components/timeline/actions/DownloadAction.svelte';
  import FavoriteAction from '$lib/components/timeline/actions/FavoriteAction.svelte';
  import DeleteAssets from '$lib/components/timeline/actions/DeleteAssetsAction.svelte';
  import AssetSelectControlBar from '$lib/components/timeline/AssetSelectControlBar.svelte';
  import type { Viewport } from '$lib/managers/timeline-manager/types';
  import { Route } from '$lib/route';
  import { getAssetBulkActions } from '$lib/services/asset.service';
  import { AssetInteraction } from '$lib/stores/asset-interaction.svelte';
  import { highlightStore } from '$lib/stores/highlight.store.svelte';
  import { cancelMultiselect } from '$lib/utils/asset-utils';
  import { deleteHighlight } from '@immich/sdk';
  import { ActionButton, CommandPaletteDefaultProvider, IconButton, Text } from '@immich/ui';
  import { mdiArrowLeft, mdiDelete, mdiPin, mdiPinOff } from '@mdi/js';
  import { t } from 'svelte-i18n';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const viewport: Viewport = $state({ width: 0, height: 0 });
  const assetInteraction = new AssetInteraction();

  let highlight = $state(data.highlight);

  async function handleDelete() {
    await deleteHighlight({ id: highlight.id });
    highlightStore.highlights = highlightStore.highlights.filter((h) => h.id !== highlight.id);
    await goto(Route.photos());
  }

  async function handleTogglePin() {
    await highlightStore.updateHighlightPinned(highlight.id, !highlight.isPinned);
    highlight.isPinned = !highlight.isPinned;
  }
</script>

<UserPageLayout title={data.meta.title}>
  <ControlAppBar onClose={() => goto(Route.photos())} backIcon={mdiArrowLeft} showBackButton>
    <svelte:fragment slot="trailing">
      <IconButton
        shape="round"
        color="secondary"
        variant="ghost"
        aria-label={highlight.isPinned ? $t('unpin') : $t('pin')}
        icon={highlight.isPinned ? mdiPin : mdiPinOff}
        onclick={handleTogglePin}
      />
      <IconButton
        shape="round"
        color="secondary"
        variant="ghost"
        aria-label={$t('delete')}
        icon={mdiDelete}
        onclick={handleDelete}
      />
    </svelte:fragment>
  </ControlAppBar>

  <section class="px-4 pt-2">
    <Text size="heading-3" class="mb-1">{highlight.name}</Text>
    {#if highlight.description}
      <Text size="small" class="text-gray-500 dark:text-gray-400 mb-4">{highlight.description}</Text>
    {/if}
  </section>

  <section class="h-[calc(100%-(--spacing(25)))] overflow-auto immich-scrollbar">
    {#if highlight.assets.length > 0}
      <div bind:clientHeight={viewport.height} bind:clientWidth={viewport.width} class="mt-2">
        <GalleryViewer
          assets={highlight.assets}
          {assetInteraction}
          {viewport}
          pageHeaderOffset={54}
        />
      </div>
    {:else}
      <div class="flex items-center justify-center h-64">
        <Text size="small" class="text-gray-500">{$t('no_assets_message')}</Text>
      </div>
    {/if}
  </section>
</UserPageLayout>

{#if assetInteraction.selectionActive}
  <div class="fixed top-0 start-0 w-full">
    <AssetSelectControlBar
      assets={assetInteraction.selectedAssets}
      clearSelect={() => cancelMultiselect(assetInteraction)}
    >
      {@const Actions = getAssetBulkActions($t, assetInteraction.asControlContext())}
      <CommandPaletteDefaultProvider name={$t('assets')} actions={Object.values(Actions)} />
      <DownloadAction />
      <FavoriteAction />
      <DeleteAssets />
    </AssetSelectControlBar>
  </div>
{/if}
