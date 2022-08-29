import { collectionStore } from '$lib/stores/collectionStore';
import { toast } from '$lib/components/toast/toast';
import { ToastType, type GameType, type SavedGameType } from '$lib/types';

function convertToSavedGame(game: GameType | SavedGameType): SavedGameType {
  return {
    id: game.id,
    name: game.name,
    thumb_url: game.thumb_url,
  };
}

export function addToCollection(game: GameType | SavedGameType) {
  collectionStore.add(convertToSavedGame(game));
  toast.send("Added to collection", { duration: 3000, type: ToastType.INFO });
}

export function removeFromCollection(game: GameType | SavedGameType) {
  collectionStore.remove(game.id);
  toast.send("Removed from collection", { duration: 3000, type: ToastType.INFO });
}
