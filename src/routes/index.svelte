<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import { Checkbox, NumberInput } from 'carbon-components-svelte';
  import Game from '$root/components/game.svelte';
  import type { GameType } from '$lib/types';
  import Listbox from '$root/components/listbox.svelte';
  // import { enhance } from "$lib/form";

  let games: GameType[] = [];
  let submitting = false;

  async function handleSubmit(event: SubmitEvent) {
    submitting = true;
    const form = event.target as HTMLFormElement;
    console.log('form', form);
    const response = await fetch('/api/games', {
      method: 'post',
      headers: { accept: 'application/json' },
      body: new FormData(form)
    });
    const responseData = await response.json();
    submitting = false;
    games = responseData?.games;
  }

  let minAge = 0;
  let minPlayers = 1;
  let maxPlayers = 1;
  let exactMinAge = false;
  let exactMinPlayers = false;
  let exactMaxPlayers = false;
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<h1>Search Boardgames!</h1>
<p>Input your requirements to search for board game that match your criteria</p>
<div class="game-form">
  <form on:submit|preventDefault={handleSubmit} method="post">
    <fieldset aria-busy={submitting} disabled={submitting}>
      <div>
        <NumberInput
          name="minAge"
          min={0}
          max={120}
          bind:value={minAge}
          invalidText="Number must be between 0 and 120"
          label="Min Age"
        />
        <Checkbox
          name="exactMinAge"
          bind:checked={exactMinAge}
          bind:value={exactMinAge}
          labelText="Search exact?"
        />
      </div>
      <div>
        <NumberInput
          name="minPlayers"
          min={1}
          max={50}
          bind:value={minPlayers}
          invalidText="Number must be between 1 and 50"
          label="Min Players"
        />
        <Checkbox name="exactMinPlayers" labelText="Search exact?" bind:checked={exactMinPlayers} />
      </div>
      <div>
        <NumberInput
          name="maxPlayers"
          min={1}
          max={50}
          bind:value={maxPlayers}
          invalidText="Number must be between 1 and 50"
          label="Max Players"
        />
        <Checkbox name="exactMaxPlayers" labelText="Search exact?" bind:checked={exactMaxPlayers} />
      </div>
    </fieldset>
    <button type="submit" disabled={submitting}>Submit</button>
  </form>
  <form on:submit|preventDefault={handleSubmit} method="post">
    <fieldset aria-busy={submitting} disabled={submitting}>
      <input type="checkbox" id="random" name="random" hidden checked />
      <button type="submit" disabled={submitting}>🎲</button>
    </fieldset>
  </form>
</div>

<div class="games">
  <h1>Games</h1>
  {#each games as game}
    <Game {game} />
  {/each}
</div>

<style lang="scss">
  h1 {
    width: 100%;
  }

  h2 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 600;
  }

  button {
    border-radius: 4px;
    margin: 0;
    padding: 0.2rem;
    background-color: palegreen;
  }

  .games {
    display: grid;
    gap: 2rem;
  }

  .description {
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

  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  .welcome {
    position: relative;
    width: 100%;
    height: 0;
    padding: 0 0 calc(100% * 495 / 2048) 0;
  }

  .welcome img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: block;
  }
</style>
