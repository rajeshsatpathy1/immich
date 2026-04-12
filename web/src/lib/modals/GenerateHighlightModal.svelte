<script lang="ts">
  import { Field, FormModal, Input } from '@immich/ui';
  import { mdiCreation } from '@mdi/js';
  import { t } from 'svelte-i18n';

  interface Props {
    albumName: string;
    onClose: (result?: { name: string }) => void;
  }

  let { albumName, onClose }: Props = $props();

  let highlightName = $state(`Best of ${albumName}`);

  const onSubmit = () => {
    onClose({ name: highlightName });
  };
</script>

<FormModal icon={mdiCreation} title={$t('generate_highlight')} size="small" onClose={() => onClose()} {onSubmit}>
  <div class="flex flex-col gap-4 m-4">
    <Field label={$t('name')}>
      <Input bind:value={highlightName} />
    </Field>
  </div>
</FormModal>
