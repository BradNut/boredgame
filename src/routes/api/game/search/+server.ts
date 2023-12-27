import { error, json } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import prisma from '$lib/prisma';

// Search a user's collection
export const GET = async ({ url, locals }) => {
	const searchParams = Object.fromEntries(url.searchParams);
	const q = searchParams?.q?.trim() || '';
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;
	const order: Prisma.SortOrder = <Prisma.SortOrder>searchParams?.order || 'desc';
	const exact = searchParams?.exact === 'true';
	console.log(`q: ${q}, limit: ${limit}, skip: ${skip}, order: ${order}`);
	// const sort : Prisma.GameOrderByRelevanceFieldEnum = <Prisma.GameOrderByRelevanceFieldEnum>searchParams?.sort || 'name';
	// console.log('url', url);
	const exactGameSelect: Prisma.GameSelect = {
		id: true,
		name: true,
		slug: true,
		thumb_url: true
	};

	if (exact) {
		const game =
			await prisma.game.findFirst({
				where: {
					name: {
						equals: q
					}
				},
				select: exactGameSelect
			});

		if (!game) {
			error(404, { message: 'No games found' });
		}
		const games = [game];
		console.log('Games found in Exact Search API', JSON.stringify(games, null, 2));
		return json(games);
	} else {
		const games =
			(await prisma.game.findMany({
				orderBy: {
					_relevance: {
						fields: ['name'],
						search: q,
						sort: order
					}
				},
				select: exactGameSelect,
				take: limit,
				skip
			})) || [];
		if (games.length === 0) {
			error(404, { message: 'No games found' });
		}
		console.log('Games found in Search API', JSON.stringify(games, null, 2));
		return json(games);
	}
};
