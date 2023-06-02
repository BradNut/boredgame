<script lang="ts">
	import { browser } from '$app/environment';
	import { boredState } from '$lib/stores/boredState';
	import { wishlistStore } from '$lib/stores/wishlistStore';
	import DefaultDialog from './DefaultDialog.svelte';

	function clearWishlist() {
		if (browser) {
			localStorage.wishlist = JSON.stringify([]);
			wishlistStore.removeAll();
		}
		boredState.update((n) => ({ ...n, dialog: { isOpen: false } }));
	}

	function stopLoading() {
		boredState.update((n) => ({ ...n, dialog: { isOpen: false } }));
	}
</script>

<DefaultDialog
	title="Clear wishlist"
	description="Are you sure you want to clear your wishlist?"
	danger
	primaryButtonText="Clear"
	secondaryButtonText="Cancel"
	on:click:primary={clearWishlist}
	on:click:secondary={stopLoading}
	on:close={stopLoading}
/>

<style lang="postcss">
	.dialog {
		display: grid;
		gap: 1.5rem;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 101;
		border-radius: 10px;
		background-color: var(--clr-input-bg);
		padding: 2rem;
		min-width: 400px;

		.dialog-footer {
			display: flex;
			justify-content: space-between;
			gap: 2rem;
			margin: 1rem 0;

			& button {
				display: flex;
				place-content: center;
				gap: 1rem;
				width: 100%;
				border-radius: 10px;
				padding: 1rem;
				background-color: var(--color-btn-primary-active);

				&:hover {
					background-color: var(--color-btn-primary-active-hover);
				}
			}

			.remove {
				background-color: var(--warning);

				&:hover {
					background-color: var(--warning-hover);
				}
			}
		}
	}
</style>
