<script lang="ts">
	import type { SvelteComponentTyped } from 'svelte';

	export let url: string;
	export let ariaLabel = `Link to ${url}`;
	export let external = false;
</script>

<a
	href={url}
	target={external ? '_blank' : '_self'}
	rel="noreferrer"
	aria-label={`Board Game Atlas Link for ${ariaLabel}`}
>
	<slot />
</a>

<style>
	a {
		display: grid;
		grid-template-columns: repeat(2, auto);
		place-items: center;
		gap: 0.25rem;
	}
</style>
