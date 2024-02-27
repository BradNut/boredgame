import { fail, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { zod } from 'sveltekit-superforms/adapters';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { changeEmailSchema, profileSchema } from '$lib/validations/account';
import type { PageServerLoad } from './$types';
import { users } from '../../../../schema';
import db from '$lib/drizzle';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		const message = { type: 'error', message: 'You are not signed in' } as const;
		throw redirect(302, '/login', message, event);
	}

	const { user } = event.locals;

	const profileForm = await superValidate(zod(profileSchema), {
		defaults: {
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.username
		}
	});
	const emailForm = await superValidate(zod(changeEmailSchema), {
		defaults: {
			email: user.email
		}
	});

	return {
		profileForm,
		emailForm,
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(profileSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		if (!event.locals.user) {
			throw redirect(302, '/login');
		}

		try {
			console.log('updating profile');

			const user = event.locals.user;

			const newUsername = form.data.username;
			const existingUser = await db.query
				.users
				.findFirst({
					where: eq(users.username, newUsername)
				}
			);

			if (existingUser && existingUser.id !== user.id) {
				return setError(form, 'username', 'That username is already taken');
			}

			await db
				.update(users)
				.set({
					first_name: form.data.firstName,
					last_name: form.data.lastName,
					username: form.data.username
				})
				.where(eq(users.id, user.id));
		} catch (e) {
			if (e.message === `AUTH_INVALID_USER_ID`) {
				// invalid user id
				console.error(e);
			}
			return setError(form, 'There was a problem updating your profile.');
		}

		console.log('profile updated successfully');
		return message(form, 'Profile updated successfully.');
	},
	changeEmail: async (event) => {
		const form = await superValidate(event, zod(changeEmailSchema));

		const newEmail = form.data?.email;
		if (!form.valid || !newEmail || newEmail === '') {
			return fail(400, {
				form
			});
		}

		if (!event.locals.user) {
			throw redirect(302, '/login');
		}

		const user = event.locals.user;
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, newEmail)
		});

		if (existingUser && existingUser.id !== user.id) {
			return setError(form, 'email', 'That email is already taken');
		}

		await db
			.update(users)
			.set({ email: form.data.email })
			.where(eq(users.id, user.id));

		if (user.email !== form.data.email) {
			// Send email to confirm new email?
			// auth.update
			// await locals.prisma.key.update({
			// 	where: {
			// 		id: 'emailpassword:' + user.email
			// 	},
			// 	data: {
			// 		id: 'emailpassword:' + form.data.email
			// 	}
			// });
			// auth.updateUserAttributes(user.user_id, {
			// 	receiveEmail: false
			// });
		}
	}
};
