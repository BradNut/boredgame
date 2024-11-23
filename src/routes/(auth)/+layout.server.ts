import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const { url, locals } = event;
	const { user, session } = await locals.getAuthedUser();

	return {
		url: url.pathname,
		user,
	};
}
