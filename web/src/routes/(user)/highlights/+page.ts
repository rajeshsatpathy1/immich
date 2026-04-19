import { authenticate } from '$lib/utils/auth';
import { featureFlagsManager } from '$lib/managers/feature-flags-manager.svelte';
import { getFormatter } from '$lib/utils/i18n';
import { searchHighlights } from '@immich/sdk';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
  const user = await authenticate(url);
  if (!featureFlagsManager.value.highlights) {
    redirect(307, '/photos');
  }
  const $t = await getFormatter();
  const highlights = await searchHighlights({});

  return {
    user,
    highlights,
    meta: {
      title: $t('highlights'),
    },
  };
}) satisfies PageLoad;
