import { generateId } from '$lib/server/api/common/utils/crypto';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { eq } from 'drizzle-orm';
import { type Users, password_reset_tokens } from './api/databases/postgres/tables';
import type { Session } from './api/iam/sessions/sessions.service';
import { db } from './api/packages/drizzle';

dayjs.extend(relativeTime);

function generateCode() {
  // alphabet with removed look-alike characters (0, 1, O, I)
  const alphabet = '23456789ACDEFGHJKLMNPQRSTUVWXYZ';
  // generate 6 character long random string
  return generateId(6, alphabet);
}

export async function createPasswordResetToken(userId: string): Promise<string> {
  // optionally invalidate all existing tokens
  await db.delete(password_reset_tokens).where(eq(password_reset_tokens.user_id, userId));
  const tokenId = generateIdFromEntropySize(40);
  await db.insert(password_reset_tokens).values({
    id: tokenId,
    user_id: userId,
    expires_at: dayjs().add(30, 'day').toDate(),
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
export function userNotFullyAuthenticated(user: Users | null, session: Session | null) {
  return user && session && session.twoFactorEnabled && !session.twoFactorVerified;
}

/**
 * Checks if the user is not fully authenticated.
 *
 * @param {User | null} user - The user object.
 * @param {Session | null} session - The session object.
 * @returns {boolean} True if the user is not fully authenticated, otherwise false.
 */
export function userNotAuthenticated(user: Users | null, session: Session | null) {
  return !user || !session || userNotFullyAuthenticated(user, session);
}

/**
 * Checks if the user is fully authenticated.
 *
 * @param {User | null} user - The user object.
 * @param {Session | null} session - The session object.
 * @returns {boolean} True if the user is fully authenticated, otherwise false.
 */
export function userFullyAuthenticated(user: Users | null, session: Session | null) {
  return !userNotAuthenticated(user, session);
}
