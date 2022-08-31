<script lang="ts">
  import { fade } from 'svelte/transition';
  import {
    Dialog,
    DialogDescription,
    DialogOverlay,
    DialogTitle
  } from '@rgossiaux/svelte-headlessui';
  import Game from '$lib/components/game/index.svelte';
  import TextSearch from '$lib/components/search/textSearch/index.svelte';
  import RandomSearch from '$lib/components/search/random/index.svelte';
  import Random from '$lib/components/random/index.svelte';
  import { gameStore } from '$lib/stores/gameSearchStore';
  import { boredState } from '$root/lib/stores/boredState';
  import { removeFromCollection } from '$root/lib/util/manipulateCollection';
  import type { GameType, SavedGameType } from '$root/lib/types';

  async function handleSearch(event: SubmitEvent) {
    boredState.set({ loading: true });
    const form = event.target as HTMLFormElement;
    console.log('form', form);
    const response = await fetch('/api/game', {
      method: 'POST',
      headers: { accept: 'application/json' },
      body: new FormData(form)
    });
    const responseData = await response.json();
    boredState.set({ loading: false });
    gameStore.removeAll();
    gameStore.addAll(responseData?.games);
  }

  let isOpen: boolean = false;
  let gameToRemove: GameType | SavedGameType;
  console.log('isOpen', isOpen);

  interface RemoveGameEvent extends Event {
    detail: GameType | SavedGameType;
  }

  function handleRemoveGame(event: RemoveGameEvent) {
    console.log('event', event);
    gameToRemove = event?.detail;
    isOpen = true;
  }

  function removeGame() {
    removeFromCollection(gameToRemove);
    isOpen = false;
  }
</script>

<svelte:head>
  <title>Bored Game</title>
</svelte:head>

<h1>Search Boardgames!</h1>
<p>Input your requirements to search for board game that match your criteria</p>
<div class="game-search">
  <form on:submit|preventDefault={handleSearch} method="post">
    <TextSearch showButton advancedSearch />
  </form>
  <div class="random-buttons">
    <RandomSearch />
    <Random />
  </div>
</div>

{#if $gameStore?.length > 0}
  <div class="games">
    <h1>Games Found:</h1>
    <div class="games-list">
      {#each $gameStore as game}
        <Game on:removeGameEvent={handleRemoveGame} {game} />
      {/each}
    </div>
  </div>
{/if}
{#if isOpen}
  <div class="container">
    <div transition:fade>
      <Dialog open={isOpen} on:close={() => (isOpen = false)} static>
        <div transition:fade>
          <DialogOverlay class="dialog-overlay" />
          <div class="dialog">
            <DialogTitle>Remove from collection</DialogTitle>
            <DialogDescription
              >Are you sure you want to remove from your collection?</DialogDescription
            >

            <div class="dialog-footer">
              <button on:click={() => removeGame()}>Remove</button>
              <button on:click={() => (isOpen = false)}>Cancel</button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  </div>
{/if}

<style lang="scss">
  .games {
    margin: 2rem 0rem;

    h1 {
      margin-bottom: 2rem;
    }
  }

  .games-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(200px, 1fr));
    gap: 2rem;

    @media (max-width: 800px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 650px) {
      grid-template-columns: 1fr;
    }
  }

  .random-buttons {
    display: flex;
    place-content: space-between;
    place-items: center;

    @media (max-width: 650px) {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }

  .dialog {
    display: grid;
    gap: 1.5rem;
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 101;
    border-radius: 10px;
    background-color: var(--clr-input-bg);
    padding: 2rem;
    min-width: 400px;

    .dialog-footer {
      display: flex;
      justify-content: space-between;
      gap: 2rem;
      margin: 1rem 0;

      button {
        display: flex;
        place-content: center;
        gap: 1rem;
        width: 100%;
        border-radius: 10px;
        padding: 1rem;
        background-color: var(--color-btn-primary-active);

        &:hover {
          background-color: var(--color-btn-primary-active-hover);
        }
      }
    }
  }

  :global(.dialog-overlay) {
    position: fixed;
    inset: 0;
    z-index: 100;
    background-color: rgb(0 0 0);
    opacity: 0.8;
  }
</style>
