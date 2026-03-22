import { authenticate } from '$lib/utils/auth';
import { getFormatter } from '$lib/utils/i18n';
import { getHighlight } from '@immich/sdk';
import type { PageLoad } from './$types';

export const load = (async ({ params, url }) => {
  const user = await authenticate(url);
  const $t = await getFormatter();
  const highlight = await getHighlight({ id: params.id });

  return {
    user,
    highlight,
    meta: {
      title: highlight.name || $t('highlights'),
    },
  };
}) satisfies PageLoad;
