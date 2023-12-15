import { fail, redirect, type Actions } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
// import { LuciaError } from 'lucia';
import { userSchema } from '$lib/config/zod-schemas';
import { Lucia } from '$lib/server/auth.js';
import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';

const profileSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	email: true,
	username: true
});

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, profileSchema);

	if (!event.locals.user) {
		throw redirect(302, '/login');
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

			await prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					firstName: form.data.firstName,
					lastName: form.data.lastName,
					email: form.data.email,
					username: form.data.username
				}
			});

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
