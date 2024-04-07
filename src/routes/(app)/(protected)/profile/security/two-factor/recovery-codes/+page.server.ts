import db from "$lib/drizzle";
import {eq} from "drizzle-orm";
import {Argon2id} from "oslo/password";
import {alphabet, generateRandomString} from "oslo/crypto";
import {redirect} from "sveltekit-flash-message/server";
import {notSignedInMessage} from "$lib/flashMessages";
import type { PageServerLoad } from '../../../$types';
import {recovery_codes, users} from "../../../../../../../schema";

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;

	if (!user) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	const dbUser = await db.query.users.findFirst({
		where: eq(users.id, user.id),
	});

	if (dbUser?.two_factor_enabled) {
		const recoveryCodes = await db.query.recovery_codes.findMany({
			where: eq(recovery_codes.userId, user.id),
		});

		if (recoveryCodes.length === 0) {
			const recoveryCodes = Array.from({length: 5}, () => generateRandomString(10, alphabet('A-Z', '0-9')));
			if (recoveryCodes) {
				for (const code of recoveryCodes) {
					await db.insert(recovery_codes).values({
						userId: user.id,
						code: await new Argon2id().hash(code),
					});
				}
			}
			return {
				recoveryCodes,
			};
		}
		return {
			recoveryCodes: [],
		}
	} else {
		redirect(302, '/profile', { message: 'Two-Factor Authentication is not enabled', type: 'error' }, event);
	}
}