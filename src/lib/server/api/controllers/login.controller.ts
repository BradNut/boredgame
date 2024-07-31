import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { inject, injectable } from 'tsyringe';
import type { HonoTypes } from '../types';
import { limiter } from '../middleware/rate-limiter.middleware';
import type { Controller } from '../interfaces/controller.interface';
import { signInEmailDto } from '$lib/dtos/signin-email.dto';
import type { LoginRequestsService } from '../services/loginrequest.service';

@injectable()
export class LoginController implements Controller {
	controller = new Hono<HonoTypes>();

	constructor(
		@inject('LoginRequestsService') private readonly loginRequestsService: LoginRequestsService
	) { }

	routes() {
		return this.controller
			.post('/', zValidator('json', signInEmailDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const { username, password } = c.req.valid('json');
				await this.loginRequestsService.verify({ username, password });
				return c.json({ message: 'Verification email sent' });
			})
	}
}
