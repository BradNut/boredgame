<script lang="ts">
	import type { ActionData } from './$types';
	import { boredState } from '$lib/stores/boredState';

	export let form: ActionData;
	console.log('advanced search form', form);
	let submitting = $boredState?.loading;
	let minAge = form?.minAge || 1;
	let minPlayers = form?.minPlayers || 1;
	let maxPlayers = form?.maxPlayers || 1;
	let exactMinPlayers = form?.exactMinPlayers || false;
	let exactMaxPlayers = form?.exactMaxPlayers || false;
</script>

<fieldset class="advanced-search" aria-busy={submitting} disabled={submitting}>
	<div>
		<label for="minAge">
			Min Age
			<input id="minAge" name="minAge" bind:value={minAge} type="number" min="1" max="120" />
		</label>
	</div>
	<div>
		<label for="minPlayers">
			Min Players
			<input
				id="minPlayers"
				name="minPlayers"
				bind:value={minPlayers}
				type="number"
				min="1"
				max="50"
			/>
		</label>
		<label for="exactMinPlayers" style="display: flex; gap: 1rem; place-items: center;">
			<span>Exact?</span>
			<input
				id="exactMinPlayers"
				type="checkbox"
				name="exactMinPlayers"
				bind:checked={exactMinPlayers}
			/>
		</label>
		{#if form?.error?.id === 'minPlayers'}
			<p aria-label={`Error: ${form.error.message}`} class="center error">
				Error: {form.error.message}
			</p>
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
				min="1"
				max="50"
			/>
		</label>
		<label for="exactMaxPlayers" style="display: flex; gap: 1rem; place-items: center;">
			<span>Exact?</span>
			<input
				id="exactMaxPlayers"
				type="checkbox"
				name="exactMaxPlayers"
				bind:checked={exactMaxPlayers}
			/>
		</label>
		{#if form?.error?.id === 'maxPlayers'}
			<p aria-label={`Error: ${form.error.message}`} class="center error">
				Error: {form.error.message}
			</p>
		{/if}
	</div>
</fieldset>
<!-- <button type="submit" disabled={submitting}>Submit</button> -->

<!-- </form> -->
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
