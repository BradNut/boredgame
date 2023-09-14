<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import logo from '$lib/assets/bored-game.png';

	export let title: string;
</script>

<Card.Root class="w-[350px]">
	<Card.Header>
		<Card.Title class="flex place-items-center gap-1"><div class="w-8 h-8"><img src={logo} alt="Bored Game" /></div>{title}</Card.Title>
	</Card.Header>
	<Card.Content>
		<slot />
	</Card.Content>
</Card.Root>