<script lang="ts">
import * as Card from '$components/ui/card'
const { data } = $props()
let collections = data?.collections || []
</script>

<svelte:head>
	<title>Your Collections | Bored Game</title>
</svelte:head>

<div class="container">
<h1>Your Collections</h1>

	<div class="collection-list">
		{#if collections.length === 0}
			<h2>You have no collections</h2>
		{:else}
			{#each collections as collection}
				<Card.Root>
					<Card.Header>
						<Card.Title>{collection.name}</Card.Title>
					</Card.Header>
					<Card.Content>
						<p>Number of items:</p>
						<p>Created at: {new Date(collection.createdAt).toLocaleString()}</p>
					</Card.Content>
				</Card.Root>
				<!-- <div class="collection grid gap-0.5">
					<h2><a href="/collections/{collection.cuid}">{collection.name}</a></h2>
					<h3>Created at: {new Date(collection.createdAt).toLocaleString()}</h3>
				</div> -->
			{/each}
		{/if}
	</div>
</div>

<style lang="postcss">
	h1 {
		margin: 1.5rem 0;
		width: 100%;
	}

	.collection-list {
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
