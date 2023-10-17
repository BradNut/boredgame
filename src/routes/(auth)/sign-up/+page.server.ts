import { fail, redirect, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { LuciaError } from 'lucia';
import { auth } from '$lib/server/lucia';
import { userSchema } from '$lib/config/zod-schemas';
import { add_user_to_role } from '$server/roles';
import type { Message } from '$lib/types.js';

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
	console.log('sign up load event', event);
	const session = await event.locals.auth.validate();
	if (session) {
		throw redirect(302, '/');
	}
	return {
		form: await superValidate<typeof signUpSchema, Message>(event, signUpSchema)
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate<typeof signUpSchema, Message>(event, signUpSchema);

		if (!form.valid) {
			form.data.password = '';
			form.data.confirm_password = '';
			return fail(400, {
				form
			});
		}

		// Adding user to the db
		try {
			console.log('Creating user');
			const token = crypto.randomUUID();

			const user = await auth.createUser({
				key: {
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
			console.log('signup user', user);
			add_user_to_role(user.userId, 'user');
			await locals.prisma.collection.create({
				data: {
					user_id: user.userId
				}
			});
			await locals.prisma.wishlist.create({
				data: {
					user_id: user.userId
				}
			});

			console.log('User', user);

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			event.locals.auth.setSession(session);
			// const message = { type: 'success', message: 'Signed Up!' } as const;
			// throw flashRedirect(message, event);
		} catch (e) {
			if (e instanceof LuciaError && e.message.toUpperCase() === `DUPLICATE_KEY_ID`) {
				// key already exists
				console.error('Lucia Error: ', e);
			}
			console.log(e);
			const message = {
				type: 'error',
				message: 'Unable to create your account. Please try again.'
			};
			form.data.password = '';
			form.data.confirm_password = '';
			throw error(500, message);
		}
	}
};
