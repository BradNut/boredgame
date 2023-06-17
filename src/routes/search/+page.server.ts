import { BOARD_GAME_ATLAS_CLIENT_ID } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { GameType, SearchQuery } from '$lib/types';
import { mapAPIGameToBoredGame } from '$lib/util/gameMapper';
import { search_schema } from '$lib/zodValidation';

async function searchForGames(urlQueryParams: SearchQuery) {
	try {
		const url = `https://api.boardgameatlas.com/api/search${
			urlQueryParams ? `?${urlQueryParams}` : ''
		}`;
		const response = await fetch(url, {
			method: 'get',
			headers: {
				'content-type': 'application/json'
			}
		});

		if (!response.ok) {
			console.log('Status not 200', response.status);
			throw error(response.status);
		}

		const games: GameType[] = [];
		let totalCount = 0;
		if (response.ok) {
			const gameResponse = await response.json();
			const gameList: GameType[] = gameResponse?.games;
			totalCount = gameResponse?.count;
			console.log('totalCount', totalCount);
			gameList.forEach((game) => {
				if (game?.min_players && game?.max_players) {
					game.players = `${game.min_players}-${game.max_players}`;
					game.playtime = `${game.min_playtime}-${game.max_playtime}`;
				}
				games.push(mapAPIGameToBoredGame(game));
			});
		}
		return {
			totalCount,
			games
		};
	} catch (e) {
		console.log(`Error searching board games ${e}`);
	}
	return {
		totalCount: 0,
		games: []
	};
}

export const load = async ({ fetch, url }) => {
	const defaults = {
		limit: 10,
		skip: 0
	};
	const searchParams = Object.fromEntries(url?.searchParams);
	searchParams.limit = searchParams.limit || `${defaults.limit}`;
	searchParams.skip = searchParams.skip || `${defaults.skip}`;
	const form = await superValidate(searchParams, search_schema);

	const queryParams: SearchQuery = {
		order_by: 'rank',
		ascending: false,
		limit: form.data?.limit,
		skip: form.data?.skip,
		client_id: BOARD_GAME_ATLAS_CLIENT_ID,
		fuzzy_match: true,
		name: form.data?.q,
		fields:
			'id,name,min_age,min_players,max_players,thumb_url,min_playtime,max_playtime,min_age,description'
	};

	if (form.data?.minAge) {
		if (form.data?.exactMinAge) {
			queryParams.min_age = form.data?.minAge;
		} else {
			queryParams.gt_min_age = form.data?.minAge === 1 ? 0 : form.data?.minAge - 1;
		}
	}

	if (form.data?.minPlayers) {
		if (form.data?.exactMinPlayers) {
			queryParams.min_players = form.data?.minPlayers;
		} else {
			queryParams.gt_min_players = form.data?.minPlayers === 1 ? 0 : form.data?.minPlayers - 1;
		}
	}
	if (form.data?.maxPlayers) {
		if (form.data?.exactMaxPlayers) {
			queryParams.max_players = form.data?.maxPlayers;
		} else {
			queryParams.lt_max_players = form.data?.maxPlayers + 1;
		}
	}

	const newQueryParams: Record<string, string> = {};
	for (const key in queryParams) {
		newQueryParams[key] = `${queryParams[key as keyof SearchQuery]}`;
	}

	const urlQueryParams = new URLSearchParams(newQueryParams);

	return {
		form,
		searchData: await searchForGames(urlQueryParams)
	};
};

export const actions = {
	random: async ({ request }): Promise<any> => {
		const form = await superValidate(request, search_schema);
		const queryParams: SearchQuery = {
			order_by: 'rank',
			ascending: false,
			client_id: BOARD_GAME_ATLAS_CLIENT_ID,
			random: true,
			fields:
				'id,name,min_age,min_players,max_players,thumb_url,min_playtime,max_playtime,min_age,description'
		};

		const newQueryParams: Record<string, string> = {};
		for (const key in queryParams) {
			newQueryParams[key] = `${queryParams[key as keyof SearchQuery]}`;
		}

		const urlQueryParams = new URLSearchParams(newQueryParams);

		return {
			form,
			searchData: await searchForGames(urlQueryParams)
		};
	}
};
