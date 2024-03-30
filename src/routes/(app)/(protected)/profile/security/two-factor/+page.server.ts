import { encodeHex } from 'oslo/encoding';
import { Argon2id } from 'oslo/password';
import { createTOTPKeyURI } from 'oslo/otp';
import { HMAC } from 'oslo/crypto';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import type { Cookie } from 'lucia';
import type { PageServerLoad } from '../../$types';
import { addTwoFactorSchema } from '$lib/validations/account';
import { notSignedInMessage } from '$lib/flashMessages';
import { type Actions, fail } from '@sveltejs/kit';
import db from '$lib/drizzle';
import { eq } from 'drizzle-orm';
import { users } from '../../../../../../schema';
import QRCode from 'qrcode';

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, zod(addTwoFactorSchema));
	const user = event.locals.user;

	if (!user) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	const twoFactorSecret = await new HMAC('SHA-1').generateKey();
	await db
		.update(users)
		.set({ two_factor_secret: encodeHex(twoFactorSecret) })
		.where(eq(users.id, user.id));

	const issuer = 'bored-game';
	const accountName = user.email || user.username;
	// pass the website's name and the user identifier (e.g. email, username)
	const uri = createTOTPKeyURI(issuer, accountName, twoFactorSecret);
	const qrCode = await QRCode.toDataURL(uri);

	form.data = {
		current_password: '',
		two_factor_code: ''
	};
	return {
		form,
		qrCode
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(addTwoFactorSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		console.log('updating profile');
		if (!event.locals.user) {
			redirect(302, '/login', notSignedInMessage, event);
		}

		if (!event.locals.session) {
			return fail(401);
		}

		const user = event.locals.user;

		const dbUser = await db.query.users.findFirst({
			where: eq(users.id, user.id)
		});

		if (!dbUser?.hashed_password) {
			form.data.current_password = '';
			form.data.two_factor_code = '';
			return setError(
				form,
				'Error occurred. Please try again or contact support if you need further help.'
			);
		}

		const currentPasswordVerified = await new Argon2id().verify(
			dbUser.hashed_password,
			form.data.current_password
		);

		if (!currentPasswordVerified) {
			return setError(form, 'current_password', 'Your password is incorrect');
		}
		if (user?.username) {
			let sessionCookie: Cookie;
			try {
			} catch (e) {
				console.error(e);
				form.data.password = '';
				form.data.confirm_password = '';
				form.data.current_password = '';
				return setError(form, 'current_password', 'Your password is incorrect.');
			}
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			const message = {
				type: 'success',
				message: 'Password Updated. Please sign in.'
			} as const;
			redirect(302, '/login', message, event);
		}
		return setError(
			form,
			'Error occurred. Please try again or contact support if you need further help.'
		);
		// TODO: Add toast instead?
		// form.data.password = '';
		// form.data.confirm_password = '';
		// form.data.current_password = '';
		// return message(form, 'Profile updated successfully.');
	}
};
