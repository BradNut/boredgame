<script lang="ts">
import LeftNav from '$components/LeftNav.svelte'

let { children } = $props()

const routes = [
	{ href: '/profile/security', label: 'Security' },
	{ href: '/profile/security/mfa', label: 'MFA' },
	{ href: '/profile/security/password/change', label: 'Change Password' },
]
</script>

<LeftNav {routes}>
	{@render children()}
</LeftNav>
