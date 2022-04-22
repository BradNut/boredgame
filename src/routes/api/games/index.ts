import type { SearchQuery } from "$lib/types";
import type { RequestHandler } from "@sveltejs/kit";

export const post: RequestHandler = async ({ request }) => {
  const form = await request.formData();
  const queryParams : SearchQuery = {
    order_by: 'rank',
    ascending: false,
    limit: 2,
    client_id: import.meta.env.VITE_PUBLIC_CLIENT_ID,
  }

  const minAge = form.get('minAge');
  const minPlayers = form.get('minPlayers');
  const maxPlayers = form.get('maxPlayers');
  const exactMinAge = form.get('exactMinAge') === 'on' || false;
  const exactMinPlayers = form.get('exactMinPlayers') === 'on' || false;
  const exactMaxPlayers = form.get('exactMaxPlayers') === 'on' || false;
  const random = form.get('random') === 'on' || false;
  
  console.log("form.get('minAge')", form.get('minAge'));
  console.log("form.get('minPlayers')", form.get('minPlayers'));
  console.log("form.get('maxPlayers')", form.get('maxPlayers'));
  console.log("form.get('exactMinAge')", form.get('exactMinAge'));
  console.log("form.get('exactMinPlayers')", form.get('exactMinPlayers'));
  console.log("form.get('exactMaxPlayers')", form.get('exactMaxPlayers'));
  console.log("form.get('random')", form.get('random'));

  console.log('minAge',minAge);
  console.log('minPlayers',minPlayers);
  console.log('maxPlayers',maxPlayers);
  console.log('exactMinAge',exactMinAge);
  console.log('exactMinPlayers',exactMinPlayers);
  console.log('exactMaxPlayers',exactMaxPlayers);
  console.log('random',random);

  if (minAge) {
    if (exactMinAge) {
      queryParams.min_age = +minAge;
    } else {
      queryParams.gt_min_age = +minAge === 1 ? 0 : +minAge - 1;
    }
  }

  if (minPlayers) {
    if (exactMinPlayers) {
      queryParams.min_players = +minPlayers;
    } else {
      queryParams.gt_min_players = (+minPlayers === 1 ? 0 : (+minPlayers - 1));
    }
  }

  if (maxPlayers) {
    if (exactMaxPlayers) {
      queryParams.max_players = +maxPlayers;
    } else {
      queryParams.lt_max_players = +maxPlayers + 1;
    }
  }
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