<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { GameType } from '$lib/types';

  export let game: GameType;
  export let detailed: boolean = false;
</script>

<article class="game-container" transition:fade>
  <div class="game-info">
    <h2>{game.name}</h2>
    <a class="thumbnail" href={`/game/${game.id}`}>
      <img width="140" height="140" src={game.thumb_url} alt={`Image of ${game.name}`} />
    </a>
  </div>

  <div class="game-details">
    <p>{game.year_published}</p>
    <p>{game.players} {game.max_players === 1 ? 'player' : 'players'}</p>
    <p>{game.playtime} minutes</p>
    <p>Minimum Age: {game.min_age}</p>
    <a href={`/game/${game.id}`}>View Game</a>
    {#if detailed}
      <div class="description">{@html game.description}</div>
    {/if}
  </div>
</article>

<style lang="scss">
  h2
  .thumbnail {
    align-self: start;
  }

  img {
    border-radius: 10px;
  }

  .game-container {
    display: flex;
    flex-wrap: wrap;
    /* grid-template-columns: repeat(minmax(100px, 1fr), 3); */
    /* grid-template-columns: 1fr 1fr; */
    max-width: 300px;
    gap: var(--spacing-16);
    padding: var(--spacing-16) var(--spacing-16);
    transition: all 0.3s;
    border-radius: 8px;
    background-color: var(--primary);
    &:hover {
      background-color: hsla(222, 9%, 65%, 1);
    }

    .game-info {
      display: grid;
      gap: 0.5rem;
      margin: 0.2rem;
    }

    .game-details {
      p, a {
        padding: 0.25rem;
      }
    }
  }
</style>
