import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { userSchema } from '$lib/config/zod-schemas';
import { add_user_to_role } from '$db/roles';

const signUpSchema = userSchema
	.pick({
		firstName: true,
		lastName: true,
		email: true,
		username: true,
		password: true,
		confirm_password: true,
		terms: true
	})
	.superRefine(({ confirm_password, password }, ctx) => {
		if (confirm_password !== password) {
			// ctx.addIssue({
			// 	code: 'custom',
			// 	message: 'Password and Confirm Password must match',
			// 	path: ['password']
			// });
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['confirm_password']
			});
		}
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
					verified: false,
					receiveEmail: false,
					theme: 'system',
					token
				}
			});
			add_user_to_role(user.id, 'user');

			console.log('User', user);

			const session = await auth.createSession(user.id);
			event.locals.auth.setSession(session);
		} catch (error) {
			console.log(error);
			return setError(form, '', 'Unable to create your account. Please try again.');
		}

		return { form };
	}
};
