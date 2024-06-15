import db from '../../../../../../../db';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { redirect } from 'sveltekit-flash-message/server';
import { notSignedInMessage } from '$lib/flashMessages';
import type { PageServerLoad } from '../../../$types';
import { recoveryCodes, users } from '$db/schema';
import { userNotFullyAuthenticated } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;
	const { user, session } = locals;
	if (userNotFullyAuthenticated(user, session)) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	const dbUser = await db.query.users.findFirst({
		where: eq(users.id, user.id),
	});

	if (dbUser?.two_factor_enabled) {
		const dbRecoveryCodes = await db.query.recoveryCodes.findMany({
			where: eq(recoveryCodes.userId, user.id),
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
						userId: user.id,
						code: hashedCode,
					});
				}
			}
			return {
				recoveryCodes,
			};
		}
		return {
			recoveryCodes: [],
		};
	} else {
		redirect(
			302,
			'/profile',
			{ message: 'Two-Factor Authentication is not enabled', type: 'error' },
			event,
		);
	}
};
