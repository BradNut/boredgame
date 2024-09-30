import { notSignedInMessage } from '$lib/flashMessages'
import { type Actions, fail } from '@sveltejs/kit'
import { redirect } from 'sveltekit-flash-message/server'
import { zod } from 'sveltekit-superforms/adapters'
import { setError, superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad } from './$types'
import { changeUserPasswordSchema } from './schemas'

export const load: PageServerLoad = async (event) => {
	const { locals } = event

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	const form = await superValidate(event, zod(changeUserPasswordSchema))

	form.data = {
		current_password: '',
		password: '',
		confirm_password: '',
	}
	return {
		form,
	}
}

export const actions: Actions = {
	default: async (event) => {
		const { locals } = event

		const authedUser = await locals.getAuthedUser()
		if (!authedUser) {
			throw redirect(302, '/login', notSignedInMessage, event)
		}

		const form = await superValidate(event, zod(changeUserPasswordSchema))

		if (!form.valid) {
			return fail(400, {
				form,
			})
		}

		const { error: verifyPasswordError } = await locals.api.me.verify.password
			.$post({
				json: { password: form.data.current_password },
			})
			.then(locals.parseApiResponse)

		console.log('verifyPasswordError', verifyPasswordError)

		if (verifyPasswordError) {
			console.error(verifyPasswordError)
			return setError(form, 'current_password', 'Your password is incorrect')
		}
		if (authedUser?.username) {
			try {
				if (form.data.password !== form.data.confirm_password) {
					return setError(form, 'Password and confirm password do not match')
				}
				await locals.api.me.update.password.$put({
					json: { password: form.data.password, confirm_password: form.data.confirm_password },
				})
			} catch (e) {
				console.error(e)
				form.data.password = ''
				form.data.confirm_password = ''
				form.data.current_password = ''
				return setError(form, 'current_password', 'Your password is incorrect.')
			}
			const message = {
				type: 'success',
				message: 'Password Updated. Please sign in.',
			} as const
			redirect(302, '/login', message, event)
		}
		return setError(form, 'Error occurred. Please try again or contact support if you need further help.')
	},
}
