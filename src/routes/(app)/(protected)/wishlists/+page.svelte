<script lang="ts">
import * as Card from '$components/ui/card'

const { data } = $props()
const { wishlists = [] } = data
</script>

<svelte:head>
	<title>Your Wishlists | Bored Game</title>
</svelte:head>

<div class="container">
	<h1>Your wishlists</h1>

	<div class="wishlist-list">
		{#if wishlists.length === 0}
			<h2>You have no wishlists</h2>
		{:else}
			{#each wishlists as wishlist}
					<Card.Root class="shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
						<a href="/wishlists/{wishlist.cuid}">
							<Card.Header>
								<Card.Title>{wishlist.name}</Card.Title>
							</Card.Header>
							<Card.Content>
								<h3>Created at: {new Date(wishlist.createdAt).toLocaleString()}</h3>
							</Card.Content>
						</a>
					</Card.Root>
			{/each}
		{/if}
	</div>
</div>

<style lang="postcss">
	h1 {
		margin: 1.5rem 0;
		width: 100%;
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
