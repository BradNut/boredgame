import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { redirect } from 'sveltekit-flash-message/server';
import { db } from '$lib/server/api/infrastructure/database';
import { notSignedInMessage } from '$lib/flashMessages';
import type { PageServerLoad } from '../../../$types';
import { recoveryCodesTable, twoFactorTable, usersTable} from '$lib/server/api/infrastructure/database/tables';
import { userNotAuthenticated } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;

	const authedUser = await locals.getAuthedUser();
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event);
	}

	const dbUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.id, authedUser.id),
	});

	if (!dbUser) {
		throw redirect(302, '/login', notSignedInMessage, event);
	}

	const twoFactorDetails = await db.query.twoFactor.findFirst({
		where: eq(twoFactor.userId, dbUser.id),
	});

	if (twoFactorDetails?.enabled) {
		const dbRecoveryCodes = await db.query.recoveryCodes.findMany({
			where: eq(recoveryCodes.userId, authedUser.id),
		});

		if (dbRecoveryCodes.length === 0) {
			const createdRecoveryCodes = Array.from({ length: 5 }, () =>
				generateRandomString(10, alphabet('A-Z', '0-9')),
			);
			if (createdRecoveryCodes) {
				for (const code of createdRecoveryCodes) {
					const hashedCode = await new Argon2id().hash(code);
					console.log('Inserting recovery code', code, hashedCode);
					await db.insert(recoveryCodes).values({
						userId: authedUser.id,
						code: hashedCode,
					});
				}
			}
			return {
				recoveryCodes: createdRecoveryCodes,
			};
		}
		return {
			recoveryCodes: [],
		};
	} else {
		console.error('2FA not enabled');
		redirect(
			302,
			'/profile',
			{ message: 'Two-Factor Authentication is not enabled', type: 'error' },
			event,
		);
	}
};
