import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'
import { boardGameApi } from '../../api';

type GamePageParams = {
  params: {
    id: string;
  }
}

export const load: PageServerLoad = async ({ params }: GamePageParams) => {
  const queryParams = {
    ids: `${params?.id}`
  };
  
  const response = await boardGameApi('get', `search`, queryParams);

  if (response.status === 200) {
    const gameResponse = await response.json();
    return {
      game: gameResponse?.games[0]
    };
  }

  throw error(response.status, 'not found');
};
