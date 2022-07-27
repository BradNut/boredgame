<script lang="ts">
  import { fade } from 'svelte/transition';
  import { ToastType, type GameType } from '$lib/types';
  import { collectionStore } from '$lib/stores/collectionStore';
  import { toast } from '../toast/toast';

  export let game: GameType;
  export let detailed: boolean = false;
  $: existsInCollection = $collectionStore.find((item: GameType) => item.id === game.id);

  function addToCollection() {
    collectionStore.add(game)
    toast.send(`"${game.name}" added to collection!`, { duration: 3000, type: ToastType.INFO });
  }

  function removeFromCollection() {
    collectionStore.remove(game.id)
    toast.send(`Removed "${game.name}" from collection!`, { duration: 3000, type: ToastType.INFO });
  }
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
  {#if existsInCollection}
    <button type="button" on:click={removeFromCollection}>Remove from collection -</button>
  {:else}
    <button type="button" on:click={addToCollection}>Add to collection +</button>
  {/if}
  
</article>

<style lang="scss">
  h2
  .thumbnail {
    align-self: start;
  }

  img {
    border-radius: 10px;
  }

  button {
    width: 100%;
    border-radius: 10px;
    padding: 1rem;
    background-color: var(--color-btn-primary-active);
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
