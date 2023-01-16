<script lang="ts">
	export let kind = 'primary';
	export let size;
	export let icon = false;
	export let disabled = false;
</script>

<button class={`btn ${icon ? 'btn-icon' : ''} ${kind}`} type="button" {disabled} on:click>
	<slot />
</button>

<style lang="postcss">
	button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 4px;
		margin: 0;
		padding: 1rem;
		min-width: 20rem;
		max-width: 30rem;
		min-height: 6.2rem;
		text-align: start;
		background-color: var(--color-btn-primary-active);

		@media (min-width: env(--large-viewport)) {
			min-width: 23.5rem;
		}
	}

	.danger {
		background-color: var(--warning);
	}

	.danger:hover {
		background-color: var(--warning-hover);
	}

	.btn-icon {
		display: grid;
		grid-template-columns: repeat(2, auto);
		gap: 1rem;
	}
</style>
