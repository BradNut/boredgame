import { boardGameApi } from '$root/routes/_api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  const queryParams = {
    ids: `${params?.id}`
  };
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
        game: gameResponse?.games[0]
      }
    };
  }

  return {
    status: response.status
  };
};
