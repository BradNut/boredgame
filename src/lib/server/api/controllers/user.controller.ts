import 'reflect-metadata';
import { Hono } from 'hono';
import { injectable } from 'tsyringe';
import { requireAuth } from "../middleware/auth.middleware";
import type { HonoTypes } from '../types';
import type { Controller } from '../interfaces/controller.interface';

@injectable()
export class UserController implements Controller {
	controller = new Hono<HonoTypes>();

	constructor(
	) { }

	routes() {
		return this.controller
			.get('/', async (c) => {
				const user = c.var.user;
				return c.json({ user });
			})
			.get('/:id', requireAuth, async (c) => {
				const id = c.req.param('id');
				const user = c.var.user;
				return c.json({ user });
			})
			.get('/username/:userName', requireAuth, async (c) => {
				const userName = c.req.param('userName');
				const user = c.var.user;
				return c.json({ user });
			});
	}
}
