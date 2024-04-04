import { type Actions, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { encodeHex, decodeHex } from 'oslo/encoding';
import { Argon2id } from 'oslo/password';
import { createTOTPKeyURI, TOTPController } from 'oslo/otp';
import { HMAC } from 'oslo/crypto';
import QRCode from 'qrcode';
import { zod } from 'sveltekit-superforms/adapters';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from '../../$types';
import { addTwoFactorSchema } from '$lib/validations/account';
import { notSignedInMessage } from '$lib/flashMessages';
import db from '$lib/drizzle';
import { recovery_codes, users } from '../../../../../../schema';

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, zod(addTwoFactorSchema));
	const user = event.locals.user;

	if (!user) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	const dbUser = await db.query.users.findFirst({
		where: eq(users.id, user.id),
	});

	if (dbUser?.two_factor_enabled) {
		const message = {
			type: 'info',
			message: 'Two-Factor Authentication is already enabled',
		} as const;
		throw redirect('/profile', message, event);
	}

	const twoFactorSecret = await new HMAC('SHA-1').generateKey();
	await db
		.update(users)
		.set({
			two_factor_secret: encodeHex(twoFactorSecret),
			two_factor_enabled: false,
		})
		.where(eq(users.id, user.id));

	const issuer = 'bored-game';
	const accountName = user.email || user.username;
	// pass the website's name and the user identifier (e.g. email, username)
	const totpUri = createTOTPKeyURI(issuer, accountName, twoFactorSecret);
	const qrCode = QRCode.toDataURL(totpUri);

	form.data = {
		current_password: '',
		two_factor_code: '',
	};
	return {
		form,
		twoFactorEnabled: false,
		totpUri,
		qrCode,
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(addTwoFactorSchema));

		if (!form.valid) {
			return fail(400, {
				form,
			});
		}

		if (!event.locals.user) {
			redirect(302, '/login', notSignedInMessage, event);
		}

		if (!event.locals.session) {
			return fail(401);
		}

		const user = event.locals.user;

		const dbUser = await db.query.users.findFirst({
			where: eq(users.id, user.id),
		});

		if (!dbUser?.hashed_password) {
			form.data.current_password = '';
			form.data.two_factor_code = '';
			return setError(
				form,
				'Error occurred. Please try again or contact support if you need further help.',
			);
		}

		if (dbUser?.two_factor_secret === '' || dbUser?.two_factor_secret === null) {
			form.data.current_password = '';
			form.data.two_factor_code = '';
			return setError(
				form,
				'Error occurred. Please try again or contact support if you need further help.',
			);
		}

		const currentPasswordVerified = await new Argon2id().verify(
			dbUser.hashed_password,
			form.data.current_password,
		);

		if (!currentPasswordVerified) {
			return setError(form, 'current_password', 'Your password is incorrect');
		}

		if (form.data.two_factor_code === '') {
			return setError(form, 'two_factor_code', 'Please enter a code');
		}

		const twoFactorCode = form.data.two_factor_code;
		const validOTP = await new TOTPController().verify(
			twoFactorCode,
			decodeHex(dbUser.two_factor_secret),
		);

		if (!validOTP) {
			return setError(form, 'two_factor_code', 'Invalid code');
		}

		await db.update(users).set({ two_factor_enabled: true }).where(eq(users.id, user.id));

		const recoveryCodes = generateRecoveryCodes();
		if (recoveryCodes) {
			for (const code of recoveryCodes) {
				await db.insert(recovery_codes).values({
					userId: user.id,
					code: await new Argon2id().hash(code),
				});
			}
		}

		form.data.current_password = '';
		form.data.two_factor_code = '';
		return { recoveryCodes };
	},
};

function generateRecoveryCodes() {
	return Array.from({ length: 5 }, () => cuid2());
}
