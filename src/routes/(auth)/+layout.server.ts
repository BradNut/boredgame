import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals }) => {
	return {
		url: url.pathname,
		user: locals.user
	};
};
