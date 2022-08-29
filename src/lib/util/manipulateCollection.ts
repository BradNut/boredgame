import { collectionStore } from '$lib/stores/collectionStore';
import { toast } from '$lib/components/toast/toast';
import { ToastType, type GameType, type SavedGameType } from '$lib/types';
import { browser } from '$app/env';

function convertToSavedGame(game: GameType): SavedGameType {
  return {
    id: game.id,
    name: game.name,
    thumb_url: game.thumb_url,
  };
}

export function addToCollection(game: GameType) {
  collectionStore.add(convertToSavedGame(game));
  toast.send("Added to collection", { duration: 3000, type: ToastType.INFO });
}

export function removeFromCollection(game: GameType) {
  collectionStore.remove(game.id);
  toast.send("Removed from collection", { duration: 3000, type: ToastType.INFO });
}

export function saveCollection() {
  console.log('Saving collection');
  console.log('collectionStore', collectionStore);
  if (!browser) return;
  localStorage.collection = JSON.stringify(collectionStore);
  toast.send('Saved collection', { duration: 3000, type: ToastType.INFO });
}

export function clearCollection() {
  if (!browser) return;
  localStorage.collection = [];
  toast.send('Cleared collection', { duration: 3000, type: ToastType.INFO });
}
