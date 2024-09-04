import { PUBLIC_SITE_URL } from '$env/static/public'
import { createPasswordResetToken } from '$lib/server/auth-utils.js'
import { error } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import { usersTable } from '../../src/lib/server/api/databases/tables'
import { db } from '../../src/lib/server/api/packages/drizzle'

export async function POST({ locals, request }) {
	const { email }: { email: string } = await request.json()

	if (!locals.user) {
		error(401, { message: 'Unauthorized' })
	}

	const user = await db.query.usersTable.findFirst({
		where: eq(usersTable.email, email),
	})

	if (!user) {
		error(200, {
			message: 'Email sent! Please check your email for a link to reset your password.',
		})
	}

	const verificationToken = await createPasswordResetToken(user.id)
	const verificationLink = PUBLIC_SITE_URL + verificationToken

	// TODO: send email
	console.log('Verification link: ' + verificationLink)

	return new Response(null, {
		status: 200,
	})
}
