import { fail, redirect } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { changeUserPasswordSchema } from '$lib/config/zod-schemas.js';
import { auth } from '$lib/server/lucia.js';

export const load = async (event) => {
	const form = await superValidate(event, changeUserPasswordSchema);
	const session = await event.locals.auth.validate();

	if (!session) {
		throw redirect(302, '/login');
	}

	const { user } = session;

	form.data = {
		current_password: '',
		password: '',
		confirm_password: ''
	};
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, changeUserPasswordSchema);
		//console.log(form);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		//add user to db
		try {
			console.log('updating profile');
			const session = await event.locals.auth.validate();

			if (!session) {
				throw redirect(302, '/login');
			}

			const user = session.user;

			if (user?.username) {
				if (form.data.password !== form.data.confirm_password) {
					return setError(form, 'Password and confirm password do not match');
				}
				await auth.useKey('username', user.username, form.data.current_password);
				await auth.updateKeyPassword('username', user.username, form.data.password);
			} else {
				return setError(
					form,
					'Error occurred. Please try again or contact support if you need further help.'
				);
			}
		} catch (e) {
			console.error(e);
			form.data.password = '';
			form.data.confirm_password = '';
			form.data.current_password = '';
			return setError(form, 'current_password', 'Your password is incorrect.');
		}

		// TODO: Add toast instead?
		form.data.password = '';
		form.data.confirm_password = '';
		form.data.current_password = '';
		return message(form, 'Profile updated successfully.');
	}
};
