<script lang="ts">
  import { fade } from 'svelte/transition';
  import ExternalLink from '@rgossiaux/svelte-heroicons/outline/ExternalLink';
  import { collectionStore } from '$lib/stores/collectionStore';
  import type { GameType, SavedGameType } from '$lib/types';
  import { addToCollection, removeFromCollection } from '$lib/util/manipulateCollection';
import { MinusCircleIcon, MinusIcon, PlusCircleIcon, PlusIcon } from '@rgossiaux/svelte-heroicons/outline';

  $: existsInCollection = $collectionStore.find((item: SavedGameType) => item.id === game.id);
  export let game: GameType;
  let seeMore: boolean = false;
  console.log(game?.description?.indexOf('</p>'));
  let firstParagraphEnd = 0;
  if (game?.description?.indexOf('</p>') > 0) {
    firstParagraphEnd = game?.description?.indexOf('</p>') + 4;
  } else if (game?.description?.indexOf('</ p>') > 0) {
    firstParagraphEnd = game?.description?.indexOf('</ p>') + 5;
  }
  console.log('firstParagraphEnd', firstParagraphEnd);
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
  <div class="details">
    <p>Year Published: {game?.year_published}</p>
    <p>Players: {game.players} {game.max_players === 1 ? 'player' : 'players'}</p>
    <p>Playtime: {game.playtime} minutes</p>
    <p>Minimum Age: {game.min_age}</p>
    <p>Price: ${game?.price}</p>
    <a
      style="display: flex; gap: 1rem;"
      href={game.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Board Game Atlas Link for ${game.name}`}
      >Board Game Atlas Link <ExternalLink width="24" height="24" /></a
    >
    {#if existsInCollection}
      <button class="btn" type="button" on:click={() => removeFromCollection(game)}
        >Remove from collection <MinusCircleIcon width="24" height="24" /></button
      >
    {:else}
      <button class="btn" type="button" on:click={() => addToCollection(game)}
        >Add to collection <PlusCircleIcon width="24" height="24" /></button
      >
    {/if}
  </div>
</section>
{#if firstParagraphEnd > 0}
  <section class="description">
    <span>
      {@html game?.description?.substring(0, firstParagraphEnd)}
    </span>
    {#if game?.description?.substring(firstParagraphEnd + 1) !== ''}
      {#if seeMore}
        <span transition:fade>
          {@html game?.description?.substring(firstParagraphEnd + 1)}
        </span>
      {/if}
      <button class="btn" type="button" on:click={() => (seeMore = !seeMore)}
        >See 
        {#if !seeMore}
          More <PlusIcon width="24" height="24" />
        {:else}
          Less <MinusIcon width="24" height="24" />
        {/if}
      </button>
    {/if}
  </section>
{/if}

<style lang="scss">
  h2 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 3rem;
  }

  button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    margin: 0;
    padding: 1rem;
    max-width: 30rem;
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
    gap: 0.5rem;
    align-content: center;
    justify-content: start;
    margin: 1rem;
    a,
    p {
      margin: 1rem;
    }
  }

  .description {
    display: grid;
    gap: 1.5rem;
    margin: 1rem;
  }
</style>
