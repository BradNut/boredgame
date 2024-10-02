<script lang="ts">
import 'iconify-icon'
import Footer from '$components/Footer.svelte'
import Header from '$components/Header.svelte'

const { data, children } = $props()
</script>

<div class="flex min-h-screen w-full flex-col">
	<Header user={data.authedUser} />

	<main
			class="flex min-h-[calc(100vh-theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10"
	>
		{@render children()}
	</main>

	<Footer />
</div>

<style lang="postcss">
</style>
