import { superValidate } from 'sveltekit-superforms/server';
import { search_schema } from '$lib/zodValidation';
import type { MetaTagsProps } from 'svelte-meta-tags';
import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import type { Game } from '@prisma/client';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const image = {
		url: `${
			new URL(url.pathname, url.origin).href
		}og?header=Bored Game&page=Home&content=Keep track of your games`,
		width: 1200,
		height: 630
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
			siteName: 'Bored Game'
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
			imageAlt: 'Home | Bored Game'
		}
	});

	const formData = Object.fromEntries(url?.searchParams);
	console.log('formData', formData);
	formData.name = formData?.q;
	const form = await superValidate(formData, search_schema);
	console.log('form', form);

	const count = 5;
	const ids: { id: string }[] = await prisma.$queryRaw`SELECT id FROM games ORDER BY RAND() LIMIT ${count}`;
  const randomGames: Game[] = await prisma.game.findMany({
      where: {
				id: {
					in: ids.map(id => id.id)
				}
      }
    });

	return { form, metaTagsChild: metaTags, randomGames };
};
