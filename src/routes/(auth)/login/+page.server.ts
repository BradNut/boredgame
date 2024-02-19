import { fail, type Actions } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { lucia } from '$lib/server/auth';
import { Argon2id } from 'oslo/password';
import { userSchema } from '$lib/config/zod-schemas';
import db from '$lib/drizzle';
import { collections, users, wishlists } from '../../../schema';
import type { PageServerLoad } from './$types';

const signInSchema = userSchema.pick({
	username: true,
	password: true
});

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, signInSchema);

	console.log('login load event', event);
	if (event.locals.user) {
		const message = { type: 'info', message: 'You are already signed in' } as const;
		throw redirect('/', message, event);
	}

	return {
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const { locals } = event;
		const form = await superValidate(event, signInSchema);

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
		const message = { type: 'success', message: 'Signed In!' };
		// return { form, message };
		throw redirect('/', message, event);
	}
};
