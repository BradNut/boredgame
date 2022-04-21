import type { SearchQuery } from "$lib/types";
import type { RequestHandler } from "@sveltejs/kit";

export const post: RequestHandler = async ({ request }) => {
  const form = await request.formData();
  const queryParams : SearchQuery = {
    order_by: 'rank',
    ascending: false,
    limit: 20,
    client_id: import.meta.env.VITE_PUBLIC_CLIENT_ID,
  }

  const minAge = form.get('minAge');
  const minPlayers = form.get('minPlayers');
  const maxPlayers = form.get('maxPlayers');
  const random = form.get('random') === 'on' || false;
  
  if (minPlayers) queryParams.gt_min_players = (+minPlayers === 1 ? 0 : (+minPlayers - 1));
  if (maxPlayers) queryParams.lt_max_players = +maxPlayers + 1;
  if (minAge) queryParams.gt_min_age = +minAge === 1 ? 0 : +minAge - 1;
  queryParams.random = random;

  const newQueryParams = {};
  for (const key in queryParams) {
    newQueryParams[key] = new String(queryParams[key]);
  }
  const urlQueryParams = new URLSearchParams(newQueryParams);
  console.log('urlQueryParams', JSON.stringify(urlQueryParams, null, 2));

  const url = `https://api.boardgameatlas.com/api/search${urlQueryParams ? `?${urlQueryParams}` : ''}`
  const response = await fetch(url, {
    method: 'get',
    headers: {
      'content-type': 'application/json'
    },
  });
  console.log('response', response);
  if (response.status === 404) {
    // user hasn't created a todo list.
    // start with an empty array
    return {
      body: {
        games: []
      }
    };
  }

  if (response.status === 200) {
    const gameResponse = await response.json();
    const games = gameResponse?.games;
    console.log('games', games);
    return {
      body: {
        games: gameResponse?.games,
      }
    };
  }

  return {
    status: response.status
  };
}