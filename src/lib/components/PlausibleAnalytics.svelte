<script lang="ts">
import { PUBLIC_SITE_URL } from '$env/static/public'
const src = `${PUBLIC_SITE_URL}/js/script.js`
const dataDomain = PUBLIC_SITE_URL.replace('https://', '').replace('http://', '')
</script>

<svelte:head>
	<script
			defer
			data-domain={dataDomain}
			{src}
	></script>
</svelte:head>
