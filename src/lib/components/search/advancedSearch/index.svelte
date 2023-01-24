<script lang="ts">
	import type { ActionData } from './$types';
	import { boredState } from '$lib/stores/boredState';
  import type { PageData } from '.svelte-kit/types/src/routes/$types';

	export let data: PageData;

	let submitting = $boredState?.loading;
	let minAge = +data?.minAge || 1;
	let minPlayers = +data?.minPlayers || 1;
	let maxPlayers = +data?.maxPlayers || 1;
	let exactMinPlayers = Boolean(data?.exactMinPlayers) || false;
	let exactMaxPlayers = Boolean(data?.exactMaxPlayers) || false;
</script>

<fieldset class="advanced-search" aria-busy={submitting} disabled={submitting}>
	<div>
		<label for="minAge">
			Min Age
			<input id="minAge" name="minAge" bind:value={minAge} type="number" min={1} max={120} />
		</label>
		{#if data?.errors?.minAge}
			<div id="minPlayers-error" class="error">
				<p aria-label={`Error: ${data?.errors?.minAge}`} class="center">
					{data?.errors?.minAge}
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
		{#if data?.errors?.minPlayers}
			<div id="minPlayers-error" class="error">
				<p aria-label={`Error: ${data?.errors?.minPlayers}`} class="center">
					{data?.errors?.minPlayers}
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
		{#if data?.error?.id === 'maxPlayers'}
			<div id="maxPlayers-error" class="error">
				<p aria-label={`Error: ${data.error.message}`} class="center">
					Error: {data.error.message}
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
