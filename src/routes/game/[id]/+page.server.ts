import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'
import { boardGameApi } from '../../api';

type GamePageParams = {
  params: {
    id: string;
  }
}

export const load: PageServerLoad = async ({ params }: GamePageParams) => {
  console.log('params', params);
  const queryParams = {
    ids: `${params?.id}`
  };
  console.log('queryParams', queryParams);
  const response = await boardGameApi('get', `search`, queryParams);
  if (response.status === 404) {
    return {
      game: []
    };
  }

  if (response.status === 200) {
    const gameResponse = await response.json();
    // console.log('gameResponse', gameResponse);
    // const games = gameResponse?.games;
    console.log('game response', gameResponse?.games[0]);
    return {
      game: gameResponse?.games[0]
    };
  }

  throw error(response.status);
  // throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
};
