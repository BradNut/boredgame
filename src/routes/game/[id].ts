import type { RequestHandler } from '@sveltejs/kit';
import { boardGameApi } from '../_api';

export const get: RequestHandler = async ({ params }) => {
  // console.log('params', params);
  const queryParams = {
    ids: `${params?.id}`,
  }
  console.log('queryParams', queryParams);
  const response = await boardGameApi('get', `search`, queryParams);
  if (response.status === 404) {
    return {
      body: {
        games: []
      }
    };
  }

  if (response.status === 200) {
    const gameResponse = await response.json();
    // console.log('gameResponse', gameResponse);
    // const games = gameResponse?.games;
    console.log('game', gameResponse?.games[0]);
    return {
      body: {
        game: gameResponse?.games[0],
      }
    };
  }

  return {
    status: response.status
  };
}

// export const post: RequestHandler = async ({ request }) => {
//   const form = await request.formData();
//   const minAge = form.get('minAge') || 0;
//   console.log('minAge', minAge);
//   const maxAge = form.get('maxAge') || 0;
//   console.log('maxAge', maxAge);
//   const minPlayers = form.get('minPlayers') || 1;
//   console.log('minPlayers', minPlayers);
//   const maxPlayers = form.get('maxPlayers') || 1;
//   console.log('maxPlayers', maxPlayers);

//   const queryParams = {
//     order_by: 'rank',
//     ascending: 'false',
//     limit: '1',
//     gt_min_players: String(+minPlayers === 1 ? 0 : +minPlayers - 1),
//     lt_max_players: String(+maxPlayers + 1),
//     gt_min_age: String(+minAge === 1 ? 0 : +minAge - 1),
//     lt_max_age: String(+maxAge + 1),
//   }
//   const response = await boardGameApi('get', `search`, queryParams);
//   console.log('response', response);
//   if (response.status === 404) {
//     // user hasn't created a todo list.
//     // start with an empty array
//     return {
//       body: {
//         games: []
//       }
//     };
//   }

//   if (response.status === 200) {
//     const gameResponse = await response.json();
//     const games = gameResponse?.games;
//     console.log('games', games);
//     return {
//       body: {
//         games,
//       }
//     };
//   }

//   return {
//     status: response.status
//   };
// }
