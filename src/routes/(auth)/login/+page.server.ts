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
		const message = { type: 'success', message: 'You are already signed in' } as const
		throw redirect('/', message, event)
	}

	// if (userFullyAuthenticated(user, session)) {
	// 	const message = { type: 'success', message: 'You are already signed in' } as const;
	// 	throw redirect('/', message, event);
	// } else if (userNotFullyAuthenticated(user, session)) {
	// 	await lucia.invalidateSession(locals.session!.id!);
	// 	const sessionCookie = lucia.createBlankSessionCookie();
	// 	cookies.set(sessionCookie.name, sessionCookie.value, {
	// 		path: '.',
	// 		...sessionCookie.attributes,
	// 	});
	// }
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

		// let session;
		// let sessionCookie;
		// const user: Users | undefined = await db.query.usersTable.findFirst({
		// 	where: or(eq(usersTable.username, form.data.username), eq(usersTable.email, form.data.username)),
		// });
		//
		// if (!user) {
		// 	form.data.password = '';
		// 	return setError(form, 'username', 'Your username or password is incorrect.');
		// }
		//
		// let twoFactorDetails;
		//
		try {
			// 	const password = form.data.password;
			// 	console.log('user', JSON.stringify(user, null, 2));
			//
			// 	if (!user?.hashed_password) {
			// 		console.log('invalid username/password');
			// 		form.data.password = '';
			// 		return setError(form, 'password', 'Your username or password is incorrect.');
			// 	}
			//
			// 	const validPassword = await new Argon2id().verify(user.hashed_password, password);
			// 	if (!validPassword) {
			// 		console.log('invalid password');
			// 		form.data.password = '';
			// 		return setError(form, 'password', 'Your username or password is incorrect.');
			// 	}
			//
			// 	console.log('ip', locals.ip);
			// 	console.log('country', locals.country);
			//
			// 	twoFactorDetails = await db.query.twoFactor.findFirst({
			// 		where: eq(twoFactor.userId, user?.id),
			// 	});
			//
			// 	if (twoFactorDetails?.secret && twoFactorDetails?.enabled) {
			// 		await db.update(twoFactor).set({
			// 			initiatedTime: new Date(),
			// 		});
			//
			// 		session = await lucia.createSession(user.id, {
			// 			ip_country: locals.country,
			// 			ip_address: locals.ip,
			// 			twoFactorAuthEnabled:
			// 				twoFactorDetails?.enabled &&
			// 				twoFactorDetails?.secret !== null &&
			// 				twoFactorDetails?.secret !== '',
			// 			isTwoFactorAuthenticated: false,
			// 		});
			// 	} else {
			// 		session = await lucia.createSession(user.id, {
			// 			ip_country: locals.country,
			// 			ip_address: locals.ip,
			// 			twoFactorAuthEnabled: false,
			// 			isTwoFactorAuthenticated: false,
			// 		});
			// 	}
			// 	console.log('logging in session', session);
			// 	sessionCookie = lucia.createSessionCookie(session.id);
			// 	console.log('logging in session cookie', sessionCookie);
		} catch (e) {
			// TODO: need to return error message to the client
			console.error(e)
			form.data.password = ''
			return setError(form, '', 'Your username or password is incorrect.')
		}

		// console.log('setting session cookie', sessionCookie);
		// event.cookies.set(sessionCookie.name, sessionCookie.value, {
		// 	path: '.',
		// 	...sessionCookie.attributes,
		// });

		form.data.username = ''
		form.data.password = ''

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
