import { type Actions, fail, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { encodeHex, decodeHex } from 'oslo/encoding';
import { Argon2id } from 'oslo/password';
import { createTOTPKeyURI, TOTPController } from 'oslo/otp';
import { HMAC } from 'oslo/crypto';
import kebabCase from 'just-kebab-case';
import QRCode from 'qrcode';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from '../../$types';
import { addTwoFactorSchema, removeTwoFactorSchema } from '$lib/validations/account';
import { notSignedInMessage } from '$lib/flashMessages';
import { db } from '$lib/server/api/infrastructure/database';
import { recoveryCodesTable, credentialsTable, usersTable, type Credentials } from '$lib/server/api/infrastructure/database/tables';
import { userNotAuthenticated } from '$lib/server/auth-utils';
import env from '$src/env';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;

	const authedUser = await locals.getAuthedUser();
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event);
	}

	const addTwoFactorForm = await superValidate(event, zod(addTwoFactorSchema));
	const removeTwoFactorForm = await superValidate(event, zod(removeTwoFactorSchema));
	// const addAuthNFactorForm = await superValidate(event, zod(addAuthNFactorSchema));

	const { data, error } = await locals.api.mfa.totp.$get().then(locals.parseApiResponse);
	if (error || !data) {
		return fail(500, {
			addTwoFactorForm,
		});
	}
	const { totpCredential } = data

	if (totpCredential) {
		return {
			addTwoFactorForm,
			removeTwoFactorForm,
			twoFactorEnabled: true,
			recoveryCodes: [],
			totpUri: '',
			qrCode: '',
		}
	}

	const issuer = kebabCase(env.PUBLIC_SITE_NAME);
	const accountName = authedUser.email || authedUser.username;
	const { data: createdTotpData, error: createdTotpError } = await locals.api.mfa.totp.$post().then(locals.parseApiResponse);

	if (createdTotpError || !createdTotpData) {
		return fail(500, {
			addTwoFactorForm,
		})
	}

	const { totpCredential: createdTotpCredentials } = createdTotpData;
	// pass the website's name and the user identifier (e.g. email, username)
	if (!createdTotpCredentials?.secret_data) {
		return fail(500, {
			addTwoFactorForm,
		})
	}
	const totpUri = createTOTPKeyURI(issuer, accountName, createdTotpCredentials.secret_data);

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
	enableTotp: async (event) => {
		const { locals } = event

		const authedUser = await locals.getAuthedUser()
		if (!authedUser) {
			throw redirect(302, '/login', notSignedInMessage, event)
		}

		const addTwoFactorForm = await superValidate(event, zod(addTwoFactorSchema))

		if (!addTwoFactorForm.valid) {
			return fail(400, {
				addTwoFactorForm,
			})
		}

		const { data, error } = await locals.api.mfa.totp.$get().then(locals.parseApiResponse)
		if (error || !data) {
			return fail(500, {
				addTwoFactorForm,
			})
		}
		const { totpCredential } = data

		if (!totpCredential) {
			addTwoFactorForm.data.current_password = ''
			addTwoFactorForm.data.two_factor_code = ''
			return setError(addTwoFactorForm, 'Error occurred. Please try again or contact support if you need further help.')
		}

		if (totpCredential.secret_data === '' || totpCredential.secret_data === null) {
			addTwoFactorForm.data.current_password = ''
			addTwoFactorForm.data.two_factor_code = ''
			return setError(addTwoFactorForm, 'Error occurred. Please try again or contact support if you need further help.')
		}

		const currentPasswordVerified = await locals.api.me.verify.password.$post({
			json: { password: addTwoFactorForm.data.current_password },
		});

		if (!currentPasswordVerified) {
			return setError(addTwoFactorForm, 'current_password', 'Your password is incorrect')
		}

		if (addTwoFactorForm.data.two_factor_code === '') {
			return setError(addTwoFactorForm, 'two_factor_code', 'Please enter a code')
		}

		const twoFactorCode = addTwoFactorForm.data.two_factor_code
		const validOTP = await new TOTPController().verify(twoFactorCode, decodeHex(twoFactorDetails.secret))

		if (!validOTP) {
			return setError(addTwoFactorForm, 'two_factor_code', 'Invalid code')
		}

		await db.update(twoFactor).set({ enabled: true }).where(eq(twoFactor.userId, user!.id!))

		redirect(302, '/profile/security/two-factor/recovery-codes')
	},
	disableTotp: async (event) => {
		const { locals } = event
		const { user, session } = locals
		const removeTwoFactorForm = await superValidate(event, zod(removeTwoFactorSchema))

		if (!removeTwoFactorForm.valid) {
			return fail(400, {
				removeTwoFactorForm,
			})
		}

		if (!user || !session) {
			return fail(401, {
				removeTwoFactorForm,
			})
		}

		const dbUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.id, user.id),
		})

		// if (!dbUser?.hashed_password) {
		// 	removeTwoFactorForm.data.current_password = '';
		// 	return setError(
		// 		removeTwoFactorForm,
		// 		'Error occurred. Please try again or contact support if you need further help.',
		// 	);
		// }

		const currentPasswordVerified = await new Argon2id().verify(
			// dbUser.hashed_password,
			removeTwoFactorForm.data.current_password,
		)

		if (!currentPasswordVerified) {
			return setError(removeTwoFactorForm, 'current_password', 'Your password is incorrect')
		}

		const twoFactorDetails = await db.query.twoFactor.findFirst({
			where: eq(twoFactor.userId, dbUser.id),
		})

		if (!twoFactorDetails) {
			return fail(500, {
				removeTwoFactorForm,
			})
		}

		await db.update(twoFactor).set({ enabled: false }).where(eq(twoFactor.userId, user.id))
		await db.delete(recoveryCodes).where(eq(recoveryCodes.userId, user.id))

		// setFlash({ type: 'success', message: 'Two-Factor Authentication has been disabled.' }, cookies);
		redirect(
			302,
			'/profile/security/two-factor',
			{
				type: 'success',
				message: 'Two-Factor Authentication has been disabled.',
			},
			event,
		)
	},
}
