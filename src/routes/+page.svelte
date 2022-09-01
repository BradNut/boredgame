<script lang="ts">
  import type { GameType, SavedGameType } from '$root/lib/types';
  import { gameStore } from '$lib/stores/gameSearchStore';
  import { boredState } from '$root/lib/stores/boredState';
  import RemoveCollectionDialog from '$root/lib/components/dialog/RemoveCollectionDialog.svelte';
  import Game from '$lib/components/game/index.svelte';
  import TextSearch from '$lib/components/search/textSearch/index.svelte';
  import RandomSearch from '$lib/components/search/random/index.svelte';
  import Random from '$lib/components/random/index.svelte';
  import Pagination from '$lib/components/pagination/index.svelte';

  async function handleSearch(event: SubmitEvent) {
    boredState.update((n) => ({ ...n, loading: true }));
    const form = event.target as HTMLFormElement;
    console.log('form', form);
    const response = await fetch('/api/game', {
      method: 'POST',
      headers: { accept: 'application/json' },
      body: new FormData(form)
    });
    const responseData = await response.json();
    boredState.update((n) => ({ ...n, loading: false }));
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
    boredState.update((n) => ({
      ...n,
      dialog: { isOpen: true, content: RemoveCollectionDialog, additionalData: gameToRemove }
    }));
  }
</script>

<svelte:head>
  <title>Bored Game | Home</title>
</svelte:head>

<h1>Search Boardgames!</h1>
<p style="margin: 1rem 0;">
  Input your requirements to search for board game that match your criteria.
</p>
<div class="game-search">
  <form on:submit|preventDefault={handleSearch} method="post">
    <TextSearch showButton advancedSearch />
  </form>
  <section>
    <p>Or pick a random game!</p>
    <div class="random-buttons">
      <RandomSearch />
      <Random />
    </div>
  </section>
</div>

{#if $gameStore?.length > 0}
  <div class="games">
    <h1>Games Found:</h1>
    <div class="games-list">
      {#each $gameStore as game (game.id)}
        <Game on:removeGameEvent={handleRemoveGame} {game} />
      {/each}
    </div>
    <!-- <Pagination /> -->
  </div>
{/if}

<style lang="scss">
  .game-search {
    display: grid;
    gap: 2rem;

    section {
      display: grid;
      gap: 1rem;
    }
  }

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
</style>
