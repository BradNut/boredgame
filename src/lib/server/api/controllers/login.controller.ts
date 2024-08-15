import 'reflect-metadata';
import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { zValidator } from '@hono/zod-validator';
import { inject, injectable } from 'tsyringe';
import { TimeSpan } from 'oslo';
import type { HonoTypes } from '../types';
import { limiter } from '../middleware/rate-limiter.middleware';
import type { Controller } from '../interfaces/controller.interface';
import { LoginRequestsService } from '../services/loginrequest.service';
import { signinUsernameDto } from "$lib/dtos/signin-username.dto";
import {LuciaProvider} from "$lib/server/api/providers";

@injectable()
export class LoginController implements Controller {
	controller = new Hono<HonoTypes>();

	constructor(
		@inject(LoginRequestsService) private readonly loginRequestsService: LoginRequestsService,
		@inject(LuciaProvider) private lucia: LuciaProvider
	) { }

	routes() {
		return this.controller
			.post('/', zValidator('json', signinUsernameDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const { username, password } = c.req.valid('json');
				const session = await this.loginRequestsService.verify({ username, password }, c.req);
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
			})
	}
}
