<script lang="ts">
	import 'iconify-icon';
	import Transition from '$lib/components/transition/index.svelte';
	import Header from '$lib/components/header/index.svelte';
	import Footer from '$lib/components/footer.svelte';

	export let data;
</script>

<Header user={data.user} />

<main>
	<Transition url={data.url} transition={{ type: 'page' }}>
		<slot />
	</Transition>
</main>

<Footer />

<style lang="postcss">
	.background {
		background: black;
		opacity: 0.8;
		cursor: none;
		inset: 0;
		position: fixed;
		z-index: 100;
	}

	/* .wrapper {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
	} */

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
