<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="error">
	{#if $page.status === 404}
		<h1>The page you requested doesn't exist! 🤷‍♂️</h1>
		<h3 class="mt-6"><a href="/">Go Home</a></h3>
	{:else}
		<h1 class="h1">Unexpected Error</h1>
		<h3 class="mt-6">We're investigating the issue.</h3>
	{/if}

	{#if $page.error?.errorId}
		<p class="mt-6">Error ID: {$page.error.errorId}</p>
	{/if}
</div>

<style style="postcss">
	.error {
		display: grid;
		place-items: center;
		text-align: center;
		margin-top: 4rem;
	}

	h1 {
		font-size: 1.125rem;
		line-height: 1.75rem;
		font-weight: 600;
	}

	h3 {
		font-size: 1rem;
		line-height: 1.5rem;
		font-weight: 600;
	}
</style>
