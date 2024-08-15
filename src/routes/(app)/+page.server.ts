import type { MetaTagsProps } from 'svelte-meta-tags';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import {db} from '$lib/server/api/infrastructure/database/index';
import { collections, usersTable, wishlists } from '$lib/server/api/infrastructure/database/tables';
// import { userFullyAuthenticated } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
	const { locals, url } = event;

	const authedUser = await locals.getAuthedUser();

	const image = {
		url: `${
			new URL(url.pathname, url.origin).href
		}og?header=Bored Game&page=Home&content=Keep track of your games`,
		width: 1200,
		height: 630,
	};
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
			image: `${
				new URL(url.pathname, url.origin).href
			}og?header=Bored Game&page=Home&content=Keep track of your games`,
			imageAlt: 'Home | Bored Game',
		},
	});

	if (authedUser) {
		const dbUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.id, authedUser!.id!),
		});

		console.log('Sending back user details');
		const userWishlists = await db.query.wishlists.findMany({
			columns: {
				cuid: true,
				name: true,
			},
			where: eq(wishlists.user_id, authedUser!.id!),
		});
		const userCollection = await db.query.collections.findMany({
			columns: {
				cuid: true,
				name: true,
			},
			where: eq(collections.user_id, authedUser!.id!),
		});

		console.log('Wishlists', userWishlists);
		console.log('Collections', userCollection);
		return {
			metaTagsChild: metaTags,
			user: {
				firstName: dbUser?.first_name,
				lastName: dbUser?.last_name,
				username: dbUser?.username,
			},
			wishlists: userWishlists,
			collections: userCollection,
		};
	}

	return { metaTagsChild: metaTags, user: null, wishlists: [], collections: [] };
};
