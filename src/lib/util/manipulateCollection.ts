import { collectionStore } from '$lib/stores/collectionStore';
import { toast } from '$lib/components/toast/toast';
import { ToastType, type GameType } from '$lib/types';

export function addToCollection(game: GameType) {
  collectionStore.add(game);
  toast.send(`"${game.name}" added to collection!`, { duration: 3000, type: ToastType.INFO });
}

export function removeFromCollection(game: GameType) {
  collectionStore.remove(game.id);
  toast.send(`Removed "${game.name}" from collection!`, { duration: 3000, type: ToastType.INFO });
}
