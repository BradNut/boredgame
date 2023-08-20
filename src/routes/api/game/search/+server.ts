import { error, json } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import z from 'zod';
import prisma from '$lib/prisma.js';
import { superValidate } from 'sveltekit-superforms/server';
import { search_schema } from '$lib/zodValidation.js';

// Search a user's collection
export const GET = async ({ url, locals, params, request }) => {
	// try {
	// 	z.parse;
	// } catch (e) {
	// 	console.error(e);
	// 	return error(500, { message: 'Something went wrong' });
	// }

	const searchParams = Object.fromEntries(url.searchParams);
	const q = searchParams?.q || '';
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;
	const order: Prisma.SortOrder = searchParams?.order || 'asc';
	const sort = searchParams?.sort || 'name';
	const session = await locals.auth.validate();
	console.log('url', url);
	console.log('username', locals?.user?.id);

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

// let games = await prisma.game.findMany({
// 	where: {
// 		name: {
// 			search: urlQueryParams?.name
// 		},
// 		min_players: {
// 			gte: urlQueryParams?.min_players || 0
// 		},
// 		max_players: {
// 			lte: urlQueryParams?.max_players || 100
// 		},
// 		min_playtime: {
// 			gte: urlQueryParams?.min_playtime || 0
// 		},
// 		max_playtime: {
// 			lte: urlQueryParams?.max_playtime || 5000
// 		},
// 		min_age: {
// 			gte: urlQueryParams?.min_age || 0
// 		}
// 	},
// 	skip: urlQueryParams?.skip,
// 	take: urlQueryParams?.limit,
// 	orderBy: {
// 		name: 'asc'
// 	}
// });
