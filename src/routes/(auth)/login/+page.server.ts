import { StatusCodes } from '$lib/constants/status-codes'
import { signinUsernameDto } from '$lib/dtos/signin-username.dto'
import { type Actions, fail } from '@sveltejs/kit'
import { redirect } from 'sveltekit-flash-message/server'
import { zod } from 'sveltekit-superforms/adapters'
import { setError, superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const { locals } = event

	const authedUser = await locals.getAuthedUser()

	if (authedUser) {
		console.log('user already signed in')
		const message = { type: 'success', message: 'You are already signed in' } as const
		throw redirect('/', message, event)
		// redirect(302, '/', message, event)
	}
	const form = await superValidate(event, zod(signinUsernameDto))

	return {
		form,
	}
}

export const actions: Actions = {
	default: async (event) => {
		const { locals } = event

		const authedUser = await locals.getAuthedUser()

		if (authedUser) {
			const message = { type: 'success', message: 'You are already signed in' } as const
			throw redirect('/', message, event)
		}

		const form = await superValidate(event, zod(signinUsernameDto))

		const { error } = await locals.api.login.$post({ json: form.data }).then(locals.parseApiResponse)
		if (error) {
			return setError(form, 'username', error)
		}

		if (!form.valid) {
			form.data.password = ''
			return fail(400, {
				form,
			})
		}

		form.data.username = ''
		form.data.password = ''

		redirect(StatusCodes.TEMPORARY_REDIRECT, '/')

		// if (
		// 	twoFactorDetails?.enabled &&
		// 	twoFactorDetails?.secret !== null &&
		// 	twoFactorDetails?.secret !== ''
		// ) {
		// 	console.log('redirecting to TOTP page');
		// 	const message = { type: 'success', message: 'Please enter your TOTP code.' } as const;
		// 	redirect(302, '/totp', message, event);
		// } else {
		// 	const message = { type: 'success', message: 'Signed In!' } as const;
		// 	redirect(302, '/', message, event);
		// }
	},
}
