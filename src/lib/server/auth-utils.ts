import { eq } from 'drizzle-orm'
import { type Session, type User, generateIdFromEntropySize } from 'lucia'
import { TimeSpan, createDate } from 'oslo'
import { password_reset_tokens } from './api/databases/tables'
import { db } from './api/packages/drizzle'

export async function createPasswordResetToken(userId: string): Promise<string> {
	// optionally invalidate all existing tokens
	await db.delete(password_reset_tokens).where(eq(password_reset_tokens.user_id, userId))
	const tokenId = generateIdFromEntropySize(40)
	await db.insert(password_reset_tokens).values({
		id: tokenId,
		user_id: userId,
		expires_at: createDate(new TimeSpan(2, 'h')),
	})
	return tokenId
}

/**
 * Checks if the user is not fully authenticated.
 *
 * @param user - The user object.
 * @param session - The session object.
 * @returns True if the user is not fully authenticated, otherwise false.
 */
export function userNotFullyAuthenticated(user: User | null, session: Session | null) {
	return user && session && session.isTwoFactorAuthEnabled && !session.isTwoFactorAuthenticated
}

/**
 * Checks if the user is not fully authenticated.
 *
 * @param {User | null} user - The user object.
 * @param {Session | null} session - The session object.
 * @returns {boolean} True if the user is not fully authenticated, otherwise false.
 */
export function userNotAuthenticated(user: User | null, session: Session | null) {
	return !user || !session || userNotFullyAuthenticated(user, session)
}

/**
 * Checks if the user is fully authenticated.
 *
 * @param {User | null} user - The user object.
 * @param {Session | null} session - The session object.
 * @returns {boolean} True if the user is fully authenticated, otherwise false.
 */
export function userFullyAuthenticated(user: User | null, session: Session | null) {
	return !userNotAuthenticated(user, session)
}
