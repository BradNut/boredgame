<script lang="ts">
	import type { Validation } from 'sveltekit-superforms/index';
	import type { SearchSchema } from '$lib/zodValidation';
	import { boredState } from '$lib/stores/boredState';
	import { gameStore } from '$lib/stores/gameSearchStore';
	import { ToastType } from '$lib/types';
  import { superForm } from 'sveltekit-superforms/client';
	import { toast } from '../../toast/toast';

	export let data: Validation<SearchSchema>;
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
		<button class="btn" type="submit" disabled={submitting}>Random Game 🎲</button>
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
