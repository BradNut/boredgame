<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms/index';
	import type { SearchSchema } from '$lib/zodValidation';
	import { boredState } from '$lib/stores/boredState';
	import { gameStore } from '$lib/stores/gameSearchStore';
  import { superForm } from 'sveltekit-superforms/client';
	import { Button } from '$components/ui/button';

	export let data: SuperValidated<SearchSchema>;
	const { enhance } = superForm(data, {
		onSubmit: () => {
			gameStore.removeAll();
			boredState.update((n) => ({ ...n, loading: true }));
		},
		onResult: ({ result, formEl, cancel }) => {
			boredState.update((n) => ({ ...n, loading: false }));
			if (result.type === 'success') {
				gameStore.addAll(result?.data?.searchData?.games);
			} else {
				cancel();
			}
		},
		// onUpdated: ({ form }) => {
		// 	if ($gameStore.length <= 0) {
		// 		toast.send('No results found 😿', {
		// 			duration: 3000,
		// 			type: ToastType.ERROR,
		// 			dismissible: true
		// 		});
		// 	}
		// }
	});

	let submitting = $boredState?.loading;
</script>

<form
	action="/search?/random"
	method="POST"
	use:enhance
>
	<fieldset aria-busy={submitting} disabled={submitting}>
		<Button type="submit" disabled={submitting}>Random Game 🎲</Button>
		<!-- <button class="btn" type="submit" disabled={submitting}>Random Game 🎲</button> -->
	</fieldset>
</form>

<style lang="scss">
	fieldset {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}

	button {
		max-width: 450px;
		padding: var(--spacing-8) var(--spacing-16);
	}
</style>
