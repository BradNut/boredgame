<script lang="ts">
	import { type SvelteComponent, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	// import {
	// 	Dialog,
	// 	DialogDescription,
	// 	DialogOverlay,
	// 	DialogTitle
	// } from '@rgossiaux/svelte-headlessui';
	import { boredState } from '$lib/stores/boredState';

	export let title: string;
	export let description: string;
	export let danger = false;
	export let alert = false;
	export let passive = false;
	export let primaryButtonText = '';
	export let primaryButtonDisabled = false;
	export let primaryButtonIcon: typeof SvelteComponent<any> = undefined;
	export let primaryButtonIconDescription = '';
	export let secondaryButtonText = '';

	const dispatch = createEventDispatcher();

	$: isOpen = $boredState?.dialog?.isOpen;
</script>

<!-- <Dialog
	open={isOpen}
	on:close={() => {
		dispatch('close');
	}}
	static
> -->
	<div transition:fade|global>
		<!-- <DialogOverlay class="dialog-overlay" /> -->
		<div class="dialog">
			<!-- <DialogTitle>{title}</DialogTitle> -->
			{#if description}
				<!-- <DialogDescription>{description}</DialogDescription> -->
			{/if}

			<div class="dialog-footer">
				<button
					disabled={primaryButtonDisabled}
					class={danger ? 'danger' : 'primary'}
					on:click={() => {
						dispatch('click:secondary');
					}}
				>
					{#if primaryButtonIcon}
						<svelte:component
							this={primaryButtonIcon}
							aria-hidden="true"
							class="button-icon"
							aria-label={primaryButtonIconDescription}
						/>
					{/if}
					<span>
						{primaryButtonText}
					</span>
				</button>

				<button
					on:click={() => {
						dispatch('submit');
						dispatch('click:primary');
					}}
				>
					{secondaryButtonText}
				</button>
			</div>
		</div>
	</div>
<!-- </Dialog> -->

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

			.danger {
				background-color: var(--warning);

				&:hover {
					background-color: var(--warning-hover);
				}
			}
		}
	}
</style>
