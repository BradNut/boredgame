import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import kebabCase from 'just-kebab-case';
import { BOARD_GAME_ATLAS_CLIENT_ID } from '$env/static/private';
import prisma from '$lib/prisma.js';
import type { GameType, SearchQuery } from '$lib/types';
import { mapAPIGameToBoredGame } from '$lib/utils/gameMapper.js';
import { search_schema } from '$lib/zodValidation';
import type { PageServerLoad } from '../$types.js';
import type { BggThingDto } from 'boardgamegeekclient/dist/esm/dto/index.js';
import type { BggLinkDto } from 'boardgamegeekclient/dist/esm/dto/concrete/subdto/BggLinkDto.js';
import {
	createArtist,
	createCategory,
	createDesigner,
	createMechanic,
	createOrUpdateGame,
	createOrUpdateGameMinimal,
	createPublisher
} from '$lib/utils/dbUtils.js';
// import { listGameSchema } from '$lib/config/zod-schemas.js';

/**
 * Asynchronous function searchForGames to fetch games from a local and remote repository based on the given parameters.
 * @async
 * @function searchForGames
 * @param {SearchQuery} urlQueryParams - An object that represents the search parameters. It includes properties like name, min_players,
 * max_players, min_playtime, max_playtime, min_age, skip, limit which are used to define the search condition for games.
 * @param {any} locals - An object that contains data related to the local server environment like user information.
 * @param {Function} eventFetch - A function that fetches games from the local API.
 * @returns {Object} returns an object with totalCount property which is the total number of games fetched and games property which is
 * an array of all the games fetched. If any error occurred during the operation, it returns an object with totalCount as 0 and games as empty array.
 * @throws will throw an error if the response received from fetching games operation is not OK (200).
 */
async function searchForGames(urlQueryParams: SearchQuery, eventFetch: Function) {
	try {
		console.log('urlQueryParams search games', urlQueryParams);

		const headers: HeadersInit = new Headers();
		headers.set('Content-Type', 'application/json');
		const requestInit: RequestInit = {
			method: 'GET',
			headers
		};
		const url = `/api/game/search${urlQueryParams ? `?${urlQueryParams}` : ''}`;
		console.log('Calling internal api', url);
		const response = await eventFetch(url, requestInit);
		console.log('response from internal api', response);

		if (!response.ok) {
			console.log('Status not 200', response.status);
			throw error(response.status);
		}

		let games = [];
		if (response.ok) {
			games = await response.json();
		}

		console.log('games from DB', games);

		const gameNameSearch = urlQueryParams.get('q');
		let totalCount = games?.length || 0;

		if (
			totalCount === 0 ||
			!games.find((game: GameType) => game.slug === kebabCase(gameNameSearch))
		) {
			console.log('No games found in DB for', gameNameSearch);

			const externalResponse = await eventFetch(
				`/api/external/search${urlQueryParams ? `?${urlQueryParams}` : ''}`,
				requestInit
			);

			console.log('Back from external search', externalResponse);

			if (!response.ok) {
				console.log('Status not 200', response.status);
				throw error(response.status);
			}

			if (externalResponse.ok) {
				const gameResponse = await externalResponse.json();
				console.log('response from external api', gameResponse);
				const gameList: BggThingDto[] = gameResponse?.games;
				totalCount = gameResponse?.totalCount;
				console.log('totalCount', totalCount);
				for (const game of gameList) {
					console.log(
						`Retrieving simplified external game details for id: ${game.id} with name ${game.name}`
					);
					const externalGameResponse = await eventFetch(
						`/api/external/game/${game.id}?simplified=true`
					);
					if (externalGameResponse.ok) {
						const externalGame = await externalGameResponse.json();
						console.log('externalGame', externalGame);
						let boredGame = mapAPIGameToBoredGame(externalGame);
						games.push(createOrUpdateGameMinimal(boredGame));
					}
				}
			}
		}

		return {
			totalCount,
			games
		};
	} catch (e) {
		console.log(`Error searching board games ${e}`);
		// throw error(500, { message: 'Something went wrong' });
	}
	return {
		totalCount: 0,
		games: []
	};
}

export const load: PageServerLoad = async ({ fetch, url }) => {
	const defaults = {
		limit: 10,
		skip: 0,
		order: 'asc',
		sort: 'name'
	};
	const searchParams = Object.fromEntries(url?.searchParams);
	console.log('searchParams', searchParams);
	searchParams.limit = searchParams.limit || `${defaults.limit}`;
	searchParams.skip = searchParams.skip || `${defaults.skip}`;
	searchParams.order = searchParams.order || defaults.order;
	searchParams.sort = searchParams.sort || defaults.sort;
	const form = await superValidate(searchParams, search_schema);
	// const modifyListForm = await superValidate(listGameSchema);

	const queryParams: SearchQuery = {
		limit: form.data?.limit,
		skip: form.data?.skip,
		q: form.data?.q
	};

	// fields: ('id,name,min_age,min_players,max_players,thumb_url,min_playtime,max_playtime,min_age,description');
	try {
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
		const searchData = await searchForGames(urlQueryParams, fetch);

		return {
			form,
			// modifyListForm,
			searchData
		};
	} catch (e) {
		console.log(`Error searching board games ${e}`);
	}
	return {
		form,
		searchData: {
			totalCount: 0,
			games: []
		},
		wishlists: []
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
