<script lang="ts">
  import { boredState } from '$lib/stores/boredState';
  import { gameStore } from '$lib/stores/gameSearchStore';
  import AdvancedSearch from '$lib/components/search/advancedSearch/index.svelte';

  export let showButton: boolean = false;
  export let advancedSearch: boolean = false;
  console.log('showButton', showButton);

  let submitting = $boredState?.loading;
  let name = '';
</script>

<!-- <form on:submit|preventDefault={handleSearch} method="post"> -->
<fieldset class="text-search" aria-busy={submitting} disabled={submitting}>
  <label for="name">
    Search
    <input
      id="name"
      name="name"
      bind:value={name}
      type="text"
      aria-label="Search boardgame"
      placeholder="Search boardgame"
    />
  </label>
</fieldset>
{#if advancedSearch}
  <AdvancedSearch />
{/if}
{#if showButton}
  <button class="btn" type="submit" disabled={submitting}>Submit</button>
{/if}

<!-- </form> -->
<style lang="scss">
  h1 {
    width: 100%;
  }
  button {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  label {
    display: grid;
    grid-template-columns: auto auto;
    gap: 1rem;
    place-content: start;
    place-items: center;
    margin: 1rem;

    @media (max-width: 850px) {
      display: flex;
      flex-wrap: wrap;
    }
  }
</style>
