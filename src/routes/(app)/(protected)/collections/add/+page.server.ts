import { redirect } from '@sveltejs/kit';
import { notSignedInMessage } from '$lib/flashMessages';
import { userNotAuthenticated } from '$lib/server/auth-utils';

export async function load(event) {
	const { locals } = event;
	const { user, session } = locals;
	if (userNotAuthenticated(user, session)) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	return {};
}
