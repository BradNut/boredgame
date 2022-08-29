<script lang="ts">
  import { boredState } from '$lib/stores/boredState';
  import { gameStore } from '$lib/stores/gameSearchStore';
  import { collectionStore } from '$lib/stores/collectionStore';
  import { toast } from '$lib/components/toast/toast';
  import { ToastType, type SavedGameType } from '$lib/types';

  async function getRandomCollectionGame() {
    if ($collectionStore.length > 0) {
      boredState.set({ loading: true, dialogOpen: false });
      let randomNumber: number = Math.round(Math.random() * $collectionStore.length - 1);
      if ($collectionStore.at(randomNumber)) {
        gameStore.removeAll();
        const randomGame: SavedGameType = $collectionStore.at(randomNumber)!;
        const response = await fetch(`/api/game/${randomGame?.id}`, {
          method: 'GET',
          headers: { accept: 'application/json' }
        });
        const responseData = await response.json();
        console.log('responseData', responseData);
        gameStore.add(responseData?.game);
        boredState.set({ loading: false, dialogOpen: false });
      } else {
        toast.send('Error!', { duration: 3000, type: ToastType.ERROR, dismissible: true });
      }
      boredState.set({ loading: false, dialogOpen: false });
    } else {
      toast.send('No items in your collection!', {
        duration: 3000,
        type: ToastType.ERROR,
        dismissible: true
      });
    }
  }
</script>

<button class="btn" type="button" on:click={() => getRandomCollectionGame()}
  >Random from collection 🎲</button
>

<style lang="scss">
  button {
    max-width: 450px;
    padding: var(--spacing-8) var(--spacing-16);
  }
</style>
