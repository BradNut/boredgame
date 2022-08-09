<script lang="ts">
  import { browser } from '$app/env';
  import { collectionStore } from '$root/lib/stores/collectionStore';
  import { ToastType } from '$root/lib/types';
  import { SaveIcon, TrashIcon } from '@rgossiaux/svelte-heroicons/outline';
  import { toast } from '../toast/toast';

  function saveCollection() {
    console.log('Saving collection');
    console.log('collectionStore', $collectionStore);
    if (!browser) return;
    localStorage.collection = JSON.stringify($collectionStore);
    toast.send('Saved collection', { duration: 3000, type: ToastType.INFO });
  }

  function clearCollection() {
    if (!browser) return;
    localStorage.collection = [];
    toast.send('Cleared collection', { duration: 3000, type: ToastType.INFO });
  }
</script>

<div>
  <div>
    <span class="collection-title">Your Collection</span>
  </div>
  <div class="collection-buttons">
    <button type="button" aria-label="Save Collection" on:click={() => saveCollection()}
      ><SaveIcon width="24" height="24" />Save</button
    >
    <button type="button" aria-label="Clear saved collection" on:click={() => clearCollection()}
      ><TrashIcon width="24" height="24" />Clear</button
    >
  </div>
</div>

<style>
  :global(.collection-title) {
    padding-bottom: var(--spacing-8);
    font-size: var(--font-24);
    font-weight: 700;
    line-height: 32px;
  }

  :global(.collection-buttons) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 6rem;
  }

  button {
    display: grid;
    place-items: center;
    gap: 0.25rem;
  }
</style>
