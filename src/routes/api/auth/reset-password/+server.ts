import db from '../../../../db';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { users } from '$db/schema';
import { createPasswordResetToken } from '$lib/server/auth-utils.js';
import { PUBLIC_SITE_URL } from '$env/static/public';

export async function POST({ locals, request }) {
	const { email }: { email: string } = await request.json();

	if (!locals.user) {
		error(401, { message: 'Unauthorized' });
	}

	const user = await db.query.users.findFirst({
		where: eq(users.email, email),
	});

	if (!user) {
		error(200, {
			message: 'Email sent! Please check your email for a link to reset your password.',
		});
	}

	const verificationToken = await createPasswordResetToken(user.id);
	const verificationLink = PUBLIC_SITE_URL + verificationToken;

	// TODO: send email
	console.log('Verification link: ' + verificationLink);

	return new Response(null, {
		status: 200,
	});
}
