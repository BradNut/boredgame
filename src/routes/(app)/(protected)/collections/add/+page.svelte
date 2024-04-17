<script lang="ts">
	import GameSearchForm from "$components/search/GameSearchForm.svelte";

	export let data;
</script>
<h1>Add a game to your collection</h1>

<h2>Board Game Geek URL</h2>

<GameSearchForm form={data.form} />
