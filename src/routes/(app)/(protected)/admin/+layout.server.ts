import { redirect } from 'sveltekit-flash-message/server'
import type { PageServerLoad } from './$types';
import { notSignedInMessage } from '$lib/flashMessages';

export async function load(event) {
	const { locals } = event;
	if (!locals?.user?.role?.includes('admin')) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	return {}
};
