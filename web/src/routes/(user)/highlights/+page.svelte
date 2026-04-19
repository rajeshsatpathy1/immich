<script lang="ts">
  import { goto } from '$app/navigation';
  import UserPageLayout from '$lib/components/layouts/user-page-layout.svelte';
  import EmptyPlaceholder from '$lib/components/shared-components/empty-placeholder.svelte';
  import { Route } from '$lib/route';
  import { getAssetMediaUrl } from '$lib/utils';
  import type { HighlightResponseDto } from '@immich/sdk';
  import { Icon, Text } from '@immich/ui';
  import { mdiImageMultiple, mdiPin } from '@mdi/js';
  import { t } from 'svelte-i18n';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  function getThumbnailUrl(highlight: HighlightResponseDto): string {
    if (highlight.thumbnailAssetId) {
      return getAssetMediaUrl({ id: highlight.thumbnailAssetId });
    }
    if (highlight.assets.length > 0) {
      return getAssetMediaUrl({ id: highlight.assets[0].id });
    }
    return '';
  }
</script>

<UserPageLayout title={data.meta.title}>
  {#if data.highlights.length === 0}
    <EmptyPlaceholder text={$t('no_results')} class="mt-10 mx-auto" />
  {:else}
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {#each data.highlights as highlight (highlight.id)}
        <button
          class="group relative rounded-xl overflow-hidden aspect-square shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onclick={() => goto(Route.viewHighlight({ id: highlight.id }))}
        >
          {#if getThumbnailUrl(highlight)}
            <img
              src={getThumbnailUrl(highlight)}
              alt={highlight.name}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          {:else}
            <div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Icon icon={mdiImageMultiple} size="48" class="text-gray-400" />
            </div>
          {/if}
          <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div class="flex items-center gap-1">
              {#if highlight.isPinned}
                <Icon icon={mdiPin} size="14" class="text-white" />
              {/if}
              <Text size="small" class="text-white font-medium truncate">{highlight.name}</Text>
            </div>
            <Text size="tiny" class="text-white/70">{highlight.assets.length} {$t('photos').toLowerCase()}</Text>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</UserPageLayout>
