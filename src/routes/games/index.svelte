<script lang="ts">
  import { enhance } from "$lib/form";

  let minAge = 0;
	let maxAge = 0;
	let minPlayers = 0;
	let maxPlayers = 0;
	let loading = false;
  type Game = {
		id: string;
		handle: string;
		name: string;
		url: string;
		edit_url: string;
		price: number;
		price_ca: number;
		price_uk: number;
		price_au: number;
		msrp: number;
		year_published: number;
		min_players: number;
		max_players: number;
		min_playtime: number;
		max_playtime: number;
		min_age: number;
		description: string;
		players: string;
		playtime: string;
	}

	export let games: Game[];
</script>


<svelte:head>
	<title>Games</title>
</svelte:head>

<div class="game-form">
    <form
      action="/games"
      method="post"
      use:enhance={{
        pending: () => {
          loading = true;
        },
        result: async ({ data, form, response }) => {
          loading = false;
          console.log(JSON.stringify(data))
        }
      }}
    >
    <fieldset aria-busy={loading} disabled={loading}>
      <label for="minAge">Min Age:
        <input id="minAge" name="minAge" type="range" min="0" max="120" step="1" bind:value={minAge} />
        {minAge}
      </label>
      <label for="maxAge">Max Age:
        <input id="maxAge" name="maxAge" type="range" min="0" max="120" step="1" bind:value={maxAge} />
        {maxAge}
      </label>
      <label for="minPlayers">Min Players:
        <input id="minPlayers" name="minPlayers" type="range" min="1" max="50" step="1" bind:value={minPlayers} />
        {minPlayers}
      </label>
      <label for="maxPlayers">Max Players:
        <input id="maxPlayers" name="maxPlayers" type="range" min="1" max="50" step="1" bind:value={maxPlayers} />
        {maxPlayers}
      </label>
    </fieldset>
    <button type="submit" disabled={loading}>Submit</button>
  </form>
</div>

<div class="games">
	<h1>Games</h1>
  {#each games as game (game.id)}
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

<style>
  h2 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 600;
  }

  .games {
    display: grid;
    gap: 2rem;
  }
  
  .description {
    margin: 1rem;
  }

  .game-form {
    display: grid;
    grid-template-columns: 1fr;
  }
</style>