<script lang="ts">
	import { boredState } from '$lib/stores/boredState';

	export let form;
	export let errors;
	export let constraints;
	console.log('advanced search data', $form);

	let submitting = $boredState?.loading;
	let minAge = +$form?.minAge || 1;
	let minPlayers = +$form?.minPlayers || 1;
	let maxPlayers = +$form?.maxPlayers || 1;
	let exactMinPlayers = Boolean($form?.exactMinPlayers) || false;
	let exactMaxPlayers = Boolean($form?.exactMaxPlayers) || false;
</script>

<fieldset class="advanced-search" aria-busy={submitting} disabled={submitting}>
	<div>
		<label for="minAge">
			Min Age
			<input id="minAge" name="minAge" bind:value={minAge} type="number" min={1} max={120} />
		</label>
		{#if $errors?.minAge}
			<div id="minPlayers-error" class="error">
				<p aria-label={`Error: ${$errors?.minAge}`} class="center">
					{$errors?.minAge}
				</p>
			</div>
		{/if}
	</div>
	<div>
		<label for="minPlayers">
			Min Players
			<input
				id="minPlayers"
				name="minPlayers"
				bind:value={minPlayers}
				type="number"
				min={1}
				max={50}
			/>
		</label>
		<label for="exactMinPlayers" style="display: flex; gap: 1rem; place-items: center;">
			<span>Exact?</span>
			<input
				id="exactMinPlayers"
				type="checkbox"
				name="exactMinPlayers"
				bind:checked={exactMinPlayers}
				bind:value={exactMinPlayers}
			/>
		</label>
		{#if $errors?.minPlayers}
			<div id="minPlayers-error" class="error">
				<p aria-label={`Error: ${$errors?.minPlayers}`} class="center">
					{$errors?.minPlayers}
				</p>
			</div>
		{/if}
	</div>
	<div>
		<label for="maxPlayers">
			Max Players
			<input
				id="maxPlayers"
				name="maxPlayers"
				bind:value={maxPlayers}
				type="number"
				min={1}
				max={50}
			/>
		</label>
		<label for="exactMaxPlayers" style="display: flex; gap: 1rem; place-items: center;">
			<span>Exact?</span>
			<input
				id="exactMaxPlayers"
				type="checkbox"
				name="exactMaxPlayers"
				bind:checked={exactMaxPlayers}
				bind:value={exactMaxPlayers}
			/>
		</label>
		{#if $errors?.id === 'maxPlayers'}
			<div id="maxPlayers-error" class="error">
				<p aria-label={`Error: ${$errors.message}`} class="center">
					Error: {$errors.message}
				</p>
			</div>
		{/if}
	</div>
</fieldset>

<style lang="scss">
	fieldset {
		display: grid;
		grid-template-columns: repeat(3, 1fr);

		@media (max-width: 800px) {
			grid-template-columns: 1fr;
		}
	}

	label {
		display: grid;
		margin: 1rem;
	}
</style>
