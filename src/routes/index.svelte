<script lang="ts">
  // import { Checkbox, NumberInput } from 'carbon-components-svelte';
  import Game from '$lib/components/game.svelte';
  import type { GameType } from '$lib/types';
  import Transition from '$lib/components/transition/index.svelte';
  import Listbox from '$lib/components/listbox.svelte';
  import Loading from '$lib/components/loading.svelte';
  import Portal from '$lib/Portal.svelte';
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
  <title>Bored Game</title>
</svelte:head>

<h1>Search Boardgames!</h1>
<p>Input your requirements to search for board game that match your criteria</p>
<div class="game-form">
  <form on:submit|preventDefault={handleSubmit} method="post">
    <fieldset aria-busy={submitting} disabled={submitting}>
      <div>
        <label htmlfor="minAge">
          <input id="minAge" name="minAge" bind:value={minAge} type="number" min={0} max={120} />
          Min Age
        </label>
        <!-- <NumberInput
          name="minAge"
          min={0}
          max={120}
          bind:value={minAge}
          invalidText="Number must be between 0 and 120"
          label="Min Age"
        /> -->
        <!-- <Checkbox
          name="exactMinAge"
          bind:checked={exactMinAge}
          bind:value={exactMinAge}
          labelText="Search exact?"
        /> -->
      </div>
      <div>
        <label htmlfor="minPlayers">
          <input
            id="minPlayers"
            name="minPlayers"
            bind:value={minPlayers}
            type="number"
            min={0}
            max={50}
          />
          Min Players
        </label>
        <!-- <NumberInput
          name="minPlayers"
          min={1}
          max={50}
          bind:value={minPlayers}
          invalidText="Number must be between 1 and 50"
          label="Min Players"
        />
        <Checkbox name="exactMinPlayers" labelText="Search exact?" bind:checked={exactMinPlayers} /> -->
      </div>
      <div>
        <label htmlfor="maxPlayers">
          <input
            id="maxPlayers"
            name="maxPlayers"
            bind:value={maxPlayers}
            type="number"
            min={0}
            max={50}
          />
          Max Players
        </label>
        <!-- <NumberInput
          name="maxPlayers"
          min={1}
          max={50}
          bind:value={maxPlayers}
          invalidText="Number must be between 1 and 50"
          label="Max Players"
        />
        <Checkbox name="exactMaxPlayers" labelText="Search exact?" bind:checked={exactMaxPlayers} /> -->
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

{#if submitting}
  <Portal>
    <Transition transition={{ type: 'fade', duration: 0 }}>
      <div class="loading">
        <Loading />
        <h3>Loading...</h3>
      </div>
    </Transition>
    <div class="background" />
  </Portal>
{/if}

<h1>Games</h1>
<div class="games">
  {#each games as game}
    <Game detailed={false} {game} />
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

  h2 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 600;
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

    @media(max-width: 580px) {
      grid-template-columns: 1fr;
    }
  }

  .description {
    margin: 1rem;
  }

  .game-form fieldset {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* flex-direction: column; */
    /* flex-wrap: wrap; */
    /* gap: 0.2rem; */
  }

  .game-form label {
    display: grid;
    margin: 1rem;
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
