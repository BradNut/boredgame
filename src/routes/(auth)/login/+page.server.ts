import { fail, error, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { decodeHex } from 'oslo/encoding';
import { TOTPController } from 'oslo/otp';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import db from '$lib/drizzle';
import { lucia } from '$lib/server/auth';
import { signInSchema } from '$lib/validations/auth';
import { collections, users, wishlists } from '../../../schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		const message = { type: 'success', message: 'You are already signed in' } as const;
		throw redirect('/', message, event);
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
		try {
			const password = form.data.password;

			const user = await db.query.users.findFirst({
				where: eq(users.username, form.data.username),
			});

			console.log('user', JSON.stringify(user, null, 2));

			if (!user?.hashed_password) {
				form.data.password = '';
				return setError(form, '', 'Your username or password is incorrect.');
			}

			const validPassword = await new Argon2id().verify(user.hashed_password, password);
			if (!validPassword) {
				console.log('invalid password');
				form.data.password = '';
				return setError(form, '', 'Your username or password is incorrect.');
			}

			await db
				.insert(collections)
				.values({
					user_id: user.id,
				})
				.onConflictDoNothing();
			await db
				.insert(wishlists)
				.values({
					user_id: user.id,
				})
				.onConflictDoNothing();

			if (user?.two_factor_enabled && user?.two_factor_secret && !form?.data?.totpToken) {
				return fail(400, {
					form,
					twoFactorRequired: true,
				});
			} else if (user?.two_factor_enabled && user?.two_factor_secret && form?.data?.totpToken) {
				console.log('totpToken', form.data.totpToken);
				const validOTP = await new TOTPController().verify(
					form.data.totpToken,
					decodeHex(user.two_factor_secret)
				);
				console.log('validOTP', validOTP);
				form.errors.totpToken = ['Invalid TOTP code'];
				if (!validOTP) {
					return fail(400, {
						form,
						twoFactorRequired: true,
					});
				}
			}
			console.log('ip', locals.ip);
			console.log('country', locals.country);
			session = await lucia.createSession(user.id, {
				ip_country: locals.country,
				ip_address: locals.ip,
			});
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
		const message = { type: 'success', message: 'Signed In!' } as const;
		redirect(302, '/', message, event);
	},
};
