import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { boardGameApi } from '../../api';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const queryParams = {
		ids: `${params?.id}`
	};

	const response = await boardGameApi('get', `search`, queryParams);

	if (response.status === 200) {
		const gameResponse = await response.json();

		setHeaders({
			'Cache-Control': 'max-age=3600'
		});

		return {
			game: gameResponse?.games[0]
		};
	}

	throw error(response.status, 'not found');
};
