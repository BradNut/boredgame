import { fail } from '@sveltejs/kit'
import type { MetaTagsProps } from 'svelte-meta-tags'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const { locals, url } = event

	const authedUser = await locals.getAuthedUser()

	const image = {
		url: `${new URL(url.pathname, url.origin).href}og?header=Bored Game&page=Home&content=Keep track of your games`,
		width: 1200,
		height: 630,
	}
	const metaTags: MetaTagsProps = Object.freeze({
		title: 'Home',
		description: 'Home page',
		openGraph: {
			type: 'website',
			url: new URL(url.pathname, url.origin).href,
			locale: 'en_US',
			title: 'Home',
			description: 'Bored Game, keep track of your games',
			images: [image],
			siteName: 'Bored Game',
		},
		twitter: {
			handle: '@boredgame',
			site: '@boredgame',
			cardType: 'summary_large_image',
			title: 'Home | Bored Game',
			description: 'Bored Game, keep track of your games',
			image: `${new URL(url.pathname, url.origin).href}og?header=Bored Game&page=Home&content=Keep track of your games`,
			imageAlt: 'Home | Bored Game',
		},
	})

	if (authedUser) {
		const { data: wishlistsData, error: wishlistsError } = await locals.api.wishlists.$get().then(locals.parseApiResponse)
		const { data: collectionsData, error: collectionsError } = await locals.api.collections.$get().then(locals.parseApiResponse)

		if (wishlistsError || collectionsError) {
			return fail(500, 'Failed to fetch wishlistsTable or collections')
		}

		console.log('Wishlists', wishlistsData.wishlists)
		console.log('Collections', collectionsData.collections)
		return {
			metaTagsChild: metaTags,
			user: {
				firstName: authedUser?.firstName,
				lastName: authedUser?.lastName,
				username: authedUser?.username,
			},
			wishlists: wishlistsData.wishlists,
			collections: collectionsData.collections,
		}
	}

	console.log('Not Authed')

	return { metaTagsChild: metaTags, user: null, wishlists: [], collections: [] }
}
