import { error, json } from '@sveltejs/kit';
import db from '../../../../db';
import { asc, desc, eq, ilike, or } from 'drizzle-orm';
import { games } from '$db/schema';
import kebabCase from 'just-kebab-case';
import {
	FilterSchema,
	PaginationSchema,
	SearchSchema,
	SortSchema,
} from '$lib/validations/zod-schemas';

// Search a user's collection
export const GET = async ({ url, locals }) => {
	const searchParams = Object.fromEntries(url.searchParams);

	const searchGames = PaginationSchema.merge(FilterSchema)
		.merge(SortSchema)
		.merge(SearchSchema)
		.parse(searchParams);

	if (searchGames.status !== 'success') {
		error(400, 'Invalid request');
	}

	const q = searchParams?.q?.trim() || '';
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;
	const order: OrderDirection = searchParams?.order === 'desc' ? 'desc' : 'asc';
	const exact = searchParams?.exact === 'true';
	let orderBy = searchParams?.orderBy || 'slug';

	if (orderBy === 'name') {
		orderBy = 'slug';
	}
	console.log(
		`q: ${q}, limit: ${limit}, skip: ${skip}, order: ${order}, exact: ${exact}, orderBy: ${orderBy}`,
	);
	console.log(exact);
	if (exact) {
		console.log('Exact Search API');
		const game = await db.query.games.findFirst({
			where: eq(games.name, q),
			columns: {
				id: true,
				name: true,
				slug: true,
				thumb_url: true,
			},
		});

		if (!game) {
			error(404, { message: 'No games found' });
		}
		const foundGames = [game];
		console.log('Games found in Exact Search API', JSON.stringify(foundGames, null, 2));
		return json(foundGames);
	} else {
		const foundGames =
			(await db
				.select({
					id: games.id,
					name: games.name,
					slug: games.slug,
					thumb_url: games.thumb_url,
				})
				.from(games)
				.where(or(ilike(games.name, `%${q}%`), ilike(games.slug, `%${kebabCase(q)}%`)))
				.orderBy(getOrderDirection(order)(getOrderBy(orderBy)))
				.offset(skip)
				.limit(limit)) || [];
		// const foundGames = await db.select({
		// 	id: games.id,
		// 	name: games.name,
		// 	slug: games.slug,
		// 	thumb_url: games.thumb_url
		// })
		// 	.from(games)
		// 	.where(sql`to_tsvector('simple', ${games.name}) || to_tsvector('simple', ${games.slug}) @@ to_tsquery('simple', ${q})`)
		// 	.orderBy(sql`${orderBy} ${order}`).offset(skip).limit(limit) || [];
		if (foundGames.length === 0) {
			error(404, { message: 'No games found' });
		}
		console.log('Games found in Search API', JSON.stringify(foundGames, null, 2));
		return json(foundGames);
	}
};

type OrderDirection = 'asc' | 'desc';

const getOrderDirection = (direction: OrderDirection) => {
	return direction === 'asc' ? asc : desc;
};

const getOrderBy = (orderBy: string) => {
	switch (orderBy) {
		case 'name':
			return games.name;
		case 'slug':
			return games.slug;
		default:
			return games.slug;
	}
};
