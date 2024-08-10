import 'reflect-metadata';
import { Hono } from 'hono';
import {inject, injectable} from 'tsyringe';
import { zValidator } from '@hono/zod-validator';
import type { HonoTypes } from '../types';
import type { Controller } from '../interfaces/controller.interface';
import { signupUsernameEmailDto } from "$lib/dtos/signup-username-email.dto";
import {limiter} from "$lib/server/api/middleware/rate-limiter.middleware";
import {UsersService} from "$lib/server/api/services/users.service";

@injectable()
export class SignupController implements Controller {
	controller = new Hono<HonoTypes>();

	constructor(
			@inject(UsersService) private readonly usersService: UsersService
	) { }

	routes() {
		return this.controller
			.post('/', zValidator('json', signupUsernameEmailDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const { firstName, lastName, email, username, password } = await c.req.valid('json');
				const existingUser = await this.usersService.findOneByUsername(username);

				if (existingUser) {
					return c.body("User already exists", 400);
				}

				const user = await this.usersService.create(signupUsernameEmailDto);

// const existing_user = await db.query.usersTable.findFirst({
// 			where: eq(usersTable.username, form.data.username),
// 		});
//
// 		if (existing_user) {
// 			return setError(form, 'username', 'You cannot create an account with that username');
// 		}
//
// 		console.log('Creating user');
//
// 		const hashedPassword = await new Argon2id().hash(form.data.password);
//
// 		const user = await db
// 			.insert(usersTable)
// 			.values({
// 				username: form.data.username,
// 				hashed_password: hashedPassword,
// 				email: form.data.email,
// 				first_name: form.data.firstName ?? '',
// 				last_name: form.data.lastName ?? '',
// 				verified: false,
// 				receive_email: false,
// 				theme: 'system',
// 			})
// 			.returning();
// 		console.log('signup user', user);
//
// 		if (!user || user.length === 0) {
// 			return fail(400, {
// 				form,
// 				message: `Could not create your account. Please try again. If the problem persists, please contact support. Error ID: ${cuid2()}`,
// 			});
// 		}
//
// 		await add_user_to_role(user[0].id, 'user', true);
// 		await db.insert(collections).values({
// 			user_id: user[0].id,
// 		});
// 		await db.insert(wishlists).values({
// 			user_id: user[0].id,
// 		});
//
// 		try {
// 			session = await lucia.createSession(user[0].id, {
// 				ip_country: event.locals.ip,
// 				ip_address: event.locals.country,
// 				twoFactorAuthEnabled: false,
// 				isTwoFactorAuthenticated: false,
// 			});
// 			sessionCookie = lucia.createSessionCookie(session.id);
// 		} catch (e: any) {
// 			if (e.message.toUpperCase() === `DUPLICATE_KEY_ID`) {
// 				// key already exists
// 				console.error('Lucia Error: ', e);
// 			}
// 			console.log(e);
// 			const message = {
// 				type: 'error',
// 				message: 'Unable to create your account. Please try again.',
// 			};
// 			form.data.password = '';
// 			form.data.confirm_password = '';
// 			error(500, message);
// 		}
//
// 		event.cookies.set(sessionCookie.name, sessionCookie.value, {
// 			path: '.',
// 			...sessionCookie.attributes,
// 		});
//
// 		redirect(302, '/');

				return c.json({ message: 'Hello, world!' });
			});
	}
}