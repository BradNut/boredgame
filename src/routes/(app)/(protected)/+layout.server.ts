import { loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from '../$types';
import { redirect } from 'sveltekit-flash-message/server';
import { notSignedInMessage } from '$lib/flashMessages';

export const load: LayoutServerLoad = loadFlash(async (event) => {
  const { locals, url } = event;

  const { user, session } = await locals.getAuthedUser();
  console.log('User from protected route', user);
  console.log('Session from protected route', session);
  if (session === null) {
    throw redirect(302, '/landing', notSignedInMessage, event);
  }
  if (session?.twoFactorEnabled && !session?.twoFactorVerified) {
    throw redirect(302, '/login', notSignedInMessage, event);
  }

  return {
    url: url.pathname,
    user: {
			cuid: user?.cuid,
      firstName: user?.firstName,
      lastName: user?.lastName,
      username: user?.username,
    },
  };
});
