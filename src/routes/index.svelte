<script lang="ts">
  // import { Checkbox, NumberInput } from 'carbon-components-svelte';
  import Game from '$lib/components/game/index.svelte';
  import type { GameType } from '$lib/types';
  import Transition from '$lib/components/transition/index.svelte';
  import Listbox from '$lib/components/listbox.svelte';
  import Loading from '$lib/components/loading.svelte';
  import Portal from '$lib/Portal.svelte';
  import TextSearch from '$lib/components/search/textSearch/index.svelte';
  import AdvancedSearch from '$lib/components/search/advancedSearch/index.svelte';
  import RandomSearch from '$lib/components/search/random/index.svelte';
  import Random from '$lib/components/random/index.svelte';
  import { gameStore } from '$lib/stores/gameSearchStore';
  import { boredState } from '$lib/stores/boredState';
  import { Checkbox } from 'carbon-components-svelte';
  // import { enhance } from "$lib/form";

  // let games: GameType[] = [];
</script>

<svelte:head>
  <title>Bored Game</title>
</svelte:head>

<h1>Search Boardgames!</h1>
<p>Input your requirements to search for board game that match your criteria</p>
<div class="game-form">
  <TextSearch />
  <AdvancedSearch />
  <RandomSearch />
  <Random />
</div>

<!-- {#if submitting}
  <Portal>
    <Transition transition={{ type: 'fade', duration: 0 }}>
      <div class="loading">
        <Loading />
        <h3>Loading...</h3>
      </div>
    </Transition>
    <div class="background" />
  </Portal>
{/if} -->

<h1>Games</h1>
<div class="games">
  {#each $gameStore as game}
    <Game {game} />
  {/each}
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
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;

    @media (max-width: 800px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 550px) {
      grid-template-columns: 1fr;
    }
  }
  .game-form {
    margin: 1rem;
    border-radius: 4px;
    box-shadow: var(--level-2);
    background: rgba(0, 0, 0, 0.02);
    border: 2px solid var(--clr-primary);
    padding: 20px;
  }

  .game-form fieldset {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .game-form label {
    display: grid;
    margin: 1rem;
  }
</style>
