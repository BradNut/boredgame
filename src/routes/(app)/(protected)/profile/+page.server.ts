import { fail, type Actions } from '@sveltejs/kit';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { zod } from 'sveltekit-superforms/adapters';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { changeEmailSchema, profileSchema } from '$lib/validations/account';
import { notSignedInMessage } from '$lib/flashMessages';
import db from '../../../../db';
import type { PageServerLoad } from './$types';
import { users } from '$db/schema';
import { userNotAuthenticated } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;
	const { user, session } = locals;
	if (userNotAuthenticated(user, session)) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	const dbUser = await db.query.users.findFirst({
		where: eq(users.id, user!.id!),
	});

	const profileForm = await superValidate(zod(profileSchema), {
		defaults: {
			firstName: dbUser?.first_name ?? '',
			lastName: dbUser?.last_name ?? '',
			username: dbUser?.username ?? '',
		},
	});
	const emailForm = await superValidate(zod(changeEmailSchema), {
		defaults: {
			email: dbUser?.email ?? '',
		},
	});

	return {
		profileForm,
		emailForm,
		hasSetupTwoFactor: !!dbUser?.two_factor_enabled,
	};
};

const changeEmailIfNotEmpty = z.object({
	email: z
		.string()
		.trim()
		.max(64, { message: 'Email must be less than 64 characters' })
		.email({ message: 'Please enter a valid email' }),
});

export const actions: Actions = {
	profileUpdate: async (event) => {
		const form = await superValidate(event, zod(profileSchema));

		if (!form.valid) {
			return fail(400, {
				form,
			});
		}
		if (!event.locals.user) {
			redirect(302, '/login', notSignedInMessage, event);
		}

		try {
			console.log('updating profile');

			const user = event.locals.user;
			const newUsername = form.data.username;
			const existingUser = await db.query.users.findFirst({
				where: eq(users.username, newUsername),
			});

			if (existingUser && existingUser.id !== user.id) {
				return setError(form, 'username', 'That username is already taken');
			}

			await db
				.update(users)
				.set({
					first_name: form.data.firstName,
					last_name: form.data.lastName,
					username: form.data.username,
				})
				.where(eq(users.id, user.id));
		} catch (e) {
			// @ts-expect-error
			if (e.message === `AUTH_INVALID_USER_ID`) {
				// invalid user id
				console.error(e);
			}
			return setError(form, 'There was a problem updating your profile.');
		}

		console.log('profile updated successfully');
		return message(form, { type: 'success', message: 'Profile updated successfully!' });
	},
	changeEmail: async (event) => {
		const form = await superValidate(event, zod(changeEmailSchema));

		const newEmail = form.data?.email;
		if (
			!form.valid ||
			!newEmail ||
			(newEmail !== '' && !changeEmailIfNotEmpty.safeParse(form.data).success)
		) {
			return fail(400, {
				form,
			});
		}

		if (!event.locals.user) {
			redirect(302, '/login', notSignedInMessage, event);
		}

		const user = event.locals.user;
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, newEmail),
		});

		if (existingUser && existingUser.id !== user.id) {
			return setError(form, 'email', 'That email is already taken');
		}

		await db.update(users).set({ email: form.data.email }).where(eq(users.id, user.id));

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

		return message(form, { type: 'success', message: 'Email updated successfully!' });
	},
};
