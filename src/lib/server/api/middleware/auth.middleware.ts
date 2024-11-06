import { createSessionTokenCookie } from '$lib/server/api/common/utils/cookies';
import { SessionsService } from '$lib/server/api/services/sessions.service';
import type { MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';
import { verifyRequestOrigin } from 'oslo/request';
import { container } from 'tsyringe';
import type { AppBindings } from '../common/types/hono';

// resolve dependencies from the container
const sessionService = container.resolve(SessionsService);

export const verifyOrigin: MiddlewareHandler<AppBindings> = createMiddleware(async (c, next) => {
	if (c.req.method === 'GET') {
		return next();
	}
	const originHeader = c.req.header('Origin') ?? null;
	const hostHeader = c.req.header('Host') ?? null;
	if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
		return c.body(null, 403);
	}
	return next();
});

export const validateAuthSession: MiddlewareHandler<AppBindings> = createMiddleware(async (c, next) => {
	const sessionId = lucia.readSessionCookie(c.req.header('Cookie') ?? '');
	if (!sessionId) {
		c.set('user', null);
		c.set('session', null);
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session?.fresh) {
		c.header('Set-Cookie', createSessionTokenCookie(session.id).serialize(), { append: true });
	}
	if (!session) {
		c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), { append: true });
	}
	c.set('session', session);
	c.set('user', user);
	return next();
});
