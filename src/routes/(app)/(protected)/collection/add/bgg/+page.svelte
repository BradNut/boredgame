<script lang="ts">
	import GameSearchForm from "$components/search/GameSearchForm.svelte";
	import Input from "$components/ui/input/input.svelte";
	import Label from "$components/ui/label/label.svelte";

	export let data;
</script>
<h1>Add a game to your collection</h1>

<form method="POST" action="/collection/add/bgg">
	<Label for="url">Board Game Geek URL</Label>
	<Input type="url" id="url" name="url" placeholder="https://boardgamegeek.com/boardgame/123"/>
	<button type="submit">Add Game</button>
</form>
