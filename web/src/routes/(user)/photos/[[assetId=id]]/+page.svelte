<script lang="ts">
  import ActionMenuItem from '$lib/components/ActionMenuItem.svelte';
  import UserPageLayout from '$lib/components/layouts/user-page-layout.svelte';
  import ButtonContextMenu from '$lib/components/shared-components/context-menu/button-context-menu.svelte';
  import EmptyPlaceholder from '$lib/components/shared-components/empty-placeholder.svelte';
  import ArchiveAction from '$lib/components/timeline/actions/ArchiveAction.svelte';
  import ChangeDate from '$lib/components/timeline/actions/ChangeDateAction.svelte';
  import ChangeDescription from '$lib/components/timeline/actions/ChangeDescriptionAction.svelte';
  import ChangeLocation from '$lib/components/timeline/actions/ChangeLocationAction.svelte';
  import CreateSharedLink from '$lib/components/timeline/actions/CreateSharedLinkAction.svelte';
  import DeleteAssets from '$lib/components/timeline/actions/DeleteAssetsAction.svelte';
  import DownloadAction from '$lib/components/timeline/actions/DownloadAction.svelte';
  import FavoriteAction from '$lib/components/timeline/actions/FavoriteAction.svelte';
  import LinkLivePhotoAction from '$lib/components/timeline/actions/LinkLivePhotoAction.svelte';
  import SelectAllAssets from '$lib/components/timeline/actions/SelectAllAction.svelte';
  import SetVisibilityAction from '$lib/components/timeline/actions/SetVisibilityAction.svelte';
  import StackAction from '$lib/components/timeline/actions/StackAction.svelte';
  import TagAction from '$lib/components/timeline/actions/TagAction.svelte';
  import AssetSelectControlBar from '$lib/components/timeline/AssetSelectControlBar.svelte';
  import Timeline from '$lib/components/timeline/Timeline.svelte';
  import { AssetAction } from '$lib/constants';
  import { assetMultiSelectManager } from '$lib/managers/asset-multi-select-manager.svelte';
  import { assetViewerManager } from '$lib/managers/asset-viewer-manager.svelte';
  import { memoryManager } from '$lib/managers/memory-manager.svelte';
  import { TimelineManager } from '$lib/managers/timeline-manager/timeline-manager.svelte';
  import { featureFlagsManager } from '$lib/managers/feature-flags-manager.svelte';
  import { Route } from '$lib/route';
  import { getAssetBulkActions } from '$lib/services/asset.service';
  import { highlightStore } from '$lib/stores/highlight.store.svelte';
  import { preferences } from '$lib/stores/user.store';
  import { getAssetMediaUrl, memoryLaneTitle } from '$lib/utils';
  import {
    updateStackedAssetInTimeline,
    updateUnstackedAssetInTimeline,
    type OnLink,
    type OnUnlink,
  } from '$lib/utils/actions';
  import { openFileUploadDialog } from '$lib/utils/file-uploader';
  import { getAltText } from '$lib/utils/thumbnail-util';
  import { toTimelineAsset } from '$lib/utils/timeline-util';
  import { AssetVisibility } from '@immich/sdk';
  import { ActionButton, CommandPaletteDefaultProvider, Icon, ImageCarousel } from '@immich/ui';
  import { mdiChevronRight, mdiDotsVertical } from '@mdi/js';
  import { slide } from 'svelte/transition';
  import { persisted } from 'svelte-persisted-store';
  import { t } from 'svelte-i18n';

  let timelineManager = $state<TimelineManager>() as TimelineManager;
  const options = { visibility: AssetVisibility.Timeline, withStacked: true, withPartners: true };

  let selectedAssets = $derived(assetMultiSelectManager.assets);
  let isAssetStackSelected = $derived(selectedAssets.length === 1 && !!selectedAssets[0].stack);
  let isLinkActionAvailable = $derived.by(() => {
    const isLivePhoto = selectedAssets.length === 1 && !!selectedAssets[0].livePhotoVideoId;
    const isLivePhotoCandidate =
      selectedAssets.length === 2 &&
      selectedAssets.some((asset) => asset.isImage) &&
      selectedAssets.some((asset) => asset.isVideo);

    return assetMultiSelectManager.isAllUserOwned && (isLivePhoto || isLivePhotoCandidate);
  });

  const handleEscape = () => {
    if (assetViewerManager.isViewing) {
      return;
    }
    if (assetMultiSelectManager.selectionActive) {
      assetMultiSelectManager.clear();
      return;
    }
  };

  const handleLink: OnLink = ({ still, motion }) => {
    timelineManager.removeAssets([motion.id]);
    timelineManager.upsertAssets([still]);
  };

  const handleUnlink: OnUnlink = ({ still, motion }) => {
    timelineManager.upsertAssets([motion]);
    timelineManager.upsertAssets([still]);
  };

  const handleSetVisibility = (assetIds: string[]) => {
    timelineManager.removeAssets(assetIds);
    assetMultiSelectManager.clear();
  };

  const items = $derived(
    memoryManager.memories.map((memory) => ({
      id: memory.id,
      title: $memoryLaneTitle(memory),
      href: Route.memories({ id: memory.assets[0].id }),
      alt: $t('memory_lane_title', { values: { title: $getAltText(toTimelineAsset(memory.assets[0])) } }),
      src: getAssetMediaUrl({ id: memory.assets[0].id }),
    })),
  );

  const highlightItems = $derived(
    highlightStore.highlights.map((highlight) => ({
      id: highlight.id,
      title: highlight.name,
      href: Route.viewHighlight({ id: highlight.id }),
      alt: highlight.name,
      src: highlight.thumbnailAssetId
        ? getAssetMediaUrl({ id: highlight.thumbnailAssetId })
        : highlight.assets.length > 0
          ? getAssetMediaUrl({ id: highlight.assets[0].id })
          : '',
    })),
  );

  const memoriesCollapsed = persisted('photos-memories-collapsed', false);
  const highlightsCollapsed = persisted('photos-highlights-collapsed', false);
