// import prisma from '$lib/prisma.js';
import db from '$lib/drizzle.js';
import { error, json } from '@sveltejs/kit';
import { asc, count, inArray, sql } from 'drizzle-orm';
import { games, type Games } from '../../../../schema.js';

export const GET = async ({ url, locals }) => {
	const searchParams = Object.fromEntries(url.searchParams);
	const limit = parseInt(searchParams?.limit) || 1;

	if (limit <= 0 || limit > 6) {
		error(400, { message: 'Limit must be between 1 and 6' });
	}

	try {
		const totalGames = await db
			.select({
				value: count(games.id)
			})
			.from(games);
		const numberOfGames = totalGames[0].value || 0;
		const randomIndex = Math.floor(Math.random() * numberOfGames);
		const randomGames: Games[] = await db.select()
			.from(games)
			.orderBy(asc(games.id))
			.limit(limit)
			.offset(randomIndex);
		return json(randomGames);
	} catch (e) {
		console.error(e);
		throw error(500, { message: 'Something went wrong' });
	}
}