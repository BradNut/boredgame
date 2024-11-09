import { notSignedInMessage } from '$lib/flashMessages';
import { BggForm } from '$lib/zodValidation';
import { redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;

	const authedUser = await locals.getAuthedUser();
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event);
	}

	const form = await superValidate({}, zod(BggForm));

	return { form };
};
