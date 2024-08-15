import { loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = loadFlash(async (event) => {
	const { locals, url } = event;
	const user = await locals.getAuthedUser();
	return {
		url: url.pathname,
		user,
	};
});
