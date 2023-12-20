import { fail, redirect, type Actions } from "@sveltejs/kit";
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { Argon2id } from "oslo/password";
import { changeUserPasswordSchema } from '$lib/config/zod-schemas.js';
import { lucia } from '$lib/server/auth.js';
import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, changeUserPasswordSchema);
	const user = event.locals.user;

	if (!user) {
		throw redirect(302, '/login');
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
		const form = await superValidate(event, changeUserPasswordSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		console.log('updating profile');
		if (!event.locals.user) {
			throw redirect(302, '/login');
		}

		const user = event.locals.user;

		const dbUser = await prisma.user.findUnique({
			where: {
				id: user.id
			}
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
			return setError(form, 'current_password', 'Your password is incorrect.');
		}

		try {
			if (user?.username) {
				if (form.data.password !== form.data.confirm_password) {
					return setError(form, 'Password and confirm password do not match');
				}
				const hashedPassword = await new Argon2id().hash(form.data.password);
				await lucia.invalidateUserSessions(user.id);
				await prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						hashed_password: hashedPassword
					}
				});
				const session = await lucia.createSession(user.id, {
					country: event.locals.session.ip,
				});
				const sessionCookie = lucia.createSessionCookie(session.id);
				return new Response(null, {
					status: 302,
					headers: {
						Location: '/login',
						'Set-Cookie': sessionCookie.serialize()
					}
				});
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
