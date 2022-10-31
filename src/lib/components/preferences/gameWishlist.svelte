<script lang="ts">
	import { browser } from '$app/environment';
	import { boredState } from '$root/lib/stores/boredState';
	import { wishlistStore } from '$root/lib/stores/wishlistStore';
	import { ToastType } from '$root/lib/types';
	import { SaveIcon, ShareIcon, TrashIcon } from '@rgossiaux/svelte-heroicons/outline';
	import ClearWishlistDialog from '../dialog/ClearWishlistDialog.svelte';
	import { toast } from '../toast/toast';

	function saveWishlist() {
		if (!browser) return;
		localStorage.wishlist = JSON.stringify($wishlistStore);
		toast.send('Saved wishlist', { duration: 3000, type: ToastType.INFO });
	}

	function exportWishlist() {
		if (!browser) return;
		const wishlistBlob = new Blob([JSON.stringify($wishlistStore)], {
			type: 'application/json;charset=utf-8'
		});
		let url = window.URL || window.webkitURL;
		let link = url.createObjectURL(wishlistBlob);
		let a = document.createElement('a');
		a.setAttribute('download', `wishlist.json`);
		a.setAttribute('href', link);
		a.click();
		document.body.removeChild(a);
		toast.send('Exported wishlist', { duration: 3000, type: ToastType.INFO });
	}

	function clearWishlist() {
		if ($wishlistStore.length > 0) {
			boredState.update((n) => ({
				...n,
				dialog: { isOpen: true, content: ClearWishlistDialog }
			}));
		} else {
			toast.send('Nothing to clear', { duration: 3000, type: ToastType.ERROR });
		}
	}
</script>

<div>
	<div>
		<span class="wishlist-title"
			><a href="/wishlist" title="Go to your wishlist">Your Wishlist</a></span
		>
	</div>
	<div class="wishlist-buttons">
		<button type="button" aria-label="Export Wishlist" on:click={() => exportWishlist()}
			><ShareIcon width="24" height="24" />Export</button
		>
		<button type="button" aria-label="Save Wishlist" on:click={() => saveWishlist()}
			><SaveIcon width="24" height="24" />Save</button
		>
		<button type="button" aria-label="Clear saved wishlist" on:click={() => clearWishlist()}>
			<TrashIcon width="24" height="24" />Clear
		</button>
	</div>
</div>

<style lang="scss">
	:global(.wishlist-title) {
		padding-bottom: var(--spacing-8);
		font-size: var(--font-24);
		font-weight: 700;
		line-height: 32px;
	}

	:global(.wishlist-buttons) {
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
