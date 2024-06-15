import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { notSignedInMessage } from '$lib/flashMessages';
import { userNotFullyAuthenticated } from '$lib/server/auth-utils';

export async function load(event) {
	const { locals } = event;
	const { user, session } = locals;
	if (userNotFullyAuthenticated(user, session)) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	return {};
}
