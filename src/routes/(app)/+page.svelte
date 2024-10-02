<script lang="ts">
const { data } = $props()
const { user, wishlists = [], collections = [] } = data

const welcomeName = $derived.by(() => {
	let welcomeName = ''
	if (data?.user?.firstName) {
		welcomeName += data?.user?.firstName
	}
	if (data?.user?.lastName) {
		welcomeName = welcomeName.length === 0 ? data?.user?.lastName : welcomeName
	}

	if (welcomeName.length === 0) {
		return user?.username
	}

	return welcomeName
})
</script>

<div class="container">
	{#if user}
		<h1>Welcome, {welcomeName}!</h1>
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
		<h2>Track the board gamesTable you own, the ones you want, and whether you play them enough.</h2>
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
		margin-left: auto;
		margin-right: auto;
	}
</style>
