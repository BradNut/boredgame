import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { userSchema } from '$lib/config/zod-schemas';

const signUpSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	email: true,
	username: true,
	password: true,
	terms: true
});

export const load = async (event) => {
	const session = await event.locals.auth.validate();
	if (session) {
		throw redirect(302, '/');
	}
	const form = await superValidate(event, signUpSchema);
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, signUpSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// Adding user to the db
		try {
			console.log('Creating user');
			const token = crypto.randomUUID();

			const user = await auth.createUser({
				primaryKey: {
					providerId: 'username',
					providerUserId: form.data.username,
					password: form.data.password
				},
				attributes: {
					email: form.data.email || '',
					username: form.data.username,
					firstName: form.data.firstName || '',
					lastName: form.data.lastName || '',
					role: 'USER',
					verified: false,
					receiveEmail: false,
					token
				}
			});

			console.log('User', user);

			const session = await auth.createSession(user.userId);
			event.locals.auth.setSession(session);
		} catch (error) {
			console.log(error);
			return setError(form, 'email', 'Unable to create your account. Please try again.');
		}

		return { form };
	}
};
