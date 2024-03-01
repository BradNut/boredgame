import { fail, type Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server'
import { Argon2id } from "oslo/password";
import db from "$lib/drizzle";
import { changeUserPasswordSchema } from '$lib/validations/account';
import { lucia } from '$lib/server/auth.js';
import type { PageServerLoad } from "./$types";
import { users } from "../../../../../schema";
import { notSignedInMessage } from "$lib/flashMessages";

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, zod(changeUserPasswordSchema));
	const user = event.locals.user;

	if (!user) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	form.data = {
		current_password: '',
		password: '',
		confirm_password: ''
	};
	return {
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(changeUserPasswordSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		console.log('updating profile');
		if (!event.locals.user) {
		  redirect(302, '/login', notSignedInMessage, event);
		}

		const user = event.locals.user;

		const dbUser = await db.query.users.findFirst({
			where: eq(users.id, user.id)
		});

		if (!dbUser || !dbUser.hashed_password) {
			form.data.password = '';
			form.data.confirm_password = '';
			form.data.current_password = '';
			return setError(
				form,
				'Error occurred. Please try again or contact support if you need further help.'
			);
		}

		const currentPasswordVerified = await new Argon2id().verify(dbUser.hashed_password, form.data.current_password);

		if (!currentPasswordVerified) {
			return setError(form, 'current_password', 'Your password is incorrect');
		}

		try {
			if (user?.username) {
				if (form.data.password !== form.data.confirm_password) {
					return setError(form, 'Password and confirm password do not match');
				}
				const hashedPassword = await new Argon2id().hash(form.data.password);
				await lucia.invalidateUserSessions(user.id);
				await db.update(users)
					.set({ hashed_password: hashedPassword })
					.where(eq(users.id, user.id));
				const session = await lucia.createSession(user.id, {
					country: event.locals.session?.ip,
				});
				const sessionCookie = lucia.createSessionCookie(session.id);
				redirect({
					status: 302,
					location: '/login',
					message: {
						type: 'success',
						text: 'Password changed successfully'
					},
					event: sessionCookie.serialize()
				});
				// return new Response(null, {
				// 	status: 302,
				// 	headers: {
				// 		Location: '/login',
				// 		'Set-Cookie': sessionCookie.serialize()
				// 	}
				// });
			} else {
				return setError(
					form,
					'Error occurred. Please try again or contact support if you need further help.'
				);
			}
		} catch (e) {
			console.error(e);
			form.data.password = '';
			form.data.confirm_password = '';
			form.data.current_password = '';
			return setError(form, 'current_password', 'Your password is incorrect.');
		}

		// TODO: Add toast instead?
		// form.data.password = '';
		// form.data.confirm_password = '';
		// form.data.current_password = '';
		// return message(form, 'Profile updated successfully.');
	}
};
