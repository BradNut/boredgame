<script lang="ts">
import { Badge } from '$components/ui/badge'
import { Button } from '$components/ui/button'
import * as Card from '$lib/components/ui/card'

const { data } = $props()

const totpEnabled = data.totpEnabled
const hardwareTokenEnabled = data.hardwareTokenEnabled
</script>

<h1>Two-factor authentication</h1>

<Card.Root>
	<Card.Header>
		<Card.Title>Two-Factor Methods</Card.Title>
	</Card.Header>
	<Card.Content>
		<section>
		<div class="two-factor-method">
			<div class="two-factor-method-content">
				<h2>Authenticator app {#if totpEnabled}<Badge variant="outline" className="text-green-500 border-green-500">Configured</Badge>{/if}</h2>
				<p>Use an authenticator app or browser extension to get two-factor authentication codes when prompted.</p>
			</div>
			<Button href="/settings/security/mfa/totp">Edit</Button>
		</div>
		<div class="two-factor-method">
			<div class="two-factor-method-content">
				<h2>Security Keys {#if hardwareTokenEnabled}<Badge variant="outline" className="text-green-500 border-green-500">Configured</Badge>{/if}</h2>
				<p>
					Security keys are webauthn credentials that can only be used as a second factor of authentication.
				</p>
			</div>
			<Button href="/settings/security/mfa/security-keys">Edit</Button>
		</div>
		</section>
	</Card.Content>
</Card.Root>

<style lang="postcss">
	section {
		display: grid;
		gap: 1rem;
	}

	.two-factor-method {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 1rem;
	}

	.two-factor-method-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>