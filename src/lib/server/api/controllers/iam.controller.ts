import { Hono } from 'hono';
import { requireAuth } from "../middleware/auth.middleware";

const users = new Hono().get('/me', requireAuth, async (c) => {
	const user = c.var.user;
	return c.json({ user });
});

export default users;
export type UsersType = typeof users