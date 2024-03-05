import { error, json } from '@sveltejs/kit';
import db from '$lib/drizzle.js';
import { eq, sql } from 'drizzle-orm';
import { games } from '../../../../schema.js';

// Search a user's collection
export const GET = async ({ url, locals }) => {
	const searchParams = Object.fromEntries(url.searchParams);
	const q = searchParams?.q?.trim() || '';
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;
	const order = searchParams?.order || 'desc';
	const exact = searchParams?.exact === 'true';
	let orderBy = searchParams?.orderBy || 'slug';

	if (orderBy === 'name') {
		orderBy = 'slug';
	}
	console.log(`q: ${q}, limit: ${limit}, skip: ${skip}, order: ${order}, exact: ${exact}`);
	console.log(exact);
	if (exact) {
		console.log('Exact Search API');
		const game =
			await db.query.games.findFirst({
				where: eq(games.name, q),
				columns: {
					id: true,
					name: true,
					slug: true,
					thumb_url: true
				}
			});

		if (!game) {
			error(404, { message: 'No games found' });
		}
		const foundGames = [game];
		console.log('Games found in Exact Search API', JSON.stringify(foundGames, null, 2));
		return json(foundGames);
	} else {
		const foundGames = await db.select({
			id: games.id,
			name: games.name,
			slug: games.slug,
			thumb_url: games.thumb_url
		})
			.from(games)
			.where(sql`to_tsvector('simple', ${games.name}) || to_tsvector('simple', ${games.slug}) @@ to_tsquery('simple', ${q})`)
			.orderBy(sql`${orderBy} ${order}`).offset(skip).limit(limit) || [];
		if (foundGames.length === 0) {
			error(404, { message: 'No games found' });
		}
		console.log('Games found in Search API', JSON.stringify(foundGames, null, 2));
		return json(foundGames);
	}
};
