<script lang="ts">
  // import { Checkbox, NumberInput } from 'carbon-components-svelte';
  import Game from '$lib/components/game/index.svelte';
  import TextSearch from '$lib/components/search/textSearch/index.svelte';
  import RandomSearch from '$lib/components/search/random/index.svelte';
  import Random from '$lib/components/random/index.svelte';
  import { gameStore } from '$lib/stores/gameSearchStore';
  import { boredState } from '$root/lib/stores/boredState';

  async function handleSearch(event: SubmitEvent) {
    boredState.set({ loading: true, dialogOpen: false });
    const form = event.target as HTMLFormElement;
    console.log('form', form);
    const response = await fetch('/api/game', {
      method: 'POST',
      headers: { accept: 'application/json' },
      body: new FormData(form)
    });
    const responseData = await response.json();
    boredState.set({ loading: false, dialogOpen: false });
    gameStore.removeAll();
    gameStore.addAll(responseData?.games);
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

<div class="games">
  <h1>Games Found:</h1>
  <div class="games-list">
    {#each $gameStore as game}
      <Game {game} />
    {/each}
  </div>
</div>

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
</style>
