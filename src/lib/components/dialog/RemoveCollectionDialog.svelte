<script lang="ts">
import { browser } from '$app/environment'
// import { Button, buttonVariants } from '$components/ui/button';
import { Button, buttonVariants } from '$components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '$components/ui/dialog'
import { boredState } from '$lib/stores/boredState'
import { collectionStore } from '$lib/stores/collectionStore'
import { removeFromCollection } from '$lib/utils/manipulateCollection'
import { fade } from 'svelte/transition'

function removeGame() {
	if ($boredState?.dialog?.additionalData) {
		removeFromCollection($boredState?.dialog?.additionalData)
	}
	if (browser) {
		localStorage.collection = JSON.stringify($collectionStore)
	}
	boredState.update((n) => ({ ...n, dialog: { isOpen: false } }))
}

$: isOpen = $boredState?.dialog?.isOpen
</script>

<Dialog modal={true}>
  <DialogTrigger class={buttonVariants({ variant: "outline" })}>
    Remove from collection
  </DialogTrigger>
  <DialogContent class="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Remove from collection</DialogTitle>
      <DialogDescription>
        Are you sure you want to remove from your collection?
      </DialogDescription>
    </DialogHeader>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label class="text-right">Name</Label>
        <Input id="name" value="Pedro Duarte" class="col-span-3" />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label class="text-right">Username</Label>
        <Input id="username" value="@peduarte" class="col-span-3" />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit">Remove</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


<!-- <Dialog
	open={isOpen}
	on:close={() => {
		boredState.update((n) => ({ ...n, dialog: { isOpen: false } }));
	}}
	static
>
	<div transition:fade|global>
		<DialogOverlay class="dialog-overlay" />
		<div class="dialog">
			<DialogTitle>Remove from collection</DialogTitle>
			<DialogDescription>Are you sure you want to remove from your collection?</DialogDescription>

			<div class="dialog-footer">
				<button class="remove" on:click={removeGame}>Remove</button>
				<button
					on:click={() => {
						boredState.update((n) => ({ ...n, dialog: { isOpen: false } }));
					}}>Cancel</button
				>
			</div>
		</div>
	</div>
</Dialog> -->

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
