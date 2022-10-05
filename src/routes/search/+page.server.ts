import type { Actions } from '../$types';
import { Games } from '$root/search/actions';

export const actions: Actions = {
  default: Games.search,
}