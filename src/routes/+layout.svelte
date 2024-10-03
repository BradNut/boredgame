<script lang="ts">
import '$lib/styles/app.pcss'
import { onMount } from 'svelte'
import { MetaTags } from 'svelte-meta-tags'
import { getFlash } from 'sveltekit-flash-message/client'
import 'iconify-icon'
import { onNavigate } from '$app/navigation'
import { page } from '$app/stores'
import Analytics from '$components/Analytics.svelte'
import PlausibleAnalytics from '$components/PlausibleAnalytics.svelte'
import { Toaster } from '$lib/components/ui/sonner'
import PageLoadingIndicator from '$lib/page_loading_indicator.svelte'
import { toastMessage } from '$lib/utils/superforms.js'
import { theme } from '$state/theme'
// import { ModeWatcher } from 'mode-watcher'

const dev = process.env.NODE_ENV !== 'production'

const { data, children } = $props()
const { user } = data

const metaTags = $derived({
	titleTemplate: '%s | Bored Game',
	description: 'Bored Game, keep track of your games.',
	openGraph: {
		type: 'website',
		titleTemplate: '%s | Bored Game',
		locale: 'en_US',
		description: 'Bored Game, keep track of your games',
	},
	...$page.data.metaTagsChild,
})

const flash = getFlash(page, {
	clearOnNavigate: true,
	clearAfterMs: 3000,
	clearArray: true,
})

onMount(() => {
	// set the theme to the user's active theme
	$theme = user?.theme || 'system'
	document.querySelector('html')?.setAttribute('data-theme', $theme)
})

$effect(() => {
	console.log('flash', $flash)
	if ($flash) {
		toastMessage({ type: $flash.type, text: $flash.message })
		// Clearing the flash message could sometimes
		// be required here to avoid double-toasting.
		flash.set(undefined)
	}
})

onNavigate(async (navigation) => {
	if (!document.startViewTransition) return

	return new Promise((oldStateCaptureResolve) => {
		document.startViewTransition(async () => {
			oldStateCaptureResolve()
			await navigation.complete
		})
	})
})
</script>

{#if !dev}
	<Analytics />
	<PlausibleAnalytics />
{/if}

<MetaTags {...metaTags} />
<PageLoadingIndicator />
<!-- <ModeWatcher /> -->
<Toaster />
{@render children()}
