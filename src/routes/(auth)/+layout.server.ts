import { redirect } from 'sveltekit-flash-message/server';
import { notSignedInMessage } from '$lib/flashMessages';

export async function load(event) {
	const { url, locals } = event;

	return {
		url: url.pathname,
		user: locals.user
	};
};
