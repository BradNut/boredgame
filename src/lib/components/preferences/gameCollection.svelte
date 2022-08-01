<script lang="ts">
  import { browser } from '$app/env';
  import { collectionStore } from '$root/lib/stores/collectionStore';
  import { ToastType } from '$root/lib/types';
  import { SaveIcon }  from '@rgossiaux/svelte-heroicons/outline';
  import { toast } from '../toast/toast';

  function saveCollection() {
    console.log('Saving collection');
    console.log('collectionStore', $collectionStore);
    if (!browser) return;
    localStorage.collection = JSON.stringify($collectionStore);
    toast.send("Saved collection", { duration: 3000, type: ToastType.INFO });
  }

  function clearCollection() {
    if (!browser) return;
    localStorage.collection = [];
    toast.send("Cleared collection", { duration: 3000, type: ToastType.INFO });
  }
</script>

<div>
  <button type="button" on:click={() => saveCollection()}><SaveIcon class="preferences-icon" /> Save Collection</button>
  <button type="button" on:click={() => clearCollection()}><SaveIcon class="preferences-icon" /> Clear Collection</button>
</div>

<style>
  :global(.preferences-icon) {
    height: 24px;
    width: 24px;
  }

  div {
    display: grid;
  }

  button {
    display: grid;
    place-items: center;
    gap: 0.25rem;
  }
</style>