import { signupUsernameEmailDto } from '$lib/dtos/signup-username-email.dto'
import { type Actions, error, fail } from '@sveltejs/kit'
import { redirect } from 'sveltekit-flash-message/server'
import { zod } from 'sveltekit-superforms/adapters'
import { setError, superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad } from './$types'

const signUpDefaults = {
	firstName: '',
	lastName: '',
	email: '',
	username: '',
	password: '',
	confirm_password: '',
	terms: true,
}

export const load: PageServerLoad = async (event) => {
	const { locals } = event

	const authedUser = await locals.getAuthedUser()

	if (authedUser) {
		const message = { type: 'success', message: 'You are already signed in' } as const
		throw redirect('/', message, event)
	}

	// if (userFullyAuthenticated(user, session)) {
	// 	const message = { type: 'success', message: 'You are already signed in' } as const;
	// 	throw redirect('/', message, event);
	// } else if (userNotFullyAuthenticated(user, session)) {
	// 	try {
	// 		await lucia.invalidateSession(locals.session!.id!);
	// 	} catch (error) {
	// 		console.log('Session already invalidated');
	// 	}
	// 	const sessionCookie = lucia.createBlankSessionCookie();
	// 	cookies.set(sessionCookie.name, sessionCookie.value, {
	// 		path: '.',
	// 		...sessionCookie.attributes,
	// 	});
	// }

	return {
		form: await superValidate(zod(signupUsernameEmailDto), {
			defaults: signUpDefaults,
		}),
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

		const form = await superValidate(event, zod(signupUsernameEmailDto))

		const { error } = await locals.api.signup.$post({ json: form.data }).then(locals.parseApiResponse)
		if (error) return setError(form, 'username', error)

		if (!form.valid) {
			form.data.password = ''
			form.data.confirm_password = ''
			return fail(400, {
				form,
			})
		}

		// let session;
		// let sessionCookie;
		// // Adding user to the db
		// console.log('Check if user already exists');
		//
		// const existing_user = await db.query.usersTable.findFirst({
		// 	where: eq(usersTable.username, form.data.username),
		// });
		//
		// if (existing_user) {
		// 	return setError(form, 'username', 'You cannot create an account with that username');
		// }
		//
		// console.log('Creating user');
		//
		// const hashedPassword = await new Argon2id().hash(form.data.password);
		//
		// const user = await db
		// 	.insert(usersTable)
		// 	.values({
		// 		username: form.data.username,
		// 		hashed_password: hashedPassword,
		// 		email: form.data.email,
		// 		first_name: form.data.firstName ?? '',
		// 		last_name: form.data.lastName ?? '',
		// 		verified: false,
		// 		receive_email: false,
		// 		theme: 'system',
		// 	})
		// 	.returning();
		// console.log('signup user', user);
		//
		// if (!user || user.length === 0) {
		// 	return fail(400, {
		// 		form,
		// 		message: `Could not create your account. Please try again. If the problem persists, please contact support. Error ID: ${cuid2()}`,
		// 	});
		// }
		//
		// await add_user_to_role(user[0].id, 'user', true);
		// await db.insert(collections).values({
		// 	user_id: user[0].id,
		// });
		// await db.insert(wishlistsTable).values({
		// 	user_id: user[0].id,
		// });
		//
		// try {
		// 	session = await lucia.createSession(user[0].id, {
		// 		ip_country: event.locals.ip,
		// 		ip_address: event.locals.country,
		// 		twoFactorAuthEnabled: false,
		// 		isTwoFactorAuthenticated: false,
		// 	});
		// 	sessionCookie = lucia.createSessionCookie(session.id);
		// } catch (e: any) {
		// 	if (e.message.toUpperCase() === `DUPLICATE_KEY_ID`) {
		// 		// key already exists
		// 		console.error('Lucia Error: ', e);
		// 	}
		// 	console.log(e);
		// 	const message = {
		// 		type: 'error',
		// 		message: 'Unable to create your account. Please try again.',
		// 	};
		// 	form.data.password = '';
		// 	form.data.confirm_password = '';
		// 	error(500, message);
		// }
		//
		// event.cookies.set(sessionCookie.name, sessionCookie.value, {
		// 	path: '.',
		// 	...sessionCookie.attributes,
		// });

		redirect(302, '/')
		// const message = { type: 'success', message: 'Signed Up!' } as const;
		// throw flashRedirect(message, event);
	},
}
