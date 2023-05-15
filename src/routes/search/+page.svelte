<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { gameStore } from '$lib/stores/gameSearchStore';
	import TextSearch from '$lib/components/search/textSearch/index.svelte';

	export let data;
	const { form, errors, constraints } = superForm(data?.form);

	$: if (data?.searchData?.games) {
		gameStore.removeAll();
		gameStore.addAll(data?.searchData?.games);
	}
</script>

<div class="game-search">
	<TextSearch showButton advancedSearch {form} {errors} {constraints} />
</div>
