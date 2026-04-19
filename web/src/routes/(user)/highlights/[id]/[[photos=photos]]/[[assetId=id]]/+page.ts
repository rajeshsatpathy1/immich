import { authenticate } from '$lib/utils/auth';
import { featureFlagsManager } from '$lib/managers/feature-flags-manager.svelte';
import { getFormatter } from '$lib/utils/i18n';
import { getHighlight } from '@immich/sdk';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ params, url }) => {
  const user = await authenticate(url);
  if (!featureFlagsManager.value.highlights) {
    redirect(307, '/photos');
  }
  const $t = await getFormatter();
  const highlight = await getHighlight({ id: params.id });

  return {
    user,
    highlight,
    assetId: params.assetId,
    meta: {
      title: highlight.name || $t('highlights'),
    },
  };
}) satisfies PageLoad;
