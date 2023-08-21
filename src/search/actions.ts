import { invalid, type RequestEvent } from '@sveltejs/kit';
import { BOARD_GAME_ATLAS_CLIENT_ID } from '$env/static/private';
import type { GameType, SearchQuery } from '$lib/types';
import { mapAPIGameToBoredGame } from '$lib/utils/gameMapper';

interface Actions {
	[key: string]: any; // Action
}

export const Games: Actions = {
	search: async ({ request, locals }: RequestEvent): Promise<any> => {
		console.log('In search action specific');
		// Do things in here
		const form = await request.formData();
		console.log('action form', form);
		const queryParams: SearchQuery = {
			order_by: 'rank',
			ascending: false,
			limit: 10,
			skip: 0,
			client_id: BOARD_GAME_ATLAS_CLIENT_ID,
			fuzzy_match: true,
			name: ''
		};

		const name = form.has('name') ? form.get('name') : await request?.text();
		console.log('name', name);
		if (name) {
			queryParams.name = `${name}`;
		}

		const newQueryParams: Record<string, string> = {};
		for (const key in queryParams) {
			console.log('key', key);
			console.log('queryParams[key]', queryParams[key]);
			newQueryParams[key] = `${queryParams[key]}`;
		}

		const urlQueryParams = new URLSearchParams(newQueryParams);
		console.log('urlQueryParams', urlQueryParams);

		try {
			throw new Error('test error');
			// const url = `https://api.boardgameatlas.com/api/search${urlQueryParams ? `?${urlQueryParams}` : ''
			//   }`;
			// const response = await fetch(url, {
			//   method: 'get',
			//   headers: {
			//     'content-type': 'application/json'
			//   }
			// });
			// console.log('board game response', response);
			// if (response.status !== 200) {
			//   console.log('Status not 200', response.status)
			//   invalid(response.status, {});
			// }

			// if (response.status === 200) {
			//   const gameResponse = await response.json();
			//   console.log('gameResponse', gameResponse);
			//   const gameList = gameResponse?.games;
			//   const totalCount = gameResponse?.count;
			//   console.log('totalCount', totalCount);
			//   const games: GameType[] = [];
			//   gameList.forEach((game) => {
			//     games.push(mapAPIGameToBoredGame(game));
			//   });

			//   console.log('returning from search')

			//   return {
			//     games,
			//     totalCount: games.length
			//   };
			// }

			// return {
			//   games: [],
			//   totalCount: 0
			// };
		} catch (e) {
			console.log(`Error searching board games ${e}`);
			return invalid(400, { reason: 'Exception' });
		}
	}

	//   const id = form.get('id');
	//   const ids = form.get('ids');
	//   const minAge = form.get('minAge');
	//   const minPlayers = form.get('minPlayers');
	//   const maxPlayers = form.get('maxPlayers');
	//   const exactMinAge = form.get('exactMinAge') || false;
	//   const exactMinPlayers = form.get('exactMinPlayers') || false;
	//   const exactMaxPlayers = form.get('exactMaxPlayers') || false;
	//   const random = form.get('random') === 'on' || false;

	//   if (minAge) {
	//     if (exactMinAge) {
	//       queryParams.min_age = +minAge;
	//     } else {
	//       queryParams.gt_min_age = +minAge === 1 ? 0 : +minAge - 1;
	//     }
	//   }

	//   if (minPlayers) {
	//     if (exactMinPlayers) {
	//       queryParams.min_players = +minPlayers;
	//     } else {
	//       queryParams.gt_min_players = +minPlayers === 1 ? 0 : +minPlayers - 1;
	//     }
	//   }

	//   if (maxPlayers) {
	//     if (exactMaxPlayers) {
	//       queryParams.max_players = +maxPlayers;
	//     } else {
	//       queryParams.lt_max_players = +maxPlayers + 1;
	//     }
	//   }

	//   if (id) {
	//     queryParams.ids = new Array(`${id}`);
	//   }

	//   if (ids) {
	//     // TODO: Pass in ids array from localstorage / game store
	//     queryParams.ids = new Array(ids);
	//   }

	//   queryParams.random = random;
	//   console.log('queryParams', queryParams);

	//   const newQueryParams: Record<string, string> = {};
	//   for (const key in queryParams) {
	//     newQueryParams[key] = `${queryParams[key as keyof typeof queryParams]}`;
	//   }

	//   const urlQueryParams = new URLSearchParams(newQueryParams);

	//   const url = `https://api.boardgameatlas.com/api/search${urlQueryParams ? `?${urlQueryParams}` : ''
	//     }`;
	//   const response = await fetch(url, {
	//     method: 'get',
	//     headers: {
	//       'content-type': 'application/json'
	//     }
	//   });
	//   console.log('response status', response.status);
	//   console.log('board game response action', response);
	//   if (response.status === 404) {
	//     // user hasn't created a todo list.
	//     // start with an empty array
	//     return {
	//       success: true,
	//       games: [],
	//       totalCount: 0
	//     };
	//   }

	//   if (response.status === 200) {
	//     const gameResponse = await response.json();
	//     console.log('gameResponse', gameResponse);
	//     const gameList = gameResponse?.games;
	//     const games: GameType[] = [];
	//     gameList.forEach((game: GameType) => {
	//       games.push(mapAPIGameToBoredGame(game));
	//     });
	//     console.log('action games', games);
	//     return {
	//       games,
	//       totalCount: games.length
	//     };
	//   }

	//   return { success: false };
	// }
	// create: async function create({ request, locals }): Promise<any> {
	//   const data = await getFormDataObject<any>(request);
	//   return data;
	// }
};
