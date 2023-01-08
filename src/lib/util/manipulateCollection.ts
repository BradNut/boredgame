import { collectionStore } from '$lib/stores/collectionStore';
import { toast } from '$lib/components/toast/toast';
import { ToastType, type GameType, type SavedGameType } from '$lib/types';
import { convertToSavedGame } from './gameMapper';
import { saved_game_schema } from '../zodValidation';

export function addToCollection(game: GameType | SavedGameType) {
	try {
		console.log(`Saving game: ${JSON.stringify(game)}`);
		saved_game_schema.parse(game);
		collectionStore.add(convertToSavedGame(game));
		toast.send('Added to collection', { duration: 3000, type: ToastType.INFO });
	} catch (error) {
		console.log(error);
		toast.send('Error adding to collection', { duration: 3000, type: ToastType.ERROR });
	}
}

export function removeFromCollection(game: GameType | SavedGameType) {
	try {
		saved_game_schema.parse(game);
		collectionStore.remove(game.id);
		toast.send('Removed from collection', { duration: 3000, type: ToastType.INFO });
	} catch (error) {
		toast.send('Error removing from collection', { duration: 3000, type: ToastType.ERROR });
	}
}
