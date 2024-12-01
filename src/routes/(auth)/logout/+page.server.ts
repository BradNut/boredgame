import { StatusCodes } from '$lib/utils/status-codes';
import { redirect } from 'sveltekit-flash-message/server';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async (event) => {
    const { locals } = event;
    console.log('Signing out user');
    await locals.api.me.logout.$post();
    redirect(StatusCodes.SEE_OTHER, '/login');
  },
};
