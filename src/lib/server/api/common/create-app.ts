import env from '$lib/server/api/common/env';
import type { AppBindings } from '$lib/server/api/common/types/hono';
import { validateAuthSession, verifyOrigin } from '$lib/server/api/middleware/auth.middleware';
import { pinoLogger } from '$lib/server/api/middleware/pino-logger.middleware';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares';

export function createRouter() {
	return new Hono<AppBindings>({
		strict: false,
	}).basePath('/api');
}

export default function createApp() {
	const app = createRouter();

	app.use(verifyOrigin).use(validateAuthSession);
	app.use(serveEmojiFavicon('📝'));
	app.use(pinoLogger());

	app.notFound(notFound);
	app.onError(onError);

	app.use(
		'/*',
		cors({
			origin: [env.ORIGIN],

			allowMethods: ['POST'],
			allowHeaders: ['Content-Type'],
			// credentials: true, // If you need to send cookies or HTTP authentication
		}),
	);

	return app;
}
