<script lang="ts">
  import { fade } from 'svelte/transition';
  import { Disclosure, DisclosureButton, DisclosurePanel } from '@rgossiaux/svelte-headlessui';
  import { ChevronRightIcon } from '@rgossiaux/svelte-heroicons/solid';
  import { boredState } from '$lib/stores/boredState';
  import AdvancedSearch from '$lib/components/search/advancedSearch/index.svelte';

  export let showButton: boolean = false;
  export let advancedSearch: boolean = false;

  let submitting = $boredState?.loading;
  let name = '';
</script>

<!-- <form on:submit|preventDefault={handleSearch} method="post"> -->
<div class="search">
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
    <Disclosure let:open>
      <DisclosureButton class="disclosure-button">
        <span>Advanced Search?</span>
        <ChevronRightIcon
          class="icon disclosure-icon"
          style={open
            ? 'transform: rotate(90deg); transition: transform 0.5s ease;'
            : 'transform: rotate(0deg); transition: transform 0.5s ease;'}
        />
      </DisclosureButton>

      {#if open}
        <div transition:fade>
          <!-- Using `static`, `DisclosurePanel` is always rendered,
                and ignores the `open` state -->
          <DisclosurePanel static>
            <AdvancedSearch />
          </DisclosurePanel>
        </div>
      {/if}
    </Disclosure>
  {/if}
</div>
{#if showButton}
  <button class="btn" type="submit" disabled={submitting}>Submit</button>
{/if}

<!-- </form> -->
<style lang="scss">
  .search {
    display: grid;
    gap: 1rem;
  }

  :global(.disclosure-button) {
    display: flex;
    gap: 0.25rem;
    place-items: center;
  }

  button {
    padding: 1rem;
    margin: 1.5rem 0;
  }

  label {
    display: grid;
    grid-template-columns: auto auto;
    gap: 1rem;
    place-content: start;
    place-items: center;

    @media (max-width: 850px) {
      display: flex;
      flex-wrap: wrap;
    }
  }
</style>
