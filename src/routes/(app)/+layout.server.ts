import { loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = loadFlash(async ({ url, locals }) => {
	console.log('user from app', locals.user);
	return {
		url: url.pathname,
		user: locals.user
	};
});
