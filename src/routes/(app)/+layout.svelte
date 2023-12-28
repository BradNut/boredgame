<script lang="ts">
	import 'iconify-icon';
	import Header from '$components/Header.svelte';
	import Footer from '$components/Footer.svelte';

	export let data;
</script>

<Header user={data.user} />

<main>
	<slot />
</main>

<Footer />

<style lang="postcss">
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		max-width: 850px;
		margin: 0 auto;
		padding: 2rem 0rem;
		max-width: 80vw;

		@media (min-width: 1600px) {
			max-width: 70vw;
		}

		box-sizing: border-box;
	}

	:global(.dialog-overlay) {
		position: fixed;
		inset: 0;
		z-index: 100;
		background-color: rgb(0 0 0);
		opacity: 0.8;
	}
</style>
