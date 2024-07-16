import { fail, error, type Actions } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import {resetPasswordEmailSchema, resetPasswordTokenSchema} from "$lib/validations/auth";
import {StatusCodes} from "$lib/constants/status-codes";

export const load: PageServerLoad = async (event) => {
	return {
		emailForm: await superValidate(zod(resetPasswordEmailSchema)),
		tokenForm: await superValidate(zod(resetPasswordTokenSchema)),
	};
};

export const actions = {
	passwordReset: async ({ locals, request }) => {
		const emailForm = await superValidate(request, zod(resetPasswordEmailSchema));
		if (!emailForm.valid) {
			return fail(StatusCodes.BAD_REQUEST, { emailForm });
		}
		const error = {};
		// const { error } = await locals.api.iam.login.request.$post({ json: emailRegisterForm.data }).then(locals.parseApiResponse);
		if (error) {
			return setError(emailForm, 'email', error);
		}
		return { emailForm };
	},
	verifyToken: async ({ locals, request }) => {
		const tokenForm = await superValidate(request, zod(resetPasswordTokenSchema));
		if (!tokenForm.valid) {
			return fail(StatusCodes.BAD_REQUEST, { tokenForm });
		}
		const error = {};
		// const { error } = await locals.api.iam.login.verify.$post({ json: emailSignInForm.data }).then(locals.parseApiResponse)
		if (error) {
			return setError(tokenForm, 'token', error);
		}
		redirect(301, '/');
	}
};
