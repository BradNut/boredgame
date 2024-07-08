<script lang="ts">
	const { data } = $props();

	const { recoveryCodes } = data;
</script>

<h2>Two-Factor Authentication is <span class="text-green-500">enabled</span></h2>
{#if recoveryCodes && recoveryCodes.length > 0}
	{#if recoveryCodes.length > 0}
		Please copy the recovery codes below as they will not be shown again.
		{#each recoveryCodes as code}
			<p>{code}</p>
		{/each}
	{/if}
{:else}
	<h2>You have already viewed your recovery codes.</h2>
	<p>If you wish to generate new codes, please disable and then re-enable two-factor authentication.</p>
{/if}