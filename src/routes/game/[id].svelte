<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { GameType } from '$lib/types';
  import Transition from '$lib/components/transition/index.svelte';
  import { Checkbox, NumberInput } from 'carbon-components-svelte';
  import type { boolean } from 'zod';
  // import { enhance } from "$lib/form";

  export let game: GameType;
  let seeMore: boolean = false;
</script>

<svelte:head>
  <title>{game?.name} | Bored Game</title>
</svelte:head>

<h2>{game?.name}</h2>

<section class="games">
  <div>
    <a class="thumbnail" href={game.url}>
      <img src={game.image_url} alt={`Image of ${game.name}`} />
    </a>
  </div>
  <div class="description">
    <div>
      <p>Price: {game?.price}</p>
      <p>Year Published: {game?.year_published}</p>
      <p>Players: {game.players} {game.max_players === 1 ? 'player' : 'players'}</p>
      <p>Playtime: {game.playtime} minutes</p>
      <p>Minimum Age: {game.min_age}</p>
      <a href={game.url} rel="noreferrer">Board Game Atlas Link</a>
    </div>
  </div>
</section>
<section class="description">
    {@html game?.description?.substring(0, game?.description?.indexOf('<br /><br />'))}
    {#if seeMore}
      <div transition:fade>{@html game?.description?.substring(game?.description?.indexOf('<br /><br />') + 12)}</div>
    {/if}
    <button on:click={() => (seeMore = !seeMore)}>See {!seeMore ? 'More +' : 'Less -'}</button>
</section>

<style lang="scss">
  h2 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 3rem;
  }

  button {
    border-radius: 4px;
    margin: 0;
    padding: 0.5rem;
    max-width: 200px;
    background-color: var(--color-btn-primary-active);
  }

  .games {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin: 1rem;
  }

  .details {
    display: grid;
    gap: 1.5rem;
    margin: 1rem;
  }

  .description {
    display: grid;
    gap: 1.5rem;
    margin: 1rem;
  }

  .game-form {
    display: flex;
    place-items: center;
  }

  .game-form fieldset {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(3, minmax(200px, 1fr));
  }
</style>
