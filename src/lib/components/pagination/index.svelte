<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions
  } from '@rgossiaux/svelte-headlessui';
  import {
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon
  } from '@rgossiaux/svelte-heroicons/outline';
  import { boredState } from '$root/lib/stores/boredState';

  const dispatch = createEventDispatcher();
  // export let pageSize = 10;
  export let pageSize: number; // Reactive, bind
  export let currentPage: number; // Reactive, bind
  export let totalItems: number;
  export let pageSizes: ReadonlyArray<Number> = [10];
  export let forwardText: string;
  export let backwardText: string;
  export let pageSizeInputDisabled: boolean = false;

  const totalPages: number = Math.ceil(totalItems / pageSize);
  console.log('totalPages', totalPages);
  const prevPage: number = currentPage - 1;
  const nextPage: number = currentPage + 1;
  const hasNextPage: boolean = nextPage <= totalPages;
  const hasPrevPage: boolean = prevPage >= 1;
  const itemsLeft: number =
    totalItems - currentPage * $boredState.search.pageSize >= 0
      ? totalItems - currentPage * $boredState.search.pageSize
      : 0;
</script>

<div class="container">
  <span>
    <p>Items per-page:</p>
    <div class="list-container">
      <Listbox
        class="list-box"
        value={$boredState.search.pageSize}
        on:change={(e) => {
          dispatch('pageSizeEvent', e.detail);
          // boredState.update((n) => ({
          //   ...n,
          //   search: { totalCount, pageSize: e.detail, skip, currentPage }
          // }));
        }}
        let:open
      >
        <ListboxButton>{pageSize}</ListboxButton>
        {#if open}
          <div transition:fade>
            <ListboxOptions static class="list-options">
              {#each pageSizes as size (size)}
                <ListboxOption
                  value={size}
                  disabled={pageSizeInputDisabled}
                  class={({ active }) => (active ? 'active' : '')}
                  let:selected
                >
                  {#if selected}
                    <CheckIcon />
                  {/if}
                  <p>{size.toString()}</p>
                </ListboxOption>
              {/each}
            </ListboxOptions>
          </div>
        {/if}
      </Listbox>
    </div>
  </span>
  <p>
    Page {currentPage || 1} of {totalPages || 1}
  </p>
  <p>
    {itemsLeft} Item{itemsLeft > 1 || itemsLeft === 0 ? 's' : ''} Left
  </p>
  <button
    type="button"
    class="btn"
    disabled={!hasPrevPage}
    on:click={() => dispatch('previousPageEvent', prevPage)}
    ><ChevronLeftIcon width="24" height="24" />
    <p class="word">{backwardText || 'Prev'}</p></button
  >
  <button
    type="button"
    class="btn"
    disabled={!hasNextPage}
    on:click={() => dispatch('nextPageEvent', nextPage)}
    ><p class="word">{forwardText || 'Next'}</p>
    <ChevronRightIcon width="24" height="24" /></button
  >
</div>

<style lang="scss">
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin: 3rem 0;

    .btn {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
    }
  }

  @media (max-width: 800px) {
    .word {
      display: none;
    }
  }

  .list-container :global(.list-box) {
    height: 100%;
    position: relative;
  }

  .list-container :global(.list-options) {
    position: absolute;
  }

  .list-container :global(.active) {
    display: flex;
    gap: 1rem;
    padding: 1rem;
  }

  button {
    /* min-width: 50px; */
    &[aria-current],
    &.current {
      color: black; // TODO: Fix these colors
      background: white;
    }
    &[disabled] {
      pointer-events: none;
      color: var(--lightGrey);
      text-decoration: line-through;
    }
  }
</style>
