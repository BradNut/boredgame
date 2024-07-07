<script lang="ts">
	const { url, ariaLabel = `Link to ${url}`, external = false, children }: { url: string; ariaLabel?: string; external?: boolean; children: any } = $props();
</script>

<a
	href={url}
	target={external ? '_blank' : '_self'}
	rel="noreferrer"
	aria-label={`Board Game Atlas Link for ${ariaLabel}`}
>
	{@render children()}
</a>

<style>
	a {
		display: grid;
		grid-template-columns: repeat(2, auto);
		place-items: center;
		gap: 0.25rem;
		margin: 1rem;
	}
</style>
