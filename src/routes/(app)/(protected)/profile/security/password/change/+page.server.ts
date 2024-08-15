import { fail, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { Argon2id } from 'oslo/password';
import type { PageServerLoad } from '../../../$types';
import db from '../../../../../../../db';
import { changeUserPasswordSchema } from '$lib/validations/account';
import { lucia } from '$lib/server/auth.js';
import { usersTable } from '$db/schema';
import { notSignedInMessage } from '$lib/flashMessages';
import type { Cookie } from 'lucia';
import { userNotAuthenticated } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, zod(changeUserPasswordSchema));
	const { locals } = event;
	const { user, session } = locals;
	if (userNotAuthenticated(user, session)) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	form.data = {
		current_password: '',
		password: '',
		confirm_password: '',
	};
	return {
		form,
	};
};

export const actions: Actions = {
	default: async (event) => {
		const { locals } = event;
		const { user, session } = locals;
		if (userNotAuthenticated(user, session)) {
			return fail(401);
		}

		const form = await superValidate(event, zod(changeUserPasswordSchema));

		if (!form.valid) {
			return fail(400, {
				form,
			});
		}

		console.log('updating profile');
		if (!event.locals.user) {
			redirect(302, '/login', notSignedInMessage, event);
		}

		if (!event.locals.session) {
			return fail(401);
		}

		const dbUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.id, user!.id),
		});

		// if (!dbUser?.hashed_password) {
		// 	form.data.password = '';
		// 	form.data.confirm_password = '';
		// 	form.data.current_password = '';
		// 	return setError(
		// 		form,
		// 		'Error occurred. Please try again or contact support if you need further help.',
		// 	);
		// }

		const currentPasswordVerified = await new Argon2id().verify(
			// dbUser.hashed_password,
			form.data.current_password,
		);

		if (!currentPasswordVerified) {
			return setError(form, 'current_password', 'Your password is incorrect');
		}
		if (user?.username) {
			let sessionCookie: Cookie;
			try {
				if (form.data.password !== form.data.confirm_password) {
					return setError(form, 'Password and confirm password do not match');
				}
				const hashedPassword = await new Argon2id().hash(form.data.password);
				await lucia.invalidateUserSessions(user.id);
				// await db
				// 	.update(usersTable)
				// 	.set({ hashed_password: hashedPassword })
				// 	.where(eq(usersTable.id, user.id));
				await lucia.createSession(user.id, {
					country: event.locals.session?.ipCountry ?? 'unknown',
				});
				sessionCookie = lucia.createBlankSessionCookie();
			} catch (e) {
				console.error(e);
				form.data.password = '';
				form.data.confirm_password = '';
				form.data.current_password = '';
				return setError(form, 'current_password', 'Your password is incorrect.');
			}
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});

			const message = {
				type: 'success',
				message: 'Password Updated. Please sign in.',
			} as const;
			redirect(302, '/login', message, event);
		}
		return setError(
			form,
			'Error occurred. Please try again or contact support if you need further help.',
		);
		// TODO: Add toast instead?
		// form.data.password = '';
		// form.data.confirm_password = '';
		// form.data.current_password = '';
		// return message(form, 'Profile updated successfully.');
	},
};
