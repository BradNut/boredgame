<script lang="ts">
  import { fade } from 'svelte/transition';
  import {
    Dialog,
    DialogDescription,
    DialogOverlay,
    DialogTitle
  } from '@rgossiaux/svelte-headlessui';
  import Game from '$lib/components/game/index.svelte';
  import { collectionStore } from '$lib/stores/collectionStore';
  import type { GameType, SavedGameType } from '$root/lib/types';
  import { removeFromCollection } from '$root/lib/util/manipulateCollection';

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
  <title>Your Collection | Bored Game</title>
</svelte:head>

<h1>Your Collection</h1>

<div class="games">
  <div class="games-list">
    {#if $collectionStore.length === 0}
      <h2>No games in your collection</h2>
    {:else}
      {#each $collectionStore as game}
        <Game on:removeGameEvent={handleRemoveGame} minimal {game} />
      {/each}
    {/if}
  </div>
</div>
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
  h1 {
    width: 100%;
  }

  .games {
    margin: 2rem 0rem;
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

  /* 
  .container > .button {
    display: grid;
    justify-content: center;
    background-color: var(--primary);
  } */
</style>
