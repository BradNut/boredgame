<script lang="ts">
	export let kind = 'primary';
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
		border-radius: 10px;
		margin: 0;
		padding: 1rem;
		min-width: 20rem;
		max-width: 30rem;
		min-height: 6.2rem;
		text-align: start;
		background-color: var(--color-btn-primary-active);

		@media (min-width: 1000px) {
			min-width: 23.5rem;
		}
	}
</style>
