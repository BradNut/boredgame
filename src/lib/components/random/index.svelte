<script lang="ts">
  import { boredState } from '$lib/stores/boredState';
  import { gameStore } from '$lib/stores/gameSearchStore';
  import { collectionStore } from '$lib/stores/collectionStore';
  import { toast } from '$lib/components/toast/toast';
  import { ToastType } from '$lib/types';

  function getRandomCollectionGame() {
    if ($collectionStore.length > 0) {
      boredState.set({ loading: true });
      let randomNumber: number = Math.round(Math.random() * $collectionStore.length - 1);
      if ($collectionStore.at(randomNumber)) {
        gameStore.removeAll();
        gameStore.add($collectionStore.at(randomNumber)!);
        boredState.set({ loading: false });
      } else {
        toast.send('Error!', { duration: 3000, type: ToastType.ERROR, dismissible: true });
      }
      boredState.set({ loading: false });
    } else {
      toast.send('No items in your collection!', {
        duration: 3000,
        type: ToastType.ERROR,
        dismissible: true
      });
    }
  }
</script>

<button class="btn" type="button" on:click={getRandomCollectionGame}
  >Random from collection 🎲</button
>
