import { error, json } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import prisma from '$lib/prisma';

// Search a user's collection
export const GET = async ({ url }) => {
	const searchParams = Object.fromEntries(url.searchParams);
	const q = searchParams?.q || '';
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;
	const order: Prisma.SortOrder = <Prisma.SortOrder>searchParams?.order || 'desc';
	console.log(`q: ${q}, limit: ${limit}, skip: ${skip}, order: ${order}`);
	// const sort : Prisma.GameOrderByRelevanceFieldEnum = <Prisma.GameOrderByRelevanceFieldEnum>searchParams?.sort || 'name';
	// console.log('url', url);

	try {
		let games = await prisma.game.findMany({
			where: {
				name: {
					search: q
				}
			},
			orderBy: {
				_relevance: {
					fields: ['name'],
					search: q,
					sort: order
				}
			},
			select: {
				id: true,
				name: true,
				slug: true,
				thumb_url: true
			},
			skip,
			take: limit
		});

		if (!games) {
			throw error(404, { message: 'No games found' });
		}

		console.log('Games found in Search API', JSON.stringify(games, null, 2));

		return json(games);
	} catch (e) {
		console.error(e);
		throw error(500, { message: 'Something went wrong' });
	}
};
