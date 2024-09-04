import { notSignedInMessage } from '$lib/flashMessages'
import { db } from '$lib/server/api/packages/drizzle'
import { changeUserPasswordSchema } from '$lib/validations/account'
import { type Actions, fail } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { Cookie } from 'lucia'
import { Argon2id } from 'oslo/password'
import { redirect } from 'sveltekit-flash-message/server'
import { zod } from 'sveltekit-superforms/adapters'
import { setError, superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad } from '../../../$types'
import { usersTable } from '../../../../../../../lib/server/api/databases/tables'

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

		console.log('updating profile')
		if (!event.locals.user) {
			redirect(302, '/login', notSignedInMessage, event)
		}

		if (!event.locals.session) {
			return fail(401)
		}

		const dbUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.id, authedUser.id),
		})

		// if (!dbUser?.hashed_password) {
		// 	form.data.password = '';
		// 	form.data.confirm_password = '';
		// 	form.data.current_password = '';
		// 	return setError(
		// 		form,
		// 		'Error occurred. Please try again or contact support if you need further help.',
		// 	);
		// }

		const currentPasswordVerified = await new Argon2id().verify(
			// dbUser.hashed_password,
			form.data.current_password,
		)

		if (!currentPasswordVerified) {
			return setError(form, 'current_password', 'Your password is incorrect')
		}
		if (authedUser?.username) {
			let sessionCookie: Cookie
			try {
				if (form.data.password !== form.data.confirm_password) {
					return setError(form, 'Password and confirm password do not match')
				}
				const hashedPassword = await new Argon2id().hash(form.data.password)
				await lucia.invalidateUserSessions(authedUser.id)
				// await db
				// 	.update(usersTable)
				// 	.set({ hashed_password: hashedPassword })
				// 	.where(eq(usersTable.id, user.id));
				await lucia.createSession(user.id, {
					country: event.locals.session?.ipCountry ?? 'unknown',
				})
				sessionCookie = lucia.createBlankSessionCookie()
			} catch (e) {
				console.error(e)
				form.data.password = ''
				form.data.confirm_password = ''
				form.data.current_password = ''
				return setError(form, 'current_password', 'Your password is incorrect.')
			}
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			})

			const message = {
				type: 'success',
				message: 'Password Updated. Please sign in.',
			} as const
			redirect(302, '/login', message, event)
		}
		return setError(form, 'Error occurred. Please try again or contact support if you need further help.')
		// TODO: Add toast instead?
		// form.data.password = '';
		// form.data.confirm_password = '';
		// form.data.current_password = '';
		// return message(form, 'Profile updated successfully.');
	},
}
