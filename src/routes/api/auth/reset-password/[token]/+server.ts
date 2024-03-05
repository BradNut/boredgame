import db from '$lib/drizzle.js';
import { eq } from 'drizzle-orm';
import { password_reset_tokens, users } from '../../../../../schema.js';
import { isWithinExpirationDate } from 'oslo';
import { lucia } from '$lib/server/auth.js';
import { Argon2id } from 'oslo/password';

export async function POST({ request, params }) {
	const { password } = await request.json();

	if (typeof password !== 'string' || password.length < 8) {
		return new Response(null, {
			status: 400
		});
	}

	const verificationToken = params.token;

	const token = await db.query.password_reset_tokens.findFirst({
		where: eq(password_reset_tokens.id, verificationToken)
	});
	if (!token) {
		await db.delete(password_reset_tokens).where(eq(password_reset_tokens.id, verificationToken));
		return new Response(null, {
			status: 400
		});
	}

	if (!token?.expires_at || !isWithinExpirationDate(token.expires_at)) {
		return new Response(null, {
			status: 400
		});
	}

	await lucia.invalidateUserSessions(token.user_id);
	const hashPassword = await new Argon2id().hash(password);
	await db
		.update(users)
		.set({ hashed_password: hashPassword })
		.where(eq(users.id, token.user_id));

	const session = await lucia.createSession(token.user_id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	return new Response(null, {
		status: 302,
		headers: {
			Location: "/",
			"Set-Cookie": sessionCookie.serialize()
		}
	});
}