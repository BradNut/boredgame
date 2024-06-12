import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { notSignedInMessage } from '$lib/flashMessages';
import { userFullyAuthenticated } from '$lib/server/auth-utils';

export async function load(event) {
	const { locals } = event;
	const { user, session } = locals;
	if (userFullyAuthenticated(user, session)) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	return {};
}
