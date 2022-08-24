<script lang="ts">
  // import { Checkbox, NumberInput } from 'carbon-components-svelte';
  import Game from '$lib/components/game/index.svelte';
  import TextSearch from '$lib/components/search/textSearch/index.svelte';
  import RandomSearch from '$lib/components/search/random/index.svelte';
  import Random from '$lib/components/random/index.svelte';
  import { gameStore } from '$lib/stores/gameSearchStore';
  import { boredState } from '$root/lib/stores/boredState';

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
  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 101;
    display: grid;
    place-items: center;
    gap: 1rem;

    h3 {
      color: white;
    }
  }

  .background {
    background: black;
    opacity: 0.8;
    cursor: none;
    inset: 0;
    position: fixed;
    z-index: 100;
  }

  h1 {
    width: 100%;
  }
  button {
    border-radius: 10px;
    margin: 0.5rem;
    padding: 1rem;
    color: var(--clr-input-txt);
    background-color: var(--color-btn-primary-active);
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
  .game-search {
    border-radius: 4px;
    box-shadow: var(--level-2);
    background: rgba(0, 0, 0, 0.02);
    border: 2px solid var(--clr-primary);
    padding: 20px;

    fieldset {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
    label {
      display: grid;
      margin: 1rem;
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
