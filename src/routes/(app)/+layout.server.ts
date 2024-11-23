import { loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = loadFlash(async (event) => {
	const { url, locals } = event;
	const { user } = await locals.getAuthedUser();

	return {
		url: url.pathname,
		user: user ? {
			cuid: user?.cuid,
			firstName: user?.firstName,
			lastName: user?.lastName,
			username: user?.username,
		} : null,
	};
});
