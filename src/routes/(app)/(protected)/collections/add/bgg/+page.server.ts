import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from '../$types';
import { BggForm } from '$lib/zodValidation';
import { userNotFullyAuthenticated } from '$lib/server/auth-utils';
import { notSignedInMessage } from '$lib/flashMessages';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;
	const { user, session } = locals;
	if (userNotFullyAuthenticated(user, session)) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	const form = await superValidate({}, zod(BggForm));

	return { form };
};
