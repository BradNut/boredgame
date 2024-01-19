import { fail, type Actions } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import prisma from '$lib/prisma';
import { lucia } from '$lib/server/auth';
import { Argon2id } from 'oslo/password';
import { userSchema } from '$lib/config/zod-schemas';
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

			const user = await prisma.user.findUnique({
				where: {
					username: form.data.username
				}
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

			console.log('ip', locals.ip);
			console.log('country', locals.country);
			session = await lucia.createSession(user.id, {
				ip_country: locals.country,
				ip_address: locals.ip
			});
			sessionCookie = lucia.createSessionCookie(session.id);

			await prisma.collection.upsert({
				where: {
					user_id: user.id
				},
				create: {
					user_id: user.id
				},
				update: {
					user_id: user.id
				}
			});
			await prisma.wishlist.upsert({
				where: {
					user_id: user.id
				},
				create: {
					user_id: user.id
				},
				update: {
					user_id: user.id
				}
			});
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
