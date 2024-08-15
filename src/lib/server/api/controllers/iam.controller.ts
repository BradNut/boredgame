import { Hono } from 'hono';
import { inject, injectable } from 'tsyringe';
import { setCookie } from 'hono/cookie';
import type { HonoTypes } from '../types';
import { requireAuth } from "../middleware/auth.middleware";
import type { Controller } from '../interfaces/controller.interface';
import {IamService} from "$lib/server/api/services/iam.service";
import {LuciaProvider} from "$lib/server/api/providers";

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
