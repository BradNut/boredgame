<script lang="ts">
	export let data;

	const { user, wishlists = [], collections = []} = data;
</script>

<div class="container">
	{#if user}
		<h1>Welcome, {user.username}!</h1>
		<div>
			<h2>You wishlists:</h2>
			{#each wishlists as wishlist}
				<a href="/wishlists/{wishlist.cuid}">{wishlist.name}</a>
			{/each}
		</div>
		<div>
			<h2>Your collections:</h2>
			{#each collections as collection}
				<a href="/collections/{collection.cuid}">{collection.name}</a>
			{/each}
		</div>
	{:else}
		<h1>Welcome to Bored Game!</h1>
		<h2>Track the board games you own, the ones you want, and whether you play them enough.</h2>
		<p>Get started by joining the <a href="/waitlist">wait list</a> or <a href="/login">log in</a> if you already have an account.</p>
	{/if}
</div>

<style lang="postcss">
	a {
		text-decoration: underline;
	}

	.container {
		display: grid;
		place-content: center;
		max-width: 900px;
		gap: 0.25rem;
	}
</style>
