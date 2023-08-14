<script lang="ts">
	import { enhance } from "$app/forms";
	import { fly } from "svelte/transition";
	import { createSelect, melt } from "@melt-ui/svelte";
	import { Check, ChevronDown, MinusCircle, PlusCircle } from "lucide-svelte";
	import Button from "./ui/button/Button.svelte";
	import type { Collection, Wishlist } from "@prisma/client";

	export let game_id: string;
	export let collection: Collection;
	export let wishlist: Wishlist;
	export let in_wishlist = false;
	export let in_collection = false;
	export let lists = [];

	// const handleChange = ({ curr, next }) => {
	// 	console.log({ curr, next });
	// 	return next;
	// }

	// const {
	// 	elements: { trigger, menu, option, label, group, groupLabel },
	// 	states: { valueLabel, open },
	// 	helpers: { isSelected },
	// } = createSelect({
	// 	forceVisible: true,
	// 	onValueChange: handleChange
	// });

	// console.log({ in_collection, in_wishlist });

	// let options: Record<string, string> = {};
	// let list_of_lists = [];
	// if (!in_collection) {
	// 	options[collection.id] = 'Add to collection';
	// }
	// if (!in_wishlist) {
	// 	options[wishlist.id] = 'Add to wishlist';
	// }
	// lists.forEach((list) => {
	// 	if (!list?.in_list) {
	// 		options[list.id] = list.name;
	// 	}
	// });
</script>

<div class="flex gap-1">
	{#if in_wishlist}
		<form method="POST" action={`/wishlist?/remove`} use:enhance>
			<input type="hidden" name="id" value={game_id} />
			<Button class="flex gap-1" variant="destructive" type="submit">
				<MinusCircle class="square-5" /> Remove from wishlist
			</Button>
		</form>
	{:else}
		<form method="POST" action='/wishlist?/add' use:enhance>
			<input type="hidden" name="id" value={game_id} />
			<Button class="flex gap-1" type="submit">
				<PlusCircle class="square-5" /> Add to wishlist
			</Button>
		</form>
	{/if}

	{#if in_collection}
		<form method="POST" action='/collection?/remove' use:enhance>
			<input type="hidden" name="id" value={game_id} />
			<Button class="flex gap-1" type="submit" variant="destructive">
				<MinusCircle class="square-5" /> Remove from collection
			</Button>
		</form>
	{:else}
		<form method="POST" action='/collection?/add' use:enhance>
			<input type="hidden" name="id" value={game_id} />
			<Button class="flex gap-1" type="submit">
				<PlusCircle class="square-5" /> Add to collection
			</Button>
		</form>
	{/if}
</div>

<!-- <div class="flex flex-col gap-1"> -->
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<!-- <button
		class="flex h-10 min-w-[220px] items-center justify-between rounded-md bg-white px-3 py-2 text-black-500 transition-opacity hover:opacity-90"
		use:melt={$trigger}
		aria-label="Wishlist"
	>
		{$valueLabel || 'Add to...'}
		<ChevronDown class="square-5" />
	</button>
	{#if $open}
		<div
			class="z-10 flex max-h-[360px] flex-col overflow-y-auto rounded-md bg-white p-1 focus:!ring-0"
			use:melt={$menu}
			transition:fly={{ duration: 150, y: -5 }}
		>
			{#each Object.entries(options) as [key, value]}
				<div
						class="flex relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800 focus:z-10 focus:text-purple-700 data-[highlighted]:bg-purple-50 data-[selected]:bg-purple-100 data-[highlighted]:text-purple-900 data-[selected]:text-purple-900"
						use:melt={$option({ value: key, label: value })}
					>
						{value}
						{#if $isSelected(key)}
							<div class="check">
								<Check class="square-4" />
							</div>
						{/if}
					</div>
			{/each}
		</div>
	{/if}
</div> -->