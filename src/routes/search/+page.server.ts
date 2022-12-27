import type { Actions, PageServerLoad, RequestEvent } from '../$types';
import { BOARD_GAME_ATLAS_CLIENT_ID } from '$env/static/private';
import { error, fail } from '@sveltejs/kit';
import type { GameType, RandomSearch, Search, SearchQuery } from '$root/lib/types';
import { mapAPIGameToBoredGame } from '$root/lib/util/gameMapper';
import { search_schema } from '$root/lib/zodValidation';
import { ZodError } from 'zod';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const formData = Object.fromEntries(url?.searchParams);
	formData.name = formData?.q;
	const limit = parseInt(formData?.limit) || 10;
	const skip = parseInt(formData?.skip) || 0;

	const queryParams: SearchQuery = {
		order_by: 'rank',
		ascending: false,
		limit,
		skip,
		client_id: BOARD_GAME_ATLAS_CLIENT_ID,
		fuzzy_match: true,
		name: ''
	};

	try {
		console.log('Parsing Search Schema');
		const { name, minAge, minPlayers, maxPlayers, exactMinAge, exactMinPlayers, exactMaxPlayers } =
			search_schema.parse(formData);

		if (minAge) {
			if (exactMinAge) {
				queryParams.min_age = minAge;
			} else {
				queryParams.gt_min_age = minAge === 1 ? 0 : minAge - 1;
			}
		}

		if (minPlayers) {
			if (exactMinPlayers) {
				queryParams.min_players = minPlayers;
			} else {
				queryParams.gt_min_players = minPlayers === 1 ? 0 : minPlayers - 1;
			}
		}
		if (maxPlayers) {
			if (exactMaxPlayers) {
				queryParams.max_players = maxPlayers;
			} else {
				queryParams.lt_max_players = maxPlayers + 1;
			}
		}

		if (name) {
			queryParams.name = name;
		}
	} catch (parsingError: unknown) {
		let errors;
		if (parsingError instanceof ZodError) {
			// console.log('Parse error');

			// console.log(parsingError);
			const { fieldErrors } = parsingError.flatten();
			console.log(`Errors with user input ${fieldErrors}}`);
			errors = fieldErrors;
			//throw error(400, { message: 'There was an error searching for games!' }); // fail(400, { data: formData, errors });
		}
		return {
			errors,
			name: formData.name,
			minAge: formData.minAge,
			minPlayers: formData.minPlayers,
			maxPlayers: formData.maxPlayers,
			exactMinPlayers: formData.exactMinPlayers,
			exactMaxPlayers: formData.exactMaxPlayers,
			games: [],
			totalCount: 0,
			limit,
			skip
		};
	}

	const newQueryParams: Record<string, string> = {};
	for (const key in queryParams) {
		// console.log('key', key);
		// console.log('queryParams[key]', queryParams[key as keyof SearchQuery]);
		newQueryParams[key] = `${queryParams[key as keyof SearchQuery]}`;
	}

	const urlQueryParams = new URLSearchParams(newQueryParams);
	console.log('urlQueryParams', urlQueryParams);

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
		// console.log('board game response', response);

		if (!response.ok) {
			console.log('Status not 200', response.status);
			throw error(response.status);
		}

		if (response.status === 200) {
			const gameResponse = await response.json();
			// console.log('gameResponse', gameResponse);
			const gameList = gameResponse?.games;
			const totalCount = gameResponse?.count;
			console.log('totalCount', totalCount);
			const games: GameType[] = [];
			gameList.forEach((game) => {
				games.push(mapAPIGameToBoredGame(game));
			});

			// console.log('returning from search', games)

			return {
				name: formData.name,
				minAge: formData.minAge,
				minPlayers: formData.minPlayers,
				maxPlayers: formData.maxPlayers,
				exactMinPlayers: formData.exactMinPlayers,
				exactMaxPlayers: formData.exactMaxPlayers,
				games,
				totalCount,
				limit,
				skip
			};
		}
	} catch (e) {
		console.log(`Error searching board games ${e}`);
	}
	return {
		games: [],
		totalCount: 0,
		limit,
		skip
	};
};

export const actions: Actions = {
	random: async ({ request }: RequestEvent): Promise<any> => {
		const queryParams: SearchQuery = {
			order_by: 'rank',
			ascending: false,
			client_id: BOARD_GAME_ATLAS_CLIENT_ID,
			random: true
		};

		const newQueryParams: Record<string, string> = {};
		for (const key in queryParams) {
			newQueryParams[key] = `${queryParams[key as keyof SearchQuery]}`;
		}

		const urlQueryParams = new URLSearchParams(newQueryParams);

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
			// console.log('board game response', response);

			if (!response.ok) {
				console.log('Status not 200', response.status);
				throw error(response.status);
			}

			if (response.status === 200) {
				const gameResponse = await response.json();
				// console.log('gameResponse', gameResponse);
				const gameList = gameResponse?.games;
				const totalCount = gameResponse?.count;
				console.log('totalCount', totalCount);
				const games: GameType[] = [];
				gameList.forEach((game) => {
					games.push(mapAPIGameToBoredGame(game));
				});

				// console.log('returning from search', games)

				return {
					games
				};
			}
		} catch (e) {
			console.log(`Error searching board games ${e}`);
		}
		return {
			games: []
		};
	}
};
