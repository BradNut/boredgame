import { generateIdFromEntropySize } from 'lucia';
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
