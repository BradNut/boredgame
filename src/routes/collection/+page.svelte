<script lang="ts">
  import Game from '$lib/components/game/index.svelte';
  import { collectionStore } from '$lib/stores/collectionStore';
  import type { GameType, SavedGameType } from '$root/lib/types';
  import { removeFromCollection } from '$root/lib/util/manipulateCollection';
  import { boredState } from '$root/lib/stores/boredState';
  import RemoveCollectionDialog from '$root/lib/components/dialog/RemoveCollectionDialog.svelte';

  let isOpen: boolean = false;
  let gameToRemove: GameType | SavedGameType;
  console.log('isOpen', isOpen);

  interface RemoveGameEvent extends Event {
    detail: GameType | SavedGameType;
  }

  function handleRemoveGame(event: RemoveGameEvent) {
    console.log('event', event);
    gameToRemove = event?.detail;
    boredState.update((n) => ({
      ...n,
      dialog: { isOpen: true, content: RemoveCollectionDialog, additionalData: gameToRemove }
    }));
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
</style>
