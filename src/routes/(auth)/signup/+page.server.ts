import { signupUsernameEmailDto } from '$lib/dtos/signup-username-email.dto';
import { type Actions, fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

const signUpDefaults = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirm_password: '',
  terms: true,
};

export const load: PageServerLoad = async (event) => {
  const { locals } = event;

  const { user } = await locals.getAuthedUser();

  if (user) {
    const message = { type: 'success', message: 'You are already signed in' } as const;
    throw redirect('/', message, event);
  }

  return {
    signupForm: await superValidate(zod(signupUsernameEmailDto), {
      defaults: signUpDefaults,
    }),
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

    const form = await superValidate(event, zod(signupUsernameEmailDto));

    const { error } = await locals.api.signup.$post({ json: form.data }).then(locals.parseApiResponse);
    if (error) {
			form.data.password = '';
      return setError(form, 'username', 'Unable to log in.');
    }

    if (!form.valid) {
      form.data.password = '';
      form.data.confirm_password = '';
      return fail(400, {
        form,
      });
    }

    redirect(302, '/');
  },
};
