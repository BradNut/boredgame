<script lang="ts">
	import Transition from '$lib/components/transition/index.svelte';

	export let data;
	const wishlists = data.wishlists || [];
</script>


	<aside class="wishlists">
		<h2>Your Wishlists</h2>
		<div class="separator"></div>
		{#each wishlists as wishlist}
			<h2 class="wishlist"><a href={`/wishlist/${wishlist.id}`}>{wishlist.name}</a></h2>
		{/each}
	</aside>
	<div class="content">
		<Transition url={data.url} transition={{ type: 'page' }}>
			<slot />
		</Transition>
	</div>


<style lang="postcss">
	.wishlists {
		position: fixed;
		left: 0;
		padding-left: 2rem;
	}

	.separator {
		margin: 5px 0;
    height: 1px;
    --tw-bg-opacity: 1;
    background-color: rgba(0, 0, 0, 1);
    background-color: rgba(0, 0, 0, var(--tw-bg-opacity));
	}

	.wishlist {
		margin-bottom: 1rem;
	}
</style>