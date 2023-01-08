import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { boardGameApi } from '../../api';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const queryParams = {
		ids: `${params?.id}`,
		fields:
			'id,name,min_age,min_players,max_players,thumb_url,playtime,min_playtime,max_playtime,min_age,description,year_published,image_url'
	};

	const response = await boardGameApi('get', `search`, queryParams);

	if (response.status === 200) {
		const gameResponse = await response.json();

		setHeaders({
			'Cache-Control': 'max-age=3600'
		});

		const game = gameResponse?.games[0];
		game.players = `${game.min_players}-${game.max_players}`;
		game.playtime = `${game.min_playtime}-${game.max_playtime}`;

		return {
			game
		};
	}

	throw error(response.status, 'not found');
};
