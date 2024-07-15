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
import { recoveryCodeSchema, totpSchema } from '$lib/validations/auth';
import { users, twoFactor, recoveryCodes } from '$db/schema';
import type { PageServerLoad } from './$types';
import { notSignedInMessage } from '$lib/flashMessages';
import env from '../../../env';

export const load: PageServerLoad = async (event) => {
	const { cookies, locals } = event;
	const { user, session } = locals;

	if (!user || !session) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	if (user && session) {
		const dbUser = await db.query.users.findFirst({
			where: eq(users.username, user.username),
		});

		const twoFactorDetails = await db.query.twoFactor.findFirst({
			where: eq(twoFactor.userId, dbUser!.id!),
		});

		if (!twoFactorDetails || !twoFactorDetails.enabled) {
			const message = {
				type: 'error',
				message: 'Two factor authentication is not enabled',
			} as const;
			redirect(302, '/login', message, event);
		}

		let twoFactorInitiatedTime = twoFactorDetails.initiatedTime;
		if (twoFactorInitiatedTime === null) {
			console.log('twoFactorInitiatedTime is null');
			twoFactorInitiatedTime = new Date();
			console.log('twoFactorInitiatedTime', twoFactorInitiatedTime);
			await db
				.update(twoFactor)
				.set({ initiatedTime: twoFactorInitiatedTime })
				.where(eq(twoFactor.userId, dbUser!.id!));
		}

		// Check if two factor started less than TWO_FACTOR_TIMEOUT
		const totpElapsed = totpTimeElapsed(twoFactorInitiatedTime);
		if (totpElapsed) {
			console.log(
				'Time elapsed was more than TWO_FACTOR_TIMEOUT',
				totpElapsed,
				env.TWO_FACTOR_TIMEOUT,
			);
			await lucia.invalidateSession(session!.id!);
			const sessionCookie = lucia.createBlankSessionCookie();
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});
			const message = { type: 'error', message: 'Two factor authentication has expired' } as const;
			redirect(302, '/login', message, event);
		}

		const isTwoFactorAuthenticated = session?.isTwoFactorAuthenticated;

		console.log('session', session);
		console.log('isTwoFactorAuthenticated', isTwoFactorAuthenticated);

		if (isTwoFactorAuthenticated && twoFactorDetails?.enabled && twoFactorDetails?.secret !== '') {
			const message = { type: 'success', message: 'You are already signed in' } as const;
			throw redirect('/', message, event);
		}
	}

	return {
		totpForm: await superValidate(event, zod(totpSchema)),
		recoveryCodeForm: await superValidate(event, zod(recoveryCodeSchema)),
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

		const { cookies, locals } = event;
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
		const twoFactorDetails = await db.query.twoFactor.findFirst({
			where: eq(twoFactor.userId, dbUser!.id!),
		});

		if (!twoFactorDetails) {
			const message = { type: 'error', message: 'Unable to process request' } as const;
			throw redirect(302, '/login', message, event);
		}

		if (isTwoFactorAuthenticated && twoFactorDetails.enabled && twoFactorDetails.secret !== '') {
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

			const twoFactorSecretPopulated =
				twoFactorDetails.secret !== '' && twoFactorDetails.secret !== null;
			if (twoFactorDetails.enabled && !twoFactorSecretPopulated && !totpToken) {
				return fail(400, {
					form,
				});
			} else if (twoFactorSecretPopulated && totpToken) {
				// Check if two factor started less than TWO_FACTOR_TIMEOUT
				const totpElapsed = totpTimeElapsed(twoFactorDetails.initiatedTime ?? new Date());
				if (totpElapsed) {
					await lucia.invalidateSession(session!.id!);
					const sessionCookie = lucia.createBlankSessionCookie();
					cookies.set(sessionCookie.name, sessionCookie.value, {
						path: '.',
						...sessionCookie.attributes,
					});
					const message = {
						type: 'error',
						message: 'Two factor authentication has expired',
					} as const;
					redirect(302, '/login', message, event);
				}

				console.log('totpToken', totpToken);
				const validOTP = await new TOTPController().verify(
					totpToken,
					decodeHex(twoFactorDetails.secret ?? ''),
				);
				console.log('validOTP', validOTP);

				if (!validOTP) {
					console.log('invalid TOTP code check for recovery codes');
					const usedRecoveryCode = await checkRecoveryCode(totpToken, dbUser.id);
					if (!usedRecoveryCode) {
						console.log('invalid TOTP code');
						form.data.totpToken = '';
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

function totpTimeElapsed(initiatedTime: Date) {
	if (initiatedTime === null || initiatedTime === undefined) {
		return true;
	}

	const timeElapsed = Date.now() - initiatedTime.getTime();
	console.log('Time elapsed', timeElapsed);
	if (timeElapsed > env.TWO_FACTOR_TIMEOUT) {
		console.log(
			'Time elapsed was more than TWO_FACTOR_TIMEOUT',
			timeElapsed,
			env.TWO_FACTOR_TIMEOUT,
		);
		return true;
	}
	return false;
}

async function checkRecoveryCode(recoveryCode: string, userId: string) {
	const userRecoveryCodes = await db.query.recoveryCodes.findMany({
		where: and(eq(recoveryCodes.used, false), eq(recoveryCodes.userId, userId)),
	});
	for (const code of userRecoveryCodes) {
		const validRecoveryCode = await new Argon2id().verify(code.code, recoveryCode);
		if (validRecoveryCode) {
			await db
				.update(recoveryCodes)
				.set({
					used: true,
				})
				.where(eq(recoveryCodes.id, code.id));
			return true;
		}
	}
	return false;
}
