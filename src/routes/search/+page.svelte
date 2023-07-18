<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { gameStore } from '$lib/stores/gameSearchStore';
	import TextSearch from '$lib/components/search/textSearch/index.svelte';

	export let data;
	console.log("search page data", data);

	// $: if (data?.searchData?.games) {
	// 	gameStore.removeAll();
	// 	gameStore.addAll(data?.searchData?.games);
	// }
</script>

<div class="game-search">
	<TextSearch showButton advancedSearch {data} />
</div>
