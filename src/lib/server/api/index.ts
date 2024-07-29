import { Hono } from 'hono';
import { hc } from 'hono/client';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { validateAuthSession, verifyOrigin } from './middleware/auth.middleware';
import users from './controllers/user.controller';
import { config } from './common/config';

/* ----------------------------------- Api ---------------------------------- */
const app = new Hono().basePath('/api');

/* --------------------------- Global Middlewares --------------------------- */
app.use(verifyOrigin).use(validateAuthSession);
app.use(logger());

app.use(
	'/*',
	cors({
		origin: [
			'http://localhost:5173',
			'http://localhost:80',
			'http://host.docker.internal:80',
			'http://host.docker.internal:5173'
		], // Replace with your allowed domains

		allowMethods: ['POST'],
		allowHeaders: ['Content-Type']
		// credentials: true, // If you need to send cookies or HTTP authentication
	})
);

/* --------------------------------- Routes --------------------------------- */
const routes = app
	.route('/user', users)
	.get('/', (c) => c.json({ message: 'Server is healthy' }));

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */
export type AppType = typeof routes;

export const rpc = hc<AppType>(config.ORIGIN);
export type ApiClient = typeof rpc;
export type ApiRoutes = typeof routes;
export { app };