import type { Actions, PageServerLoad, RequestEvent } from '../$types';
import { BOARD_GAME_ATLAS_CLIENT_ID } from '$env/static/private';
import { error, invalid, type ServerLoadEvent } from '@sveltejs/kit';
import type { GameType, SearchQuery } from '$root/lib/types';
import { mapAPIGameToBoredGame } from '$root/lib/util/gameMapper';
import { search_schema } from '$root/lib/zodValidation';
import { ZodError } from 'zod';

export const load: PageServerLoad = () => {
  return {
    games: [],
    totalCount: 0,
  }
}

export const actions: Actions = {
  default: async ({ request }: RequestEvent): Promise<any> => {
    console.log("In search action specific")
    // Do things in here
    const formData = Object.fromEntries(await request.formData());
    console.log('formData', formData);
    console.log('passed in limit:', formData?.limit)
    console.log('passed in skip:', formData?.skip)
    const limit = formData?.limit || 10;
    const skip = formData?.skip || 0;

    const queryParams: SearchQuery = {
      order_by: 'rank',
      ascending: false,
      limit: +limit,
      skip: +skip,
      client_id: BOARD_GAME_ATLAS_CLIENT_ID,
      fuzzy_match: true,
      name: ''
    };

    // TODO: Check name length and not search if not advanced search

    const random = formData?.random === 'on';

    if (random) {
      console.log('Random');
      queryParams.random = random;
    } else {
      try {
        const {
          name,
          minAge,
          minPlayers,
          maxPlayers,
          exactMinAge,
          exactMinPlayers,
          exactMaxPlayers
        } = search_schema.parse(formData);

        
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
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          console.log(error);
          
          const { fieldErrors: errors } = error.flatten();
          return invalid(400, { data: formData, errors });
        }
      }
    }

    const newQueryParams: Record<string, string> = {};
    for (const key in queryParams) {
      console.log('key', key);
      console.log('queryParams[key]', queryParams[key as keyof SearchQuery]);
      newQueryParams[key] = `${queryParams[key as keyof SearchQuery]}`;
    }

    const urlQueryParams = new URLSearchParams(newQueryParams);
    console.log('urlQueryParams', urlQueryParams);

    try {
      const url = `https://api.boardgameatlas.com/api/search${urlQueryParams ? `?${urlQueryParams}` : ''
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
          games,
          totalCount,
          limit: parseInt(limit),
          skip: parseInt(skip),
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
  }
}
