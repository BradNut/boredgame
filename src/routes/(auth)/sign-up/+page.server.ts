import { fail, error, type Actions } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { eq } from 'drizzle-orm';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import type { PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';
import { signUpSchema } from '$lib/validations/auth';
import { add_user_to_role } from '$server/roles';
import db from '../../../db';
import { collections, users, wishlists } from '$db/schema';
import { createId as cuid2 } from '@paralleldrive/cuid2';

const limiter = new RateLimiter({
	// A rate is defined by [number, unit]
	IPUA: [5, 'm'],
});

const signUpDefaults = {
	firstName: '',
	lastName: '',
	email: '',
	username: '',
	password: '',
	confirm_password: '',
	terms: true,
};

export const load: PageServerLoad = async (event) => {
	// redirect(
	// 	302,
	// 	'/waitlist',
	// 	{ type: 'error', message: 'Sign-up not yet available. Please add your email to the waitlist!' },
	// 	event
	// );

	if (event.locals.user) {
		const message = { type: 'success', message: 'You are already signed in' } as const;
		throw redirect('/', message, event);
	}

	return {
		form: await superValidate(zod(signUpSchema), {
			defaults: signUpDefaults,
		}),
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (await limiter.isLimited(event)) {
			throw error(429);
		}
		// fail(401, { message: 'Sign-up not yet available. Please add your email to the waitlist!' });
		const form = await superValidate(event, zod(signUpSchema));
		if (!form.valid) {
			form.data.password = '';
			form.data.confirm_password = '';
			return fail(400, {
				form,
			});
		}

		let session;
		let sessionCookie;
		// Adding user to the db
		console.log('Check if user already exists');

		const existing_user = await db.query.users.findFirst({
			where: eq(users.username, form.data.username),
		});

		if (existing_user) {
			return setError(form, 'username', 'You cannot create an account with that username');
		}

		console.log('Creating user');

		const hashedPassword = await new Argon2id().hash(form.data.password);

		const user = await db
			.insert(users)
			.values({
				username: form.data.username,
				hashed_password: hashedPassword,
				email: form.data.email,
				first_name: form.data.firstName ?? '',
				last_name: form.data.lastName ?? '',
				verified: false,
				receive_email: false,
				theme: 'system',
				two_factor_secret: '',
				two_factor_enabled: false,
			})
			.returning();
		console.log('signup user', user);

		if (!user || user.length === 0) {
			return fail(400, {
				form,
				message: `Could not create your account. Please try again. If the problem persists, please contact support. Error ID: ${cuid2()}`,
			});
		}

		add_user_to_role(user[0].id, 'user', true);
		await db.insert(collections).values({
			user_id: user[0].id,
		});
		await db.insert(wishlists).values({
			user_id: user[0].id,
		});

		try {
			session = await lucia.createSession(user[0].id, {
				ip_country: event.locals.ip,
				ip_address: event.locals.country,
			});
			sessionCookie = lucia.createSessionCookie(session.id);
		} catch (e: any) {
			if (e.message.toUpperCase() === `DUPLICATE_KEY_ID`) {
				// key already exists
				console.error('Lucia Error: ', e);
			}
			console.log(e);
			const message = {
				type: 'error',
				message: 'Unable to create your account. Please try again.',
			};
			form.data.password = '';
			form.data.confirm_password = '';
			error(500, message);
		}

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});

		redirect(302, '/');
		// const message = { type: 'success', message: 'Signed Up!' } as const;
		// throw flashRedirect(message, event);
	},
};
