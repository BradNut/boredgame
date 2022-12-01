<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { boredState } from '$lib/stores/boredState';
	import { gameStore } from '$lib/stores/gameSearchStore';
	import { ToastType } from '$root/lib/types';
	import { toast } from '../../toast/toast';

	// async function handleSubmit(event: SubmitEvent) {
	// 	// submitting = true;
	// 	boredState.update((n) => ({ ...n, loading: true }));
	// 	const form = event.target as HTMLFormElement;
	// 	console.log('form', form);
	// 	const response = await fetch('/api/games', {
	// 		method: 'POST',
	// 		headers: { accept: 'application/json' },
	// 		body: new FormData(form)
	// 	});
	// 	const responseData = await response.json();
	// 	// submitting = false;
	// 	boredState.update((n) => ({ ...n, loading: false }));
	// 	gameStore.removeAll();
	// 	gameStore.addAll(responseData?.games);
	// 	// games = responseData?.games;
	// }

	let submitting = $boredState?.loading;
	let checked = true;
</script>

<form
	action="/search"
	method="POST"
	use:enhance={() => {
		gameStore.removeAll();
		boredState.update((n) => ({ ...n, loading: true }));
		return async ({ result }) => {
			console.log('result', result);
			boredState.update((n) => ({ ...n, loading: false }));
			// `result` is an `ActionResult` object
			if (result.type === 'success') {
				// console.log('In success');
				const resultGames = result?.data?.games;
				if (resultGames?.length <= 0) {
					toast.send('No results found 😿', {
						duration: 3000,
						type: ToastType.ERROR,
						dismissible: true
					});
				}
				gameStore.addAll(resultGames);
				// console.log(`Frontend result random: ${JSON.stringify(result)}`);
				await applyAction(result);
			} else {
				// console.log('Invalid');
				await applyAction(result);
			}
		};
	}}
>
	<fieldset aria-busy={submitting} disabled={submitting}>
		<input type="checkbox" id="random" name="random" hidden {checked} />
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
