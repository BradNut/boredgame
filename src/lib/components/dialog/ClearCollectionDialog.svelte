<script lang="ts">
	import { fade } from 'svelte/transition';
	import {
		Dialog,
		DialogDescription,
		DialogOverlay,
		DialogTitle
	} from '@rgossiaux/svelte-headlessui';
	import { boredState } from '$lib/stores/boredState';
	import { collectionStore } from '$lib/stores/collectionStore';
	import { browser } from '$app/environment';

	function clearCollection() {
		if (browser) {
			localStorage.collection = JSON.stringify([]);
			collectionStore.removeAll();
		}
		boredState.update((n) => ({ ...n, dialog: { isOpen: false } }));
	}

	$: isOpen = $boredState?.dialog?.isOpen;
</script>

<Dialog
	open={isOpen}
	on:close={() => {
		boredState.update((n) => ({ ...n, dialog: { isOpen: false } }));
	}}
	static
>
	<div transition:fade>
		<DialogOverlay class="dialog-overlay" />
		<div class="dialog">
			<DialogTitle>Clear collection</DialogTitle>
			<DialogDescription>Are you sure you want to clear your collection?</DialogDescription>

			<div class="dialog-footer">
				<button class="remove" on:click={clearCollection}>Clear</button>
				<button
					on:click={() => {
						boredState.update((n) => ({ ...n, dialog: { isOpen: false } }));
					}}>Cancel</button
				>
			</div>
		</div>
	</div>
</Dialog>

<style lang="scss">
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

			button {
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
