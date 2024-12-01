import { signinUsernameDto } from '$lib/dtos/signin-username.dto';
import { StatusCodes } from '$lib/utils/status-codes';
import { type Actions, fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const { locals } = event;

  const { user } = await locals.getAuthedUser();

  if (user) {
    console.log('user already signed in');
    const message = { type: 'success', message: 'You are already signed in' } as const;
    throw redirect('/', message, event);
    // redirect(302, '/', message, event)
  }
  const form = await superValidate(event, zod(signinUsernameDto));

  return {
    form,
  };
};

export const actions: Actions = {
  default: async (event) => {
    const { locals } = event;

    const { user } = await locals.getAuthedUser();

    if (user) {
      const message = { type: 'success', message: 'You are already signed in' } as const;
      throw redirect('/', message, event);
    }

    const form = await superValidate(event, zod(signinUsernameDto));

    const { error } = await locals.api.login.$post({ json: form.data }).then(locals.parseApiResponse);
    console.log('Login error', error);
    if (error) {
      console.log('Setting error');
      return setError(form, 'username', 'An error occurred while logging in.');
    }

    if (!form.valid) {
      form.data.password = '';
      return fail(400, {
        form,
      });
    }

    form.data.username = '';
    form.data.password = '';

    const { error: totpCredentialError, data } = await locals.api.mfa.totp.$get().then(locals.parseApiResponse);
    if (totpCredentialError || !data) {
      return setError(form, 'username', totpCredentialError ?? 'Something went wrong. Please try again.');
    }

    const { totpCredential } = data;
    console.log('totpCredential', totpCredential);
    if (!totpCredential) {
      const message = { type: 'success', message: 'Signed In!' } as const;
      redirect(302, '/', message, event);
    } else if (totpCredential?.type === 'totp' && totpCredential?.secret_data && totpCredential?.secret_data !== '') {
      console.log('redirecting to TOTP page');
      const message = { type: 'success', message: 'Please enter your TOTP code.' } as const;
      redirect(302, '/totp', message, event);
    } else {
      return setError(form, 'username', 'Something went wrong. Please try again.');
    }

    redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
  },
};
