import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals }) => {
	if (locals.user) {
		redirect(302, '/');
	}

	return {
		url: url.pathname,
		user: locals.user
	};
};
