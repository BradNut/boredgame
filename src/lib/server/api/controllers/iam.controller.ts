import { Hono } from 'hono';
import { injectable } from 'tsyringe';
import type { HonoTypes } from '../types';
import { requireAuth } from "../middleware/auth.middleware";
import type { Controller } from '../interfaces/controller.interface';

@injectable()
export class IamController implements Controller {
	controller = new Hono<HonoTypes>();

	constructor(
	) { }

	routes() {
		return this.controller
			.get('/me', requireAuth, async (c) => {
				const user = c.var.user;
				return c.json({ user });
			});
	}
}
