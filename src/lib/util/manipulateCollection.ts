import { collectionStore } from '$lib/stores/collectionStore';
import { toast } from '$lib/components/toast/toast';
import { ToastType, type GameType } from '$lib/types';

export function addToCollection(game: GameType) {
  collectionStore.add(game);
  toast.send("Added to collection", { duration: 3000, type: ToastType.INFO });
}

export function removeFromCollection(game: GameType) {
  collectionStore.remove(game.id);
  toast.send("Removed from collection", { duration: 3000, type: ToastType.INFO });
}
