import prisma from '$lib/prisma.js';
import type { Game } from '@prisma/client';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ url, locals }) => {
	const searchParams = Object.fromEntries(url.searchParams);
	const limit = parseInt(searchParams?.limit) || 1;

	if (limit <= 0 || limit > 6) {
		error(400, { message: 'Limit must be between 1 and 6' });
	}

	const totalGames = await prisma.game.count();
	const randomIndex = Math.floor(Math.random() * totalGames);
	const ids: { id: string }[] = await prisma.$queryRaw`
		SELECT id
		FROM games
		ORDER BY id
		LIMIT ${limit}
		OFFSET ${randomIndex}
	`;
  const randomGames: Game[] = await prisma.game.findMany({
		where: {
			id: {
				in: ids.map(id => id.id)
			}
		}
	});

	return json(randomGames);
}