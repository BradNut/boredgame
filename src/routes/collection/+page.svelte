<script lang="ts">
  import Game from '$lib/components/game/index.svelte';
  import { collectionStore } from '$lib/stores/collectionStore';
</script>

<svelte:head>
  <title>Your Collection | Bored Game</title>
</svelte:head>

<h1>Your Collection</h1>

<div class="games">
  <div class="games-list">
    {#each $collectionStore as game}
      <Game minimal {game} />
    {/each}
  </div>
</div>

<style lang="scss">
  h1 {
    width: 100%;
  }

  .games {
    margin: 2rem 0rem;
  }

  .games-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(200px, 1fr));
    gap: 2rem;

    @media (max-width: 800px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 650px) {
      grid-template-columns: 1fr;
    }
  }
</style>
