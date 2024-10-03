<script lang="ts">
import { Button } from '$lib/components/ui/button'
import { toastMessage } from '$lib/utils/superforms' // Adjust the path if necessary

const { codeContent, language }: { codeContent: string; language: string } = $props()

// Function to copy code to clipboard
const copyToClipboard = () => {
	navigator.clipboard
		.writeText(codeContent)
		.then(() => {
			toastMessage({ text: 'Copied to clipboard!', type: 'success' })
		})
		.catch((err) => {
			console.error('Failed to copy: ', err)
		})
}
</script>

{#if codeContent}
	<div class="code-container">
		<code data-language={language}>
			<span>
				{codeContent}
			</span>
		</code>
		<Button class="copy-button" on:click={copyToClipboard}>Copy</Button>
	</div>
{/if}

<style lang="postcss">
	.code-container {
		display: flex;
		gap: var(--spacing-8);
		margin-top: var(--spacing-24);
	}
</style>