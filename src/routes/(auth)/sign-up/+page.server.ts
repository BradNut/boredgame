import { fail, error, type Actions, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { lucia } from '$lib/server/auth';
import { Argon2id } from 'oslo/password';
import { userSchema } from '$lib/config/zod-schemas';
import { add_user_to_role } from '$server/roles';
import type { Message } from '$lib/types.js';
import db from '$lib/drizzle';
import { collections, users, wishlists } from '../../../schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const signUpSchema = userSchema
	.pick({
		firstName: true,
		lastName: true,
		email: true,
		username: true,
		password: true,
		confirm_password: true,
		terms: true
	})
	.superRefine(({ confirm_password, password }, ctx) => {
		if (confirm_password !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['confirm_password']
			});
		}
	});

export const load: PageServerLoad = async (event) => {
	console.log('sign up load event', event);
	// const session = await event.locals.auth.validate();
	// if (session) {
	// 	throw redirect(302, '/');
	// }
	return {
		form: await superValidate<typeof signUpSchema, Message>(event, signUpSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate<typeof signUpSchema, Message>(event, signUpSchema);
		if (!form.valid) {
			form.data.password = '';
			form.data.confirm_password = '';
			return fail(400, {
				form
			});
		}

		let session;
		let sessionCookie;
		// Adding user to the db
		console.log('Check if user already exists');

		const existing_user = await db.query
			.users
			.findFirst({ where: eq(users.username, form.data.username) });

		if (existing_user) {
			return setError(form, 'username', 'You cannot create an account with that username');
		}

		console.log('Creating user');

		const hashedPassword = await new Argon2id().hash(form.data.password);

		await db.insert(users)
			.values({
				username: form.data.username,
				hashed_password: hashedPassword,
				email: form.data.email || '',
				first_name: form.data.firstName || '',
				last_name: form.data.lastName || '',
				verified: false,
				receive_email: false,
				theme: 'system'
			});
		const user = await db.select()
			.from(users)
			.where(eq(users.username, form.data.username));
		console.log('signup user', user);

		if (!user || user.length === 0) {
			return fail(400, {
				form,
				message: `Could not create your account. Please try again. If the problem persists, please contact support. Error ID: ${nanoid()}`
			});
		}

		add_user_to_role(user[0].id, 'user');
		await db.insert(collections)
			.values({
				user_id: user[0].id
			});
		await db.insert(wishlists)
			.values({
				user_id: user[0].id
			});

		try {
			session = await lucia.createSession(user[0].id, {
				ip_country: event.locals.session?.ipCountry,
				ip_address: event.locals.session?.ipAddress
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
				message: 'Unable to create your account. Please try again.'
			};
			form.data.password = '';
			form.data.confirm_password = '';
			error(500, message);
		}

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		redirect(302, '/');
		// const message = { type: 'success', message: 'Signed Up!' } as const;
		// throw flashRedirect(message, event);
	}
};
