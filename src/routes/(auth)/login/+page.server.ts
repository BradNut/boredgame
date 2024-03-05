import { fail, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { Argon2id } from 'oslo/password';
import db from '$lib/drizzle';
import { lucia } from '$lib/server/auth';
import { signInSchema } from '$lib/validations/auth'
import { collections, users, wishlists } from '../../../schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		const message = { type: 'success', message: 'You are already signed in' } as const;
		throw redirect('/', message, event);
	}

	const form = await superValidate(event, zod(signInSchema));

	return {
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const { locals } = event;
		const form = await superValidate(event, zod(signInSchema));

		if (!form.valid) {
			form.data.password = '';
			return fail(400, {
				form
			});
		}

		let session;
		let sessionCookie;
		try {
			const password = form.data.password;

			const user = await db.query.users.findFirst({
				where: eq(users.username, form.data.username)
			});

			console.log('user', JSON.stringify(user, null, 2));

			if (!user || !user.hashed_password) {
				form.data.password = '';
				return setError(form, '', 'Your username or password is incorrect.');
			}

			const validPassword = await new Argon2id().verify(user.hashed_password, password);
			if (!validPassword) {
				console.log('invalid password');
				form.data.password = '';
				return setError(form, '', 'Your username or password is incorrect.');
			}

			await db
				.insert(collections)
				.values({
					user_id: user.id
				})
				.onConflictDoNothing();
			await db
				.insert(wishlists)
				.values({
					user_id: user.id
				})
				.onConflictDoNothing();

			console.log('ip', locals.ip);
			console.log('country', locals.country);
			session = await lucia.createSession(user.id, {
				ip_country: locals.country,
				ip_address: locals.ip
			});
			sessionCookie = lucia.createSessionCookie(session.id);
		} catch (e) {
			// TODO: need to return error message to the client
			console.error(e);
			form.data.password = '';
			return setError(form, '', 'Your username or password is incorrect.');
		}

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		form.data.username = '';
		form.data.password = '';
		const message = { type: 'success', message: 'Signed In!' } as const;
		redirect('/', message, event);
	}
};
