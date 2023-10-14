<script lang="ts">
	import TextSearch from '$lib/components/search/textSearch/index.svelte';

	export let data;
	console.log("search page data", data);
</script>

<div class="game-search">
	<TextSearch showButton advancedSearch {data} />
</div>
