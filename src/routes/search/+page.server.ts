import type { Actions, PageServerLoad } from '../$types';
import { Games } from '$root/search/actions';

export const load: PageServerLoad = (v) => {
	console.log('page server load request', v)

	return {
    games: [],
    totalCount: 0
	};
};

export const actions: Actions = {
  default: Games.search,
}