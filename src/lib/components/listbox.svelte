<script lang="ts">
  import { fade } from 'svelte/transition';
  // import {
  //   Listbox,
  //   ListboxButton,
  //   ListboxOptions,
  //   ListboxOption
  // } from '@rgossiaux/svelte-headlessui';

  const shows = [
    { id: 1, name: 'Cowboy Bebop', completed: false },
    { id: 2, name: 'Naruto', completed: false },
    { id: 3, name: 'One Piece', completed: false },
    { id: 4, name: 'Fullmetal Alchemist', completed: true },
    { id: 5, name: 'One Punch Man', completed: true },
    { id: 6, name: 'Death Note', completed: true }
  ];

  let selected = shows[0];
</script>

<h4>Listbox</h4>

<div class="listbox">
  <!-- <Listbox value={selected} on:change={(event) => (selected = event.detail)} let:open> -->
    <!-- <ListboxButton class="button"> -->
      <span>{selected.name}</span>
      <svg
        width="20"
        height="20"
        class="arrows"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    <!-- </ListboxButton> -->
    {#if open}
      <div transition:fade|global={{ duration: 200 }}>
        <!-- <ListboxOptions class="options"> -->
          {#each shows as anime (anime.id)}
            <!-- <ListboxOption
              class="option"
              value={anime}
              disabled={anime.completed}
              let:active
              let:selected
            > -->
              <span class:active class:selected>{anime.name}</span>
            <!-- </ListboxOption> -->
          {/each}
        <!-- </ListboxOptions> -->
      </div>
    {/if}
  <!-- </Listbox> -->
</div>

<!-- ... -->
<style>
  .listbox {
    max-width: 280px;
    position: relative;
    font-weight: 500;
    color: hsl(220, 20%, 98%);
  }

  .listbox :global(.button) {
    width: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;

    font-family: inherit;
    font-size: inherit;
    color: inherit;

    background-color: hsl(220, 20%, 2%);
    border: none;
    border-radius: 10px;
  }

  .listbox :global(.arrows) {
    width: 20px;
    height: 20px;
    display: block;
  }

  .listbox :global(.options) {
    position: absolute;
    top: 44px;
    right: 0;
    left: 0;
    padding: 1rem;
    background-color: hsl(220, 20%, 4%);
    border-radius: 10px;
    list-style: none;
  }

  .listbox :global(.option) {
    padding: 0.8rem 0.4rem;
    cursor: pointer;
  }

  .listbox :global(.option[aria-disabled='true']) {
    color: hsl(220, 20%, 30%);
  }

  .listbox :global(.active) {
    color: hsl(220, 80%, 70%);
  }

  .listbox :global(.active)::before {
    content: '👉️ ';
  }

  .listbox :global(.selected) {
    font-weight: 700;
  }

  .listbox :global(.selected)::before {
    content: '⭐️ ';
  }
</style>
