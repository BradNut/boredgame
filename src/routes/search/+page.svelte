<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { gameStore } from '$lib/stores/gameSearchStore';
	import TextSearch from '$lib/components/search/textSearch/index.svelte';

	export let data: PageData;
	export let form: ActionData;

	$: if (data?.games) {
		gameStore.removeAll();
		gameStore.addAll(data?.games);
	}

	$: if (form?.games) {
		gameStore.removeAll();
		gameStore.addAll(form?.games);
	}
</script>

<div class="game-search">
	<TextSearch showButton advancedSearch {data} {form} />
</div>
