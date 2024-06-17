import { type Actions, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { encodeHex, decodeHex } from 'oslo/encoding';
import { Argon2id } from 'oslo/password';
import { createTOTPKeyURI, TOTPController } from 'oslo/otp';
import { HMAC } from 'oslo/crypto';
import QRCode from 'qrcode';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from '../../$types';
import { addTwoFactorSchema, removeTwoFactorSchema } from '$lib/validations/account';
import { notSignedInMessage } from '$lib/flashMessages';
import db from '../../../../../../db';
import { recoveryCodes, users } from '$db/schema';
import { userNotAuthenticated } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
	const addTwoFactorForm = await superValidate(event, zod(addTwoFactorSchema));
	const removeTwoFactorForm = await superValidate(event, zod(removeTwoFactorSchema));

	const { locals } = event;
	const { user, session } = locals;
	if (userNotAuthenticated(user, session)) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	const dbUser = await db.query.users.findFirst({
		where: eq(users.id, user!.id!),
	});

	if (dbUser?.two_factor_enabled) {
		return {
			addTwoFactorForm,
			removeTwoFactorForm,
			twoFactorEnabled: true,
			recoveryCodes: [],
			totpUri: '',
			qrCode: '',
		};
	}
	const twoFactorSecret = await new HMAC('SHA-1').generateKey();
	await db
		.update(users)
		.set({
			two_factor_secret: encodeHex(twoFactorSecret),
			two_factor_enabled: false,
		})
		.where(eq(users.id, user!.id!));

	const issuer = 'bored-game';
	const accountName = user!.email! || user!.username!;
	// pass the website's name and the user identifier (e.g. email, username)
	const totpUri = createTOTPKeyURI(issuer, accountName, twoFactorSecret);

	addTwoFactorForm.data = {
		current_password: '',
		two_factor_code: '',
	};
	return {
		addTwoFactorForm,
		removeTwoFactorForm,
		twoFactorEnabled: false,
		recoveryCodes: [],
		totpUri,
		qrCode: await QRCode.toDataURL(totpUri),
	};
};

export const actions: Actions = {
	enableTwoFactor: async (event) => {
		const { locals } = event;
		const { user, session } = locals;
		if (userNotAuthenticated(user, session)) {
			return fail(401);
		}

		const addTwoFactorForm = await superValidate(event, zod(addTwoFactorSchema));

		if (!addTwoFactorForm.valid) {
			return fail(400, {
				addTwoFactorForm,
			});
		}

		if (!event.locals.user) {
			redirect(302, '/login', notSignedInMessage, event);
		}

		if (!event.locals.session) {
			return fail(401);
		}

		const dbUser = await db.query.users.findFirst({
			where: eq(users.id, user.id),
		});

		if (!dbUser?.hashed_password) {
			addTwoFactorForm.data.current_password = '';
			addTwoFactorForm.data.two_factor_code = '';
			return setError(
				addTwoFactorForm,
				'Error occurred. Please try again or contact support if you need further help.',
			);
		}

		if (dbUser?.two_factor_secret === '' || dbUser?.two_factor_secret === null) {
			addTwoFactorForm.data.current_password = '';
			addTwoFactorForm.data.two_factor_code = '';
			return setError(
				addTwoFactorForm,
				'Error occurred. Please try again or contact support if you need further help.',
			);
		}

		const currentPasswordVerified = await new Argon2id().verify(
			dbUser.hashed_password,
			addTwoFactorForm.data.current_password,
		);

		if (!currentPasswordVerified) {
			return setError(addTwoFactorForm, 'current_password', 'Your password is incorrect');
		}

		if (addTwoFactorForm.data.two_factor_code === '') {
			return setError(addTwoFactorForm, 'two_factor_code', 'Please enter a code');
		}

		const twoFactorCode = addTwoFactorForm.data.two_factor_code;
		const validOTP = await new TOTPController().verify(
			twoFactorCode,
			decodeHex(dbUser.two_factor_secret),
		);

		if (!validOTP) {
			return setError(addTwoFactorForm, 'two_factor_code', 'Invalid code');
		}

		await db.update(users).set({ two_factor_enabled: true }).where(eq(users.id, user.id));

		redirect(302, '/profile/security/two-factor/recovery-codes');
	},
	disableTwoFactor: async (event) => {
		const { cookies } = event;
		const removeTwoFactorForm = await superValidate(event, zod(removeTwoFactorSchema));

		if (!removeTwoFactorForm.valid) {
			return fail(400, {
				removeTwoFactorForm,
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
			removeTwoFactorForm.data.current_password = '';
			return setError(
				removeTwoFactorForm,
				'Error occurred. Please try again or contact support if you need further help.',
			);
		}

		const currentPasswordVerified = await new Argon2id().verify(
			dbUser.hashed_password,
			removeTwoFactorForm.data.current_password,
		);

		if (!currentPasswordVerified) {
			return setError(removeTwoFactorForm, 'current_password', 'Your password is incorrect');
		}

		await db
			.update(users)
			.set({ two_factor_enabled: false, two_factor_secret: null })
			.where(eq(users.id, user.id));
		await db.delete(recoveryCodes).where(eq(recoveryCodes.userId, user.id));

		setFlash({ type: 'success', message: 'Two-Factor Authentication has been disabled.' }, cookies);
		return {
			removeTwoFactorForm,
			twoFactorEnabled: false,
			recoveryCodes: [],
		};
	},
};
