<script lang="ts">
  import type { Game } from '$lib/types';
  import { Checkbox, NumberInput } from 'carbon-components-svelte';
  // import { enhance } from "$lib/form";

  let games: Game[] = [];
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
  <title>Games</title>
</svelte:head>

<h1>Search Boardgames!</h1>

<section>
  <p>Input your requirements to search for board game that match your criteria</p>
</section>
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
          bind:value={exactMinAge}
          labelText="Search exact?"
          bind:checked={exactMinAge}
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
        <Checkbox
          name="exactMinPlayers"
          labelText="Search exact?"
          bind:value={exactMinPlayers}
          bind:checked={exactMinPlayers}
        />
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
        <Checkbox
          name="exactMaxPlayers"
          labelText="Search exact?"
          bind:value={exactMaxPlayers}
          bind:checked={exactMaxPlayers}
        />
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
    <section>
      <div>
        <h2>{game.name}</h2>
        <p>price : {game.price}</p>
        <p>year_published : {game.year_published}</p>
        <p>min_players : {game.min_players}</p>
        <p>max_players : {game.max_players}</p>
        <p>min_playtime : {game.min_playtime}</p>
        <p>max_playtime : {game.max_playtime}</p>
        <p>min_age : {game.min_age}</p>
        <p>players : {game.players}</p>
        <p>playtime : {game.playtime}</p>
        <div class="description">{@html game.description}</div>
      </div>
    </section>
  {/each}
</div>

<style lang="scss">
  h2 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 600;
  }

  button {
    border-radius: 4px;
    margin: 0;
    padding: 0.2rem;
    background-color: var(--color-btn-primary-active);
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
</style>
