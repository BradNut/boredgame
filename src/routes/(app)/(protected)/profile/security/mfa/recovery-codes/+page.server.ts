import { notSignedInMessage } from '$lib/flashMessages'
import { db } from '$lib/server/api/packages/drizzle'
import { eq } from 'drizzle-orm'
import { alphabet, generateRandomString } from 'oslo/crypto'
import { Argon2id } from 'oslo/password'
import { redirect } from 'sveltekit-flash-message/server'
import type { PageServerLoad } from '../../../$types'
import { recoveryCodesTable } from '../../../../../../../lib/server/api/databases/tables'

export const load: PageServerLoad = async (event) => {
	const { locals } = event

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	if (authedUser.mfa_enabled) {
		const dbRecoveryCodes = await db.query.recoveryCodesTable.findMany({
			where: eq(recoveryCodesTable.userId, authedUser.id),
		})

		if (dbRecoveryCodes.length === 0) {
			const createdRecoveryCodes = Array.from({ length: 5 }, () => generateRandomString(10, alphabet('A-Z', '0-9')))
			if (createdRecoveryCodes) {
				for (const code of createdRecoveryCodes) {
					const hashedCode = await new Argon2id().hash(code)
					console.log('Inserting recovery code', code, hashedCode)
					await db.insert(recoveryCodesTable).values({
						userId: authedUser.id,
						code: hashedCode,
					})
				}
			}
			return {
				recoveryCodes: createdRecoveryCodes,
			}
		}
		return {
			recoveryCodes: [],
		}
	}
	console.error('2FA not enabled')
	redirect(302, '/profile', { message: 'Two-Factor Authentication is not enabled', type: 'error' }, event)
}
