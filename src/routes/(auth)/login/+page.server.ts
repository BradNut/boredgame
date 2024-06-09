import { fail, error, type Actions } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { decodeHex } from 'oslo/encoding';
import { TOTPController } from 'oslo/otp';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import db from '../../../db';
import { lucia } from '$lib/server/auth';
import { signInSchema } from '$lib/validations/auth';
import { users, recovery_codes } from '$db/schema';
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
		const user = await db.query.users.findFirst({
			where: eq(users.username, form.data.username),
		});


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
			session = await lucia.createSession(user.id, {
				ip_country: locals.country,
				ip_address: locals.ip,
				isTwoFactorAuthenticated: false,
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

		if (user?.two_factor_enabled && user?.two_factor_secret) {
			console.log('redirecting to TOTP page');
			const message = { type: 'success', message: 'Please enter your TOTP code.' } as const;
			redirect(302, '/totp', message, event);
		} else {
			const message = { type: 'success', message: 'Signed In!' } as const;
			redirect(302, '/', message, event);
		}
	},
};

async function checkRecoveryCode(recoveryCode: string, userId: string) {
	const userRecoveryCodes = await db.query.recovery_codes.findMany({
		where: and(eq(recovery_codes.used, false), eq(recovery_codes.userId, userId)),
	});
	for (const code of userRecoveryCodes) {
		const validRecoveryCode = await new Argon2id().verify(code.code, recoveryCode);
		if (validRecoveryCode) {
			await db
				.update(recovery_codes)
				.set({
					used: true,
				})
				.where(eq(recovery_codes.id, code.id));
			return true;
		}
	}
	return false;
}
