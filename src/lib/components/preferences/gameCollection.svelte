<script lang="ts">
  import { SaveIcon, TrashIcon } from '@rgossiaux/svelte-heroicons/outline';
  import { clearCollection, saveCollection } from '$root/lib/util/manipulateCollection';
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
