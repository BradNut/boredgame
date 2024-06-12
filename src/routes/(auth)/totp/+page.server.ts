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
import { totpSchema } from '$lib/validations/auth';
import { users, recovery_codes } from '$db/schema';
import type { PageServerLoad } from './$types';
import { notSignedInMessage } from '$lib/flashMessages';

export const load: PageServerLoad = async (event) => {
	const { user, session } = event.locals;

	if (!user || !session) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	if (user && session) {
		const dbUser = await db.query.users.findFirst({
			where: eq(users.username, user.username),
		});

		const isTwoFactorAuthenticated = session?.isTwoFactorAuthenticated;

		console.log('session', session);
		console.log('isTwoFactorAuthenticated', isTwoFactorAuthenticated);

		if (
			isTwoFactorAuthenticated &&
			dbUser?.two_factor_enabled &&
			dbUser?.two_factor_secret !== ''
		) {
			const message = { type: 'success', message: 'You are already signed in' } as const;
			throw redirect('/', message, event);
		}
	}

	const form = await superValidate(event, zod(totpSchema));

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
		const session = locals.session;
		const user = locals.user;

		if (!user || !session) {
			throw fail(401);
		}

		const dbUser = await db.query.users.findFirst({
			where: eq(users.username, user.username),
		});

		if (!dbUser) {
			throw fail(401);
		}

		const isTwoFactorAuthenticated = session?.isTwoFactorAuthenticated;

		if (
			isTwoFactorAuthenticated &&
			dbUser?.two_factor_enabled &&
			dbUser?.two_factor_secret !== ''
		) {
			const message = { type: 'success', message: 'You are already signed in' } as const;
			throw redirect('/', message, event);
		}

		const form = await superValidate(event, zod(totpSchema));

		if (!form.valid) {
			form.data.totpToken = '';
			return fail(400, {
				form,
			});
		}

		let sessionCookie;
		try {
			const totpToken = form?.data?.totpToken;

			if (dbUser?.two_factor_enabled && dbUser?.two_factor_secret !== '' && !totpToken) {
				return fail(400, {
					form,
				});
			} else if (dbUser?.two_factor_enabled && dbUser?.two_factor_secret !== '' && totpToken) {
				console.log('totpToken', totpToken);
				const validOTP = await new TOTPController().verify(
					totpToken,
					decodeHex(dbUser.two_factor_secret),
				);
				console.log('validOTP', validOTP);

				if (!validOTP) {
					console.log('invalid TOTP code check for recovery codes');
					const usedRecoveryCode = await checkRecoveryCode(totpToken, dbUser.id);
					if (!usedRecoveryCode) {
						console.log('invalid TOTP code');
						return setError(form, 'totpToken', 'Invalid code.');
					}
				}
			}
			console.log('ip', locals.ip);
			console.log('country', locals.country);
			await lucia.invalidateSession(session.id);
			const newSession = await lucia.createSession(dbUser.id, {
				ip_country: locals.country,
				ip_address: locals.ip,
				twoFactorAuthEnabled: true,
				isTwoFactorAuthenticated: true,
			});
			console.log('logging in session', newSession);
			sessionCookie = lucia.createSessionCookie(newSession.id);
			console.log('logging in session cookie', sessionCookie);
		} catch (e) {
			// TODO: need to return error message to the client
			console.error(e);
			return setError(form, 'totpToken', 'Error verifying TOTP code.');
		}

		console.log('setting session cookie', sessionCookie);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});

		form.data.totpToken = '';
		const message = { type: 'success', message: 'Signed In!' } as const;
		redirect(302, '/', message, event);
	},
};

async function checkRecoveryCode(recoveryCode: string, userId: string) {
	const userRecoveryCodes = await db.query.recoveryCodes.findMany({
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