</script>

<UserPageLayout hideNavbar={assetMultiSelectManager.selectionActive} scrollbar={false}>
  <Timeline
    enableRouting={true}
    bind:timelineManager
    {options}
    assetInteraction={assetMultiSelectManager}
    removeAction={AssetAction.ARCHIVE}
    onEscape={handleEscape}
    withStacked
  >
    {#if featureFlagsManager.value.memories && $preferences.memories.enabled}
      <div>
        <button
          type="button"
          onclick={() => memoriesCollapsed.update((v) => !v)}
          class="w-full text-start mt-2 pt-2 pe-2 pb-2 rounded-md transition-colors cursor-pointer dark:text-immich-dark-fg hover:text-primary hover:bg-subtle dark:hover:bg-immich-dark-gray"
          aria-expanded={!$memoriesCollapsed}
        >
          <Icon
            icon={mdiChevronRight}
            size="24"
            class="inline-block -mt-2.5 transition-all duration-250 {$memoriesCollapsed ? 'rotate-0' : 'rotate-90'}"
          />
          <span class="font-bold text-3xl text-black dark:text-white">{$t('memories')}</span>
        </button>
        <hr class="dark:border-immich-dark-gray" />
        {#if !$memoriesCollapsed}
          <div transition:slide={{ duration: 300 }}>
            <ImageCarousel {items} />
          </div>
        {/if}
      </div>
    {/if}
    {#if featureFlagsManager.value.highlights && highlightItems.length > 0}
      <div>
        <button
          type="button"
          onclick={() => highlightsCollapsed.update((v) => !v)}
          class="w-full text-start mt-2 pt-2 pe-2 pb-2 rounded-md transition-colors cursor-pointer dark:text-immich-dark-fg hover:text-primary hover:bg-subtle dark:hover:bg-immich-dark-gray"
          aria-expanded={!$highlightsCollapsed}
        >
          <Icon
            icon={mdiChevronRight}
            size="24"
            class="inline-block -mt-2.5 transition-all duration-250 {$highlightsCollapsed ? 'rotate-0' : 'rotate-90'}"
          />
          <span class="font-bold text-3xl text-black dark:text-white">{$t('highlights')}</span>
        </button>
        <hr class="dark:border-immich-dark-gray" />
        {#if !$highlightsCollapsed}
          <div transition:slide={{ duration: 300 }}>
            <ImageCarousel items={highlightItems} />
          </div>
        {/if}
      </div>
    {/if}
    {#snippet empty()}
      <EmptyPlaceholder text={$t('no_assets_message')} onClick={() => openFileUploadDialog()} class="mt-10 mx-auto" />
    {/snippet}
  </Timeline>
</UserPageLayout>

{#if assetMultiSelectManager.selectionActive}
  <AssetSelectControlBar>
    {@const Actions = getAssetBulkActions($t)}
    <CommandPaletteDefaultProvider name={$t('assets')} actions={Object.values(Actions)} />

    <CreateSharedLink />
    <SelectAllAssets {timelineManager} assetInteraction={assetMultiSelectManager} />
    <ActionButton action={Actions.AddToAlbum} />

    {#if assetMultiSelectManager.isAllUserOwned}
      <FavoriteAction
        removeFavorite={assetMultiSelectManager.isAllFavorite}
        onFavorite={(ids, isFavorite) => timelineManager.update(ids, (asset) => (asset.isFavorite = isFavorite))}
      />

      <ButtonContextMenu icon={mdiDotsVertical} title={$t('menu')}>
        <DownloadAction menuItem />
        {#if assetMultiSelectManager.assets.length > 1 || isAssetStackSelected}
          <StackAction
            unstack={isAssetStackSelected}
            onStack={(result) => updateStackedAssetInTimeline(timelineManager, result)}
            onUnstack={(assets) => updateUnstackedAssetInTimeline(timelineManager, assets)}
          />
        {/if}
        {#if isLinkActionAvailable}
          <LinkLivePhotoAction
            menuItem
            unlink={assetMultiSelectManager.assets.length === 1}
            onLink={handleLink}
            onUnlink={handleUnlink}
          />
        {/if}
        <ChangeDate menuItem />
        <ChangeDescription menuItem />
        <ChangeLocation menuItem />
        <ArchiveAction
          menuItem
          onArchive={(ids, visibility) => timelineManager.update(ids, (asset) => (asset.visibility = visibility))}
        />
        {#if $preferences.tags.enabled}
          <TagAction menuItem />
        {/if}
        <DeleteAssets
          menuItem
          onAssetDelete={(assetIds) => timelineManager.removeAssets(assetIds)}
          onUndoDelete={(assets) => timelineManager.upsertAssets(assets)}
        />
        <SetVisibilityAction menuItem onVisibilitySet={handleSetVisibility} />
        <hr />
        <ActionMenuItem action={Actions.RegenerateThumbnailJob} />
        <ActionMenuItem action={Actions.RefreshMetadataJob} />
        <ActionMenuItem action={Actions.TranscodeVideoJob} />
      </ButtonContextMenu>
    {:else}
      <DownloadAction />
    {/if}
  </AssetSelectControlBar>
{/if}
