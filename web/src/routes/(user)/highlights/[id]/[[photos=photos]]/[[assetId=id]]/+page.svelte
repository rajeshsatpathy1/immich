<script lang="ts">
  import HighlightViewer from '$lib/components/highlight-page/highlight-viewer.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let highlight = $state(data.highlight);
</script>

<HighlightViewer bind:highlight initialAssetId={data.assetId} />
