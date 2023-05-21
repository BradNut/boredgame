import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { userSchema } from '$lib/config/zod-schemas';

const signInSchema = userSchema.pick({
	username: true,
	password: true
});

export const load = async (event) => {
	const session = await event.locals.auth.validate();
	if (session) {
		throw redirect(302, '/');
	}
	const form = await superValidate(event, signInSchema);
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, signInSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// Adding user to the db
		try {
			console.log('sign in user');
			const key = await auth.useKey('username', form.data.username, form.data.password);
			const session = await auth.createSession(key.userId);
			event.locals.auth.setSession(session);
		} catch (e) {
			// TODO: need to return error message to the client
			console.error(e);
			return setError(form, null, 'The username or password is incorrect.');
		}

		return { form };
	}
};
