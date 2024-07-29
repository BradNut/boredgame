import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { registerEmailPasswordDto } from '$lib/dtos/register-emailpassword.dto';
import { limiter } from '../middleware/rate-limiter.middleware';

const app = new Hono()
	.post('/', zValidator('json', registerEmailPasswordDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
		const { email } = c.req.valid('json');
		await loginRequestsService.create({ email });
		return c.json({ message: 'Verification email sent' });
	});

export default app;
