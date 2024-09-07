<script lang="ts">
import LeftNav from '$components/LeftNav.svelte'
import type { Route } from '$lib/types'

const routes: Route[] = [
	{ href: '/settings/profile', label: 'Profile' },
	{ href: '/settings/security', label: 'Security' },
]

let { children } = $props()
</script>

<LeftNav {routes}>
	{@render children()}
</LeftNav>