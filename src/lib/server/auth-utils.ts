import { generateIdFromEntropySize, type Session, type User } from 'lucia';
import { TimeSpan, createDate } from 'oslo';
import { eq } from 'drizzle-orm';
import db from '../../db';
import { password_reset_tokens } from '$db/schema';

export async function createPasswordResetToken(userId: string): Promise<string> {
	// optionally invalidate all existing tokens
	await db.delete(password_reset_tokens).where(eq(password_reset_tokens.user_id, userId));
	const tokenId = generateIdFromEntropySize(40);
	await db.insert(password_reset_tokens).values({
		id: tokenId,
		user_id: userId,
		expires_at: createDate(new TimeSpan(2, 'h')),
	});
	return tokenId;
}

/**
 * Checks if the user is not fully authenticated.
 *
 * @param user - The user object.
 * @param session - The session object.
 * @returns True if the user is not fully authenticated, otherwise false.
 */
export function userNotFullyAuthenticated(user: User | null, session: Session | null) {
	return user && session && session.isTwoFactorAuthEnabled && !session.isTwoFactorAuthenticated;
}

export function userNotAuthenticated(user: User | null, session: Session | null) {
	return !user || !session || userNotFullyAuthenticated(user, session);
}

export function userFullyAuthenticated(user: User | null, session: Session | null) {
	return !userNotAuthenticated(user, session);
}
