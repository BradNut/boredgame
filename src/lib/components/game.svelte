<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import type { GameType } from '$lib/types';

  export let game: GameType;
</script>

<article class="game-container" transition:fade>
  <a class="thumbnail" href={game.url}>
    <img width="140" height="140" src={game.thumb_url} alt={`Image of ${game.name}`} />
  </a>

  <div class="game-details">
    <div class="game">
      <div class="content">
        <h2>{game.name}</h2>
        <p>{game.year_published}</p>
        <p>{game.players} {game.max_players === 1 ? 'player' : 'players'}</p>
        <p>{game.playtime} minutes</p>
        <p>Minimum Age: {game.min_age}</p>
        <div class="description">{@html game.description}</div>
      </div>
    </div>
  </div>
</article>

<style>
  .thumbnail {
    align-self: start;
  }

  img {
    border-radius: 10px;
  }

  .game-container:hover {
    background-color: var(--primary);
  }

  .game-container {
    display: grid;
    grid-template-columns: min-content 1fr;
    gap: var(--spacing-16);
    padding: var(--spacing-16) var(--spacing-16);
    transition: all 0.3s;
    border-radius: 8px;
  }
</style>
