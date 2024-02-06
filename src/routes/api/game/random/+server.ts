// import prisma from '$lib/prisma.js';
import db from '$lib/drizzle.js';
import { error, json } from '@sveltejs/kit';
import { asc, inArray, sql } from 'drizzle-orm';
import { games, type Games } from '../../../../schema.js';

export const GET = async ({ url, locals }) => {
	const searchParams = Object.fromEntries(url.searchParams);
	const limit = parseInt(searchParams?.limit) || 1;

	if (limit <= 0 || limit > 6) {
		error(400, { message: 'Limit must be between 1 and 6' });
	}

	// const totalGames = await prisma.game.count();
	try {
		console.log('db', db);
		const dbGames = await db.select({
			count: sql<number>`cast(count(*) as int))`,
		}).from(games);
		console.log('count', dbGames[0].count);
		const randomIndex = Math.floor(Math.random() * dbGames[0]?.count);
		const ids = await db.select({ id: games.id })
			.from(games)
			.orderBy(asc(games.id))
			.limit(limit)
			.offset(randomIndex);
		// const ids: { id: string }[] = await prisma.$queryRaw`
		// 	SELECT id
		// 	FROM games
		// 	ORDER BY id
		// 	LIMIT ${limit}
		// 	OFFSET ${randomIndex}
		// `;
		const randomGames: Games[] = await db.select().from(games).where(inArray(games.id, ids));
		return json(randomGames);
	} catch (e) {
		console.error(e);
		throw error(500, { message: 'Something went wrong' });
	}
  // const randomGames: Game[] = await prisma.game.findMany({
	// 	where: {
	// 		id: {
	// 			in: ids.map(id => id.id)
	// 		}
	// 	}
	// });
}