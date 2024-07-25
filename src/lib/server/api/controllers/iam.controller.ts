import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { requireAuth } from "../middleware/auth.middleware";
import { registerEmailPasswordDto } from '$lib/dtos/register-emailpassword.dto';
import { limiter } from '../middleware/rate-limiter.middleware';

const users = new Hono()
	.get('/me', requireAuth, async (c) => {
		const user = c.var.user;
		return c.json({ user });
	})
	.get('/user', requireAuth, async (c) => {
		const user = c.var.user;
		return c.json({ user });
	})
	.post('/login/request', zValidator('json', registerEmailPasswordDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
		const { email } = c.req.valid('json');
		await this.loginRequestsService.create({ email });
		return c.json({ message: 'Verification email sent' });
	});

export default users;
export type UsersType = typeof users