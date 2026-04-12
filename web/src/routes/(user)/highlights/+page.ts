import { authenticate } from '$lib/utils/auth';
import { getFormatter } from '$lib/utils/i18n';
import { searchHighlights } from '@immich/sdk';
import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
  const user = await authenticate(url);
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
