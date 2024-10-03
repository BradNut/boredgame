<script lang="ts">
import { browser } from '$app/environment'
import { boredState } from '$lib/stores/boredState'
import { collectionStore } from '$lib/stores/collectionStore'
import { ToastType } from '$lib/types'
// import { SaveIcon, ShareIcon, TrashIcon } from '@rgossiaux/svelte-heroicons/outline';
import ClearCollectionDialog from '../dialog/ClearCollectionDialog.svelte'
import { toast } from '../toast/toast'

function saveCollection() {
	if (!browser) return
	localStorage.collection = JSON.stringify($collectionStore)
	toast.send('Saved collection', { duration: 3000, type: ToastType.INFO })
}

function exportCollection() {
	if (!browser) return
	const collectionBlob = new Blob([JSON.stringify($collectionStore)], {
		type: 'application/json;charset=utf-8',
	})
	let url = window.URL || window.webkitURL
	let link = url.createObjectURL(collectionBlob)
	let a = document.createElement('a')
	a.setAttribute('download', `collection.json`)
	a.setAttribute('href', link)
	a.click()
	document.body.removeChild(a)
	toast.send('Exported collection', { duration: 3000, type: ToastType.INFO })
}

function clearCollection() {
	if ($collectionStore.length > 0) {
		boredState.update((n) => ({
			...n,
			dialog: { isOpen: true, content: ClearCollectionDialog },
		}))
	} else {
		toast.send('Nothing to clear', { duration: 3000, type: ToastType.ERROR })
	}
}
</script>

<div>
	<div>
		<span class="collection-title"
			><a href="/collection" title="Go to your collection">Your Collection</a></span
		>
	</div>
	<div class="collection-buttons">
		<button type="button" aria-label="Export Collection" on:click={() => exportCollection()}
			>
			<!-- <ShareIcon width="24" height="24" /> -->
			Export</button
		>
		<!-- <button type="button" aria-label="Save Collection" on:click={() => saveCollection()}
			><SaveIcon width="24" height="24" />Save</button
		> -->
		<button type="button" aria-label="Clear saved collection" on:click={() => clearCollection()}>
			<!-- <TrashIcon width="24" height="24" />Clear -->
		</button>
	</div>
</div>

<style lang="postcss">
	:global(.collection-title) {
		padding-bottom: var(--spacing-8);
		font-size: var(--font-24);
		font-weight: 700;
		line-height: 32px;
	}

	:global(.collection-buttons) {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		// gap: 6rem;

		@media (min-width: 480px) {
			gap: 3rem;
		}
	}

	button {
		display: grid;
		place-items: center;
		gap: 0.25rem;
	}
</style>
