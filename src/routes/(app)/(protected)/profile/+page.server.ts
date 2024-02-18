import { fail, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { userSchema } from '$lib/config/zod-schemas';
import type { PageServerLoad } from './$types';
import { users } from '../../../../schema';
import db from '$lib/drizzle';

const profileSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	email: true,
	username: true
});

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, profileSchema);

	if (!event.locals.user) {
		const message = { type: 'error', message: 'You are not signed in' } as const;
		throw redirect(302, '/login', message, event);
	}

	const { user } = event.locals;

	form.data = {
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		username: user.username
	};
	return {
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, profileSchema);

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
			const existingUser = await db.query.users.findFirst({
				where: eq(users.username, newUsername)
			});

			if (existingUser && existingUser.id !== user.id) {
				return setError(form, 'username', 'That username is already taken');
			}

			await db
				.update(users)
				.set({
					first_name: form.data.firstName,
					last_name: form.data.lastName,
					email: form.data.email,
					username: form.data.username
				})
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
		} catch (e) {
			if (e.message === `AUTH_INVALID_USER_ID`) {
				// invalid user id
				console.error(e);
			}
			return setError(form, 'There was a problem updating your profile.');
		}

		console.log('profile updated successfully');
		return message(form, 'Profile updated successfully.');
	}
};
