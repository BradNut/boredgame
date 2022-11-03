<script lang="ts">
	import { fade } from 'svelte/transition';
	import {
		Dialog,
		DialogDescription,
		DialogOverlay,
		DialogTitle
	} from '@rgossiaux/svelte-headlessui';
	import { boredState } from '$root/lib/stores/boredState';

	$: isOpen = $boredState?.dialog?.isOpen;
</script>

<Dialog
	open={isOpen}
	on:close={() => {
		boredState.update((n) => ({ ...n, dialog: { ...n.dialog, isOpen: false } }));
	}}
	static
>
	<div transition:fade>
		<DialogOverlay class="dialog-overlay" />
		<div class="dialog">
			<DialogTitle>Default Dialog</DialogTitle>
			<DialogDescription>Dialog Description</DialogDescription>

			<div class="dialog-footer" />
		</div>
	</div>
</Dialog>

<style lang="scss">
	.dialog {
		display: grid;
		gap: 1.5rem;
		position: fixed;
		top: 35%;
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
		}
	}
</style>
