import { json as json$1 } from '@sveltejs/kit';
import { boardGameApi } from '$root/routes/api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  const queryParams = {
    ids: `${params?.id}`
  };
  console.log('queryParams', queryParams);
  const response = await boardGameApi('get', `search`, queryParams);
  if (response.status === 404) {
    return json$1({
      games: []
    });
  }

  if (response.status === 200) {
    const gameResponse = await response.json();
    // console.log('gameResponse', gameResponse);
    // const games = gameResponse?.games;
    console.log('game', gameResponse?.games[0]);
    return json$1({
      game: gameResponse?.games[0]
    });
  }

  return new Response(undefined, { status: response.status });
};
