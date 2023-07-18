import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import kebabCase from 'just-kebab-case';
import { BOARD_GAME_ATLAS_CLIENT_ID } from '$env/static/private';
import prisma from '$lib/prisma.js';
import type { GameType, SearchQuery } from '$lib/types';
import { mapAPIGameToBoredGame } from '$lib/util/gameMapper';
import { search_schema } from '$lib/zodValidation';
import { listGameSchema } from '$lib/config/zod-schemas.js';

async function searchForGames(urlQueryParams: SearchQuery, locals) {
	try {
		let games = await prisma.game.findMany({
			where: {
				name: {
					search: urlQueryParams?.name
				},
				min_players: {
					gte: urlQueryParams?.min_players || 0
				},
				max_players: {
					lte: urlQueryParams?.max_players || 100
				},
				min_playtime: {
					gte: urlQueryParams?.min_playtime || 0
				},
				max_playtime: {
					lte: urlQueryParams?.max_playtime || 5000
				},
				min_age: {
					gte: urlQueryParams?.min_age || 0
				}
			},
			skip: urlQueryParams?.skip,
			take: urlQueryParams?.limit,
			orderBy: {
				name: 'asc'
			}
		});
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
						game.players = `${game.min_players}-${game.max_players}`;
						game.playtime = `${game.min_playtime}-${game.max_playtime}`;
					}
					const boredGame = mapAPIGameToBoredGame(game);
					createOrUpdateGame(boredGame);
					games.push(boredGame);
				});
			}
		}

		if (locals?.user) {
			const game_ids = games.map((game) => game.id);
			console.log('game_ids', game_ids);
			const collections = await prisma.collection.findMany({
				where: {
					user_id: locals.user.id
				},
				include: {
					items: {
						where: {
							game_id: {
								in: game_ids
							}
						}
					}
				}
			});
			console.log('collections', collections);
			const wishlists = await prisma.wishlist.findMany({
				where: {
					user_id: locals.user.id
				},
				include: {
					items: {
						where: {
							id: {
								in: game_ids
							}
						}
					}
				}
			});
			// console.log('wishlist_items', wishlist_items);
			for (const game of games) {
				console.log(
					'Checking collection',
					collections.findIndex((item) => item.items.some((i) => i.game_id === game.id))
				);
				game.in_collection =
					collections.findIndex((item) => item.items.some((i) => i.game_id === game.id)) === 0;
				game.in_wishlist =
					wishlists.findIndex((item) => item.items.some((i) => i.game_id === game.id)) === 0;
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

export const load = async (event) => {
	const { params, locals, request, fetch, url } = event;
	const defaults = {
		limit: 10,
		skip: 0
	};
	const searchParams = Object.fromEntries(url?.searchParams);
	console.log('searchParams', searchParams);
	searchParams.limit = searchParams.limit || `${defaults.limit}`;
	searchParams.skip = searchParams.skip || `${defaults.skip}`;
	searchParams.order = searchParams.order || 'asc';
	const form = await superValidate(searchParams, search_schema);
	const modifyListForm = await superValidate(listGameSchema);

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
	const searchData = await searchForGames(urlQueryParams, locals);

	return {
		form,
		modifyListForm,
		searchData
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
