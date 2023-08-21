import { wishlistStore } from '$lib/stores/wishlistStore';
import { toast } from '$lib/components/toast/toast';
import { ToastType, type GameType, type SavedGameType } from '$lib/types';
import { convertToSavedGame } from './gameMapper';

export function addToWishlist(game: GameType | SavedGameType) {
  wishlistStore.add(convertToSavedGame(game));
  toast.send("Added to wishlist", { duration: 3000, type: ToastType.INFO });
}

export function removeFromWishlist(game: GameType | SavedGameType) {
  wishlistStore.remove(game.id);
  toast.send("Removed from wishlist", { duration: 3000, type: ToastType.INFO });
}
