<script lang="ts">
import 'iconify-icon'
import Footer from '$components/Footer.svelte'
import Header from '$components/Header.svelte'

const { data, children } = $props()
</script>

<div class="flex min-h-screen w-full flex-col">
	<Header user={data.authedUser} />

	<main
			class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10"
	>
		{@render children()}
	</main>

	<Footer />
</div>

<style lang="postcss">
	/*main {*/
	/*	flex: 1;*/
	/*	display: flex;*/
	/*	flex-direction: column;*/
	/*	max-width: 850px;*/
	/*	margin: 0 auto;*/
	/*	padding: 2rem 0rem;*/
	/*	max-width: 80vw;*/

	/*	@media (min-width: 1600px) {*/
	/*		max-width: 70vw;*/
	/*	}*/

	/*	box-sizing: border-box;*/
	/*}*/

	:global(.dialog-overlay) {
		position: fixed;
		inset: 0;
		z-index: 100;
		background-color: rgb(0 0 0);
		opacity: 0.8;
	}
</style>
