import { fail, error, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import db from '../../../db';
import { lucia } from '$lib/server/auth';
import { signInSchema } from '$lib/validations/auth';
import { twoFactor, users, type Users } from '$db/schema';
import type { PageServerLoad } from './$types';
import { userFullyAuthenticated, userNotFullyAuthenticated } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
	const { locals, cookies } = event;
	const { user, session } = event.locals;

	if (userFullyAuthenticated(user, session)) {
		const message = { type: 'success', message: 'You are already signed in' } as const;
		throw redirect('/', message, event);
	} else if (userNotFullyAuthenticated(user, session)) {
		await lucia.invalidateSession(locals.session!.id!);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});
	}
	const form = await superValidate(event, zod(signInSchema));

	return {
		form,
	};
};

const limiter = new RateLimiter({
	// A rate is defined by [number, unit]
	IPUA: [5, 'm'],
});

export const actions: Actions = {
	default: async (event) => {
		if (await limiter.isLimited(event)) {
			throw error(429);
		}

		const { locals } = event;
		const form = await superValidate(event, zod(signInSchema));

		if (!form.valid) {
			form.data.password = '';
			return fail(400, {
				form,
			});
		}

		let session;
		let sessionCookie;
		const user: Users | undefined = await db.query.users.findFirst({
			where: eq(users.username, form.data.username),
		});

		if (!user) {
			form.data.password = '';
			return setError(form, 'username', 'Your username or password is incorrect.');
		}

		let twoFactorDetails;

		try {
			const password = form.data.password;
			console.log('user', JSON.stringify(user, null, 2));

			if (!user?.hashed_password) {
				console.log('invalid username/password');
				form.data.password = '';
				return setError(form, 'password', 'Your username or password is incorrect.');
			}

			const validPassword = await new Argon2id().verify(user.hashed_password, password);
			if (!validPassword) {
				console.log('invalid password');
				form.data.password = '';
				return setError(form, 'password', 'Your username or password is incorrect.');
			}

			console.log('ip', locals.ip);
			console.log('country', locals.country);

			twoFactorDetails = await db.query.twoFactor.findFirst({
				where: eq(twoFactor.userId, user?.id),
			});

			if (twoFactorDetails?.secret && twoFactorDetails?.enabled) {
				await db.update(twoFactor).set({
					initiated_time: new Date(),
				});

				session = await lucia.createSession(user.id, {
					ip_country: locals.country,
					ip_address: locals.ip,
					twoFactorAuthEnabled:
						twoFactorDetails?.enabled &&
						twoFactorDetails?.secret !== null &&
						twoFactorDetails?.secret !== '',
					isTwoFactorAuthenticated: false,
				});
			} else {
				session = await lucia.createSession(user.id, {
					ip_country: locals.country,
					ip_address: locals.ip,
					twoFactorAuthEnabled: false,
					isTwoFactorAuthenticated: false,
				});
			}
			console.log('logging in session', session);
			sessionCookie = lucia.createSessionCookie(session.id);
			console.log('logging in session cookie', sessionCookie);
		} catch (e) {
			// TODO: need to return error message to the client
			console.error(e);
			form.data.password = '';
			return setError(form, '', 'Your username or password is incorrect.');
		}

		console.log('setting session cookie', sessionCookie);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});

		form.data.username = '';
		form.data.password = '';

		if (
			twoFactorDetails?.enabled &&
			twoFactorDetails?.secret !== null &&
			twoFactorDetails?.secret !== ''
		) {
			console.log('redirecting to TOTP page');
			const message = { type: 'success', message: 'Please enter your TOTP code.' } as const;
			redirect(302, '/totp', message, event);
		} else {
			const message = { type: 'success', message: 'Signed In!' } as const;
			redirect(302, '/', message, event);
		}
	},
};
