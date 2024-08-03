// import 'reflect-metadata';
import { Hono } from 'hono';
// import { injectable } from 'tsyringe';
import { requireAuth } from "../middleware/auth.middleware";
import type { HonoTypes } from '../types';
import type { Controller } from '../interfaces/controller.interface';

// @injectable()
class UserController implements Controller {
	controller = new Hono<HonoTypes>();

	constructor(
	) { }

	routes() {
		return this.controller
			.get('/me', requireAuth, async (c) => {
				const user = c.var.user;
				return c.json({ user });
			})
			.get('/user', requireAuth, async (c) => {
				const user = c.var.user;
				return c.json({ user });
			});
	}
}

export const userControllerInstance = new UserController();
