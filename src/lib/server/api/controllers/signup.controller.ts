import 'reflect-metadata';
import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import {inject, injectable} from 'tsyringe';
import { zValidator } from '@hono/zod-validator';
import { TimeSpan } from 'oslo';
import type { HonoTypes } from '../types';
import type { Controller } from '../interfaces/controller.interface';
import { signupUsernameEmailDto } from "$lib/dtos/signup-username-email.dto";
import {limiter} from "$lib/server/api/middleware/rate-limiter.middleware";
import {UsersService} from "$lib/server/api/services/users.service";
import {LoginRequestsService} from "$lib/server/api/services/loginrequest.service";
import {LuciaProvider} from "$lib/server/api/providers";

@injectable()
export class SignupController implements Controller {
	controller = new Hono<HonoTypes>();

	constructor(
			@inject(UsersService) private readonly usersService: UsersService,
			@inject(LoginRequestsService) private readonly loginRequestService: LoginRequestsService,
			@inject(LuciaProvider) private lucia: LuciaProvider
	) { }

	routes() {
		return this.controller
			.post('/', zValidator('json', signupUsernameEmailDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const { firstName, lastName, email, username, password, confirm_password } = await c.req.valid('json');
				const existingUser = await this.usersService.findOneByUsername(username);

				if (existingUser) {
					return c.body("User already exists", 400);
				}

				const user = await this.usersService.create({ firstName, lastName, email, username, password, confirm_password });

				if (!user) {
					return c.body("Failed to create user", 500);
				}

				const session = await this.loginRequestService.createUserSession(user.id, c.req, undefined);
				const sessionCookie = this.lucia.createSessionCookie(session.id);
				console.log("set cookie", sessionCookie);
				setCookie(c, sessionCookie.name, sessionCookie.value, {
					path: sessionCookie.attributes.path,
					maxAge: sessionCookie?.attributes?.maxAge && sessionCookie?.attributes?.maxAge < new TimeSpan(365, 'd').seconds()
							? sessionCookie.attributes.maxAge : new TimeSpan(2, 'w').seconds(),
					domain: sessionCookie.attributes.domain,
					sameSite: sessionCookie.attributes.sameSite as any,
					secure: sessionCookie.attributes.secure,
					httpOnly: sessionCookie.attributes.httpOnly,
					expires: sessionCookie.attributes.expires
				});
				return c.json({ message: 'ok' });
			});
	}
}