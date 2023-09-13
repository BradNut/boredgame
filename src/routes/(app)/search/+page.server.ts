import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import kebabCase from 'just-kebab-case';
import { BOARD_GAME_ATLAS_CLIENT_ID } from '$env/static/private';
import prisma from '$lib/prisma.js';
import type { GameType, SearchQuery } from '$lib/types';
import { mapAPIGameToBoredGame } from '$lib/utils/gameMapper.js';
import { search_schema } from '$lib/zodValidation';
import type { PageServerLoad } from '../$types.js';
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
async function searchForGames(urlQueryParams: SearchQuery, eventFetch) {
	try {
		console.log('urlQueryParams search games', urlQueryParams);
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
		const headers: HeadersInit = new Headers();
		headers.set('Content-Type', 'application/json');
		const requestInit: RequestInit = {
			method: 'GET',
			headers
		};
		const response = await eventFetch(
			`/api/game/search${urlQueryParams ? `?${urlQueryParams}` : ''}`,
			requestInit
		);
		console.log('response from internal api', response);

		if (!response.ok) {
			console.log('Status not 200', response.status);
			throw error(response.status);
		}

		// const games: GameType[] = [];
		// let totalCount = 0;
		let games = [];
		if (response.ok) {
			games = await response.json();
		}

		console.log('games from DB', games);
		let totalCount = games?.length || 0;

		if (!games || games.length === 0) {
			const url = new URL(
				`https://api.boardgameatlas.com/api/search${urlQueryParams ? `?${urlQueryParams}` : ''}`
			);
			const headers: HeadersInit = new Headers();
			headers.set('Content-Type', 'application/json');
			const requestInit: RequestInit = {
				method: 'GET',
				headers
			};
			const response = await fetch(url, requestInit);

			if (!response.ok) {
				console.log('Status not 200', response.status);
				throw error(response.status);
			}

			// const games: GameType[] = [];
			// let totalCount = 0;
			if (response.ok) {
				const gameResponse = await response.json();
				const gameList: GameType[] = gameResponse?.games;
				totalCount = gameResponse?.count;
				console.log('totalCount', totalCount);
				gameList.forEach((game) => {
					if (game?.min_players && game?.max_players) {
						game.players = `${game.min_players} - ${game.max_players}`;
						game.playtime = `${game.min_playtime} - ${game.max_playtime}`;
					}
					const boredGame = mapAPIGameToBoredGame(game);
					createOrUpdateGame(boredGame);
					games.push(boredGame);
				});
			}
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

/**
 * Asynchronous function createOrUpdateGame is used to create or update a game using the given game information.
 *
 * @async
 * @function createOrUpdateGame
 * @param {GameType} game - An object that holds the details about a game. It should contain required information like name, description,
 * id (both internal and external), thumbnail URL, minimum age, minimum and maximum number of players, minimum and maximum play time,
 * year of publication and primary publisher information including the publisher's name and ID, categories and mechanics related to the game.
 *
 * @returns {Promise<Object>} The return is a Promise that resolves with the data of the game that was created or updated.
 */
async function createOrUpdateGame(game: GameType) {
	const categoryIds = game.categories.map((category) => ({
		external_id: category.id
	}));
	const mechanicIds = game.mechanics.map((mechanic) => ({
		external_id: mechanic.id
	}));
	console.log('categoryIds', categoryIds);
	console.log('mechanicIds', mechanicIds);
	return await prisma.game.upsert({
		where: {
			external_id: game.id
		},
		create: {
			name: game.name,
			slug: kebabCase(game.name),
			description: game.description,
			description_preview: game.description_preview,
			external_id: game.id,
			thumb_url: game.thumb_url,
			min_age: game.min_age,
			min_players: game.min_players,
			max_players: game.max_players,
			min_playtime: game.min_playtime,
			max_playtime: game.max_playtime,
			year_published: game.year_published,
			primary_publisher: {
				connectOrCreate: {
					where: {
						external_id: game.primary_publisher.id
					},
					create: {
						external_id: game.primary_publisher.id,
						name: game.primary_publisher.name,
						slug: kebabCase(game.primary_publisher.name)
					}
				}
			},
			categories: {
				connect: categoryIds
			},
			mechanics: {
				connect: mechanicIds
			}
		},
		update: {
			name: game.name,
			slug: kebabCase(game.name),
			description: game.description,
			description_preview: game.description_preview,
			external_id: game.id,
			thumb_url: game.thumb_url,
			min_age: game.min_age,
			min_players: game.min_players,
			max_players: game.max_players,
			min_playtime: game.min_playtime,
			max_playtime: game.max_playtime,
			year_published: game.year_published,
			primary_publisher: {
				connectOrCreate: {
					where: {
						external_id: game.primary_publisher.id
					},
					create: {
						external_id: game.primary_publisher.id,
						name: game.primary_publisher.name,
						slug: kebabCase(game.primary_publisher.name)
					}
				}
			},
			categories: {
				connect: categoryIds
			},
			mechanics: {
				connect: mechanicIds
			}
		}
	});
}

export const load: PageServerLoad = async ({ params, locals, request, fetch, url }) => {
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
	searchParams.order = searchParams.order || 'asc';
	searchParams.sort = searchParams.sort || 'name';
	const form = await superValidate(searchParams, search_schema);
	// const modifyListForm = await superValidate(listGameSchema);

	const queryParams: SearchQuery = {
		order_by: 'rank',
		ascending: false,
		limit: form.data?.limit,
		skip: form.data?.skip,
		client_id: BOARD_GAME_ATLAS_CLIENT_ID,
		fuzzy_match: true,
		name: form.data?.q
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
		// console.log('searchData', searchData);

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
