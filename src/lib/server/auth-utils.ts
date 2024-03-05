import db from "$lib/drizzle";
import { eq } from "drizzle-orm";
import { password_reset_tokens } from "../../schema";
import { generateId } from "lucia";
import { TimeSpan, createDate } from "oslo";

export async function createPasswordResetToken(userId: string): Promise<string> {
	// optionally invalidate all existing tokens
	await db.delete(password_reset_tokens).where(eq(password_reset_tokens.user_id, userId));
	const tokenId = generateId(40);
	await db
		.insert(password_reset_tokens)
		.values({
			id: tokenId,
			user_id: userId,
			expires_at: createDate(new TimeSpan(2, "h"))
		});
	return tokenId;
}