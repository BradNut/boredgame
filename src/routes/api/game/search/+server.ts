import { error, json } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import prisma from '$lib/prisma.js';

// Search a user's collection
export const GET = async ({ url, locals, params, request }) => {
	const searchParams = Object.fromEntries(url.searchParams);
	const q = searchParams?.q || '';
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;
	const order: Prisma.SortOrder = <Prisma.SortOrder>searchParams?.order || 'asc';
	const sort = searchParams?.sort || 'name';
	console.log('url', url);

	try {
		const orderBy = { [sort]: order };
		let games = await prisma.game.findMany({
			where: {
				name: {
					contains: q
				}
			},
			orderBy: [
				{
					...orderBy
				}
			],
			select: {
				id: true,
				name: true,
				thumb_url: true
			},
			skip,
			take: limit
		});

		if (!games) {
			throw error(404, { message: 'No games found' });
		}

		return json(games);
	} catch (e) {
		console.error(e);
		throw error(500, { message: 'Something went wrong' });
	}
};
