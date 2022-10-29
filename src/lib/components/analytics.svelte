<script lang="ts">
	import { PUBLIC_UMAMI_DO_NOT_TRACK, PUBLIC_UMAMI_URL, PUBLIC_UMAMI_ID } from '$env/static/public';
	const analyticsURL = `https://${PUBLIC_UMAMI_URL}/umami.js`;
</script>

<svelte:head>
	<script
		async
		defer
		data-website-id={PUBLIC_UMAMI_ID}
		data-do-not-track={PUBLIC_UMAMI_DO_NOT_TRACK}
		src={analyticsURL}
	></script>
</svelte:head>
