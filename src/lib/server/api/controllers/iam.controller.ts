import { Hono } from 'hono';
import { inject, injectable } from 'tsyringe';
import { setCookie } from 'hono/cookie';
import { zValidator } from '@hono/zod-validator';
import type { HonoTypes } from '../types';
import { requireAuth } from "../middleware/auth.middleware";
import type { Controller } from '../interfaces/controller.interface';
import {IamService} from "$lib/server/api/services/iam.service";
import {LuciaProvider} from "$lib/server/api/providers";
import {limiter} from "$lib/server/api/middleware/rate-limiter.middleware";
import {updateProfileDto} from "$lib/dtos/update-profile.dto";
import {updateEmailDto} from "$lib/dtos/update-email.dto";

@injectable()
export class IamController implements Controller {
	controller = new Hono<HonoTypes>();

	constructor(
			@inject(IamService) private readonly iamService: IamService,
			@inject(LuciaProvider) private lucia: LuciaProvider
	) { }

	routes() {
		return this.controller
			.get('/me', requireAuth, async (c) => {
				const user = c.var.user;
				return c.json({ user });
			})
			.post('/update/profile', requireAuth, zValidator('json', updateProfileDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const user = c.var.user;
				const { firstName, lastName, username } = c.req.valid('json');
				await this.iamService.updateProfile(user.id, { first_name: firstName, last_name: lastName, username });
				return c.json({ status: 'success' });
			})
			.post('/update/email', requireAuth, zValidator('json', updateEmailDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const user = c.var.user;
				const { email } = c.req.valid('json');
				await this.iamService.updateEmail(user.id, email);
				return c.json({ status: 'success' });
			})
			.post('/logout', requireAuth, async (c) => {
				const sessionId = c.var.session.id;
				await this.iamService.logout(sessionId);
				const sessionCookie = this.lucia.createBlankSessionCookie();
				setCookie(c, sessionCookie.name, sessionCookie.value, {
					path: sessionCookie.attributes.path,
					maxAge: sessionCookie.attributes.maxAge,
					domain: sessionCookie.attributes.domain,
					sameSite: sessionCookie.attributes.sameSite as any,
					secure: sessionCookie.attributes.secure,
					httpOnly: sessionCookie.attributes.httpOnly,
					expires: sessionCookie.attributes.expires
				});
				return c.json({ status: 'success' });
			});
	}
}
