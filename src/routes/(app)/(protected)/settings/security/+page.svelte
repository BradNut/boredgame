<script>
import { Button } from '$components/ui/button/index'
import { KeyRound } from 'lucide-svelte'

const { data } = $props()

const hasSetupTwoFactor = data.hasSetupTwoFactor
</script>

<div class="mt-6">
	{#if !hasSetupTwoFactor}
		<p>Multi Factor Authentication is: <strong>Disabled</strong></p>
		<Button variant="link" class="text-secondary-foreground" href="/settings/security/mfa">
			<KeyRound class="mr-2 h-4 w-4" />
			Setup Multi-factor Authentication
		</Button>
	{:else}
		<p>Multi Factor Authentication is: <strong>Enabled</strong></p>
		<Button variant="link" class="text-secondary-foreground" href="/settings/security/mfa">
			<KeyRound class="mr-2 h-4 w-4" />
			Disable Multi-factor Authentication
		</Button>
	{/if}
</div>
<div class="mt-6">
	<Button variant="link" class="text-secondary-foreground" href="/settings/security/change/password">
		<KeyRound class="mr-2 h-4 w-4" />
		Change Password
	</Button>
</div>