import { redirect } from 'sveltekit-flash-message/server';
import { notSignedInMessage } from '$lib/flashMessages';

export async function load(event) {
	const { url, locals } = event;
	if (locals.user) {
		redirect(302, '/', notSignedInMessage, event);
	}

	return {
		url: url.pathname,
		user: locals.user
	};
};
