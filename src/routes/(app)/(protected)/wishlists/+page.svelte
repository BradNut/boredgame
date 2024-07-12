<script lang="ts">
	export let data;
	let wishlists = data?.wishlists || [];
</script>

<svelte:head>
	<title>Your Wishlists | Bored Game</title>
</svelte:head>

<h1>Your wishlists</h1>

<div class="wishlists">
	<div class="wishlist-list">
		{#if wishlists.length === 0}
			<h2>You have no wishlists</h2>
		{:else}
			{#each wishlists as wishlist}
				<div class="collection grid gap-0.5">
					<h2><a href="/wishlists/{wishlist.cuid}">{wishlist.name}</a></h2>
					<h3>Created at: {new Date(wishlist.created_at).toLocaleString()}</h3>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style lang="postcss">
	h1 {
		margin: 1.5rem 0;
		width: 100%;
	}

	.wishlists {
		margin: 2rem 0;
	}

	.wishlist-list {
		display: grid;
		grid-template-columns: repeat(3, minmax(200px, 1fr));
		gap: 2rem;

		@media (max-width: 800px) {
			grid-template-columns: 1fr 1fr;
		}

		@media (max-width: 550px) {
			grid-template-columns: 1fr;
		}
	}
</style>
