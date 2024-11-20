import { notSignedInMessage } from '$lib/flashMessages';
import env from '$lib/server/api/common/env';
import { decodeBase64, encodeBase32NoPadding, encodeBase64 } from '@oslojs/encoding';
import { createTOTPKeyURI, verifyTOTP } from '@oslojs/otp';
import { type Actions, fail } from '@sveltejs/kit';
import kebabCase from 'just-kebab-case';
import QRCode from 'qrcode';
import { redirect } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from '../../$types';
import { addTwoFactorSchema, removeTwoFactorSchema } from './schemas';

export const load: PageServerLoad = async (event) => {
  const { locals } = event;

  const authedUser = await locals.getAuthedUser();
  if (!authedUser) {
    throw redirect(302, '/login', notSignedInMessage, event);
  }

  const addTwoFactorForm = await superValidate(event, zod(addTwoFactorSchema));
  const removeTwoFactorForm = await superValidate(event, zod(removeTwoFactorSchema));

  const { data: twoFactorCredentials, error: twoFactorCredentialsError } = await locals.api.mfa.totp.$get().then(locals.parseApiResponse);
  if (twoFactorCredentials?.totpCredential) {
    return {
      addTwoFactorForm,
      removeTwoFactorForm,
      twoFactorEnabled: true,
      recoveryCodes: [],
      keyURI: '',
      secret: '',
      qrCode: '',
    };
  }

  const issuer = kebabCase(env.PUBLIC_SITE_NAME);
  const accountName = authedUser.email || authedUser.username;
  const totpKey = new Uint8Array(20);
  crypto.getRandomValues(totpKey);
  const encodedTOTPKey = encodeBase64(totpKey);
  const intervalInSeconds = 30;
  const digits = 6;

  const keyURI = createTOTPKeyURI(issuer, accountName, totpKey, intervalInSeconds, digits);
  console.log('keyURI', keyURI);

  addTwoFactorForm.data = {
    password: '',
    code: '',
    key: encodedTOTPKey,
  };
  return {
    addTwoFactorForm,
    removeTwoFactorForm,
    twoFactorEnabled: false,
    recoveryCodes: [],
    keyURI,
    secret: encodeBase32NoPadding(totpKey),
    qrCode: await QRCode.toDataURL(keyURI),
  };
};

export const actions: Actions = {
  enableTotp: async (event) => {
    const { locals } = event;

    const authedUser = await locals.getAuthedUser();
    if (!authedUser) {
      throw redirect(302, '/login', notSignedInMessage, event);
    }

    const addTwoFactorForm = await superValidate(event, zod(addTwoFactorSchema));

    if (!addTwoFactorForm.valid) {
      return fail(400, {
        addTwoFactorForm,
      });
    }

    const { error: verifyPasswordError } = await locals.api.me.verify.password
      .$post({
        json: { password: addTwoFactorForm.data.password },
      })
      .then(locals.parseApiResponse);

    if (verifyPasswordError) {
      console.log(verifyPasswordError);
      return setError(addTwoFactorForm, 'password', 'Your password is incorrect');
    }

    if (addTwoFactorForm.data.code === '') {
      return setError(addTwoFactorForm, 'code', 'Please enter a code');
    }

    const twoFactorCode = addTwoFactorForm.data.code;
    const encodedKey = addTwoFactorForm.data.key;

    let key: Uint8Array;
    try {
      key = decodeBase64(encodedKey);
    } catch {
      return fail(400, {
        message: 'Invalid key',
      });
    }
    if (key.byteLength !== 20) {
      return fail(400, {
        message: 'Invalid key',
      });
    }
    if (!verifyTOTP(key, 30, 6, twoFactorCode)) {
      return setError(addTwoFactorForm, 'code', 'Invalid code');
    }

    const { error: createTotpError } = await locals.api.mfa.totp
      .$post({
        json: { key: encodeBase64(key) },
      })
      .then(locals.parseApiResponse);
    if (createTotpError) {
      return setError(addTwoFactorForm, 'code', 'Invalid code');
    }

    redirect(302, '/settings/security/mfa/recovery-codes');
  },
  disableTotp: async (event) => {
    const { locals } = event;

    const authedUser = await locals.getAuthedUser();
    if (!authedUser) {
      throw redirect(302, '/login', notSignedInMessage, event);
    }

    const removeTwoFactorForm = await superValidate(event, zod(removeTwoFactorSchema));

    if (!removeTwoFactorForm.valid) {
      return fail(400, {
        removeTwoFactorForm,
      });
    }
    const { error: verifyPasswordError } = await locals.api.me.verify.password
      .$post({
        json: { password: removeTwoFactorForm.data.password },
      })
      .then(locals.parseApiResponse);

    if (verifyPasswordError) {
      console.log(verifyPasswordError);
      return setError(removeTwoFactorForm, 'password', 'Your password is incorrect');
    }

    const { error: deleteTotpError } = await locals.api.mfa.totp.$delete().then(locals.parseApiResponse);
    if (deleteTotpError) {
      return fail(500, {
        removeTwoFactorForm,
      });
    }

    redirect(
      302,
      '/settings/security/mfa',
      {
        type: 'success',
        message: 'Two-Factor Authentication has been disabled.',
      },
      event,
    );
  },
};
