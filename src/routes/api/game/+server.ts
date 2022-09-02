import { json as json$1 } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { GameType, SearchQuery } from '$lib/types';
import { mapAPIGameToBoredGame } from '$lib/util/gameMapper';

export const POST: RequestHandler = async ({ request }) => {
  const form = await request.formData();
  console.log('form', form);
  const queryParams: SearchQuery = {
    order_by: 'rank',
    ascending: false,
    limit: 25,
    client_id: import.meta.env.VITE_PUBLIC_CLIENT_ID,
    fuzzy_match: true,
    name: ''
  };

  queryParams.name = `${form.get('name')}`;

  const newQueryParams = {};
  for (const key in queryParams) {
    console.log('key', key);
    console.log('queryParams[key]', queryParams[key]);
    newQueryParams[key] = `${queryParams[key]}`;
  }

  const urlQueryParams = new URLSearchParams(newQueryParams);

  const url = `https://api.boardgameatlas.com/api/search${urlQueryParams ? `?${urlQueryParams}` : ''
    }`;
  const response = await fetch(url, {
    method: 'get',
    headers: {
      'content-type': 'application/json'
    }
  });
  // console.log('board game response', response);
  if (response.status === 404) {
    // user hasn't created a todo list.
    // start with an empty array
    return json$1({
      games: []
    });
  }

  if (response.status === 200) {
    const gameResponse = await response.json();
    const gameList = gameResponse?.games;
    const totalCount = gameResponse?.count;
    console.log('totalCount', totalCount);
    const games: GameType[] = [];
    gameList.forEach((game) => {
      games.push(mapAPIGameToBoredGame(game));
    });

    return json$1({
      totalCount,
      games
    });
  }

  return new Response(undefined, { status: response.status });
};
