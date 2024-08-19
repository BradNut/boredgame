import { fail, type Actions } from '@sveltejs/kit';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { zod } from 'sveltekit-superforms/adapters';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { changeEmailSchema, profileSchema } from '$lib/validations/account';
import { notSignedInMessage } from '$lib/flashMessages';
import { db } from '$lib/server/api/infrastructure/database';
import type { PageServerLoad } from './$types';
import { usersTable, credentialsTable } from '$lib/server/api/infrastructure/database/tables';
import { userNotAuthenticated } from '$lib/server/auth-utils';
import {updateProfileDto} from "$lib/dtos/update-profile.dto";
import {updateEmailDto} from "$lib/dtos/update-email.dto";

export const load: PageServerLoad = async (event) => {
	const { locals } = event;

	const authedUser = await locals.getAuthedUser();
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event);
	}
	// if (userNotAuthenticated(user, session)) {
	// 	redirect(302, '/login', notSignedInMessage, event);
	// }
	//
	// const dbUser = await db.query.usersTable.findFirst({
	// 	where: eq(usersTable.id, user!.id!),
	// });

	const profileForm = await superValidate(zod(profileSchema), {
		defaults: {
			firstName: authedUser?.first_name ?? '',
			lastName: authedUser?.last_name ?? '',
			username: authedUser?.username ?? '',
		},
	});
	const emailForm = await superValidate(zod(changeEmailSchema), {
		defaults: {
			email: authedUser?.email ?? '',
		},
	});

	// const twoFactorDetails = await db.query.twoFactor.findFirst({
	// 	where: eq(twoFactor.userId, authedUser!.id!),
	// });

	return {
		profileForm,
		emailForm,
		hasSetupTwoFactor: false //!!twoFactorDetails?.enabled,
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
		const { locals } = event;

		const authedUser = await locals.getAuthedUser();

		if (!authedUser) {
			redirect(302, '/login', notSignedInMessage, event);
		}

		const form = await superValidate(event, zod(updateProfileDto));

		const { error } = await locals.api.user.$post({ json: form.data }).then(locals.parseApiResponse);
		if (error) return setError(form, 'username', error);

		if (!form.valid) {
			return fail(400, {
				form,
			});
		}

		try {
			console.log('updating profile');

			const user = event.locals.user;
			const newUsername = form.data.username;
			const existingUser = await db.query.usersTable.findFirst({
				where: eq(usersTable.username, newUsername),
			});

			if (existingUser && existingUser.id !== user.id) {
				return setError(form, 'username', 'That username is already taken');
			}

			await db
				.update(usersTable)
				.set({
					first_name: form.data.firstName,
					last_name: form.data.lastName,
					username: form.data.username,
				})
				.where(eq(usersTable.id, user.id));
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
		const form = await superValidate(event, zod(updateEmailDto));

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
		const existingUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.email, newEmail),
		});

		if (existingUser && existingUser.id !== user.id) {
			return setError(form, 'email', 'That email is already taken');
		}

		await db.update(usersTable).set({ email: form.data.email }).where(eq(usersTable.id, user.id));

		// if (user.email !== form.data.email) {
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
		// }

		return message(form, { type: 'success', message: 'Email updated successfully!' });
	},
};
