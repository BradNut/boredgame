<script lang="ts">
import { toast } from '$lib/components/toast/toast'
import { boredState } from '$lib/stores/boredState'
import { collectionStore } from '$lib/stores/collectionStore'
import { gameStore } from '$lib/stores/gameSearchStore'
import { type SavedGameType, ToastType } from '$lib/types'
import { mapSavedGameToGame } from '$lib/utils/gameMapper'

async function getRandomCollectionGame() {
	if ($collectionStore.length > 0) {
		boredState.update((n) => ({ ...n, loading: true }))
		let randomNumber: number = Math.round(Math.random() * $collectionStore.length - 1)
		if ($collectionStore.at(randomNumber)) {
			gameStore.removeAll()
			const randomGame: SavedGameType = $collectionStore.at(randomNumber)!
			// const response = await fetch(`/api/game/${randomGame?.id}`, {
			//   method: 'GET',
			//   headers: { accept: 'application/json' }
			// });
			// const responseData = await response.json();
			// console.log('responseData', responseData);
			// gameStore.add(responseData?.game);
			gameStore.add(mapSavedGameToGame(randomGame))
			boredState.update((n) => ({ ...n, loading: false }))
		} else {
			toast.send('Error!', { duration: 3000, type: ToastType.ERROR, dismissible: true })
		}
		boredState.update((n) => ({ ...n, loading: false }))
	} else {
		toast.send('No items in your collection!', {
			duration: 3000,
			type: ToastType.ERROR,
			dismissible: true,
		})
	}
}
</script>

<button class="btn" type="button" on:click={() => getRandomCollectionGame()}
	>Random from collection 🎲</button
>

<style lang="postcss">
	button {
		max-width: 450px;
		padding: var(--spacing-8) var(--spacing-16);
	}
</style>
