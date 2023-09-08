import { fail, redirect } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { userSchema } from '$lib/config/zod-schemas';
import { auth } from '$lib/server/lucia.js';
import { LuciaError } from 'lucia';
// import prisma from '$lib/prisma.js';

const profileSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	email: true,
	username: true
});

export const load = async (event) => {
	const form = await superValidate(event, profileSchema);
	const session = await event.locals.auth.validate();

	if (!session) {
		throw redirect(302, '/login');
	}

	const { user } = session;

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

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, profileSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			console.log('updating profile');
			const session = await event.locals.auth.validate();

			if (!session) {
				throw redirect(302, '/login');
			}

			const user = session.user;

			auth.updateUserAttributes(user.userId, {
				firstName: form.data.firstName,
				lastName: form.data.lastName,
				email: form.data.email,
				username: form.data.username
			});

			if (user.email !== form.data.email) {
				// auth.update
				// await prisma.key.update({
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
			if (e instanceof LuciaError && e.message === `AUTH_INVALID_USER_ID`) {
				// invalid user id
				console.error(e);
			}
			return setError(form, 'There was a problem updating your profile.');
		}

		console.log('profile updated successfully');
		return message(form, 'Profile updated successfully.');
	}
};
