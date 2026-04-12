import { highlightStore } from '$lib/stores/highlight.store.svelte';
import { authenticate } from '$lib/utils/auth';
import { getFormatter } from '$lib/utils/i18n';
import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
  await authenticate(url);
  await highlightStore.ready();
  const $t = await getFormatter();

  return {
    meta: {
      title: $t('photos'),
    },
  };
}) satisfies PageLoad;
