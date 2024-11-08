import 'reflect-metadata';
import { cookieExpiresAt, cookieName, createBlankSessionTokenCookie, createSessionTokenCookie } from '$lib/server/api/common/utils/cookies';
import { SessionsService } from '$lib/server/api/services/sessions.service';
import type { MiddlewareHandler } from 'hono';
import { setCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { TimeSpan } from 'oslo';
import { parseCookies } from 'oslo/cookie';
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
	const cookies = parseCookies(c.req.header('Cookie') ?? '');
	const sessionId = cookies.get(cookieName) ?? null;
	if (!sessionId) {
		c.set('user', null);
		c.set('session', null);
		return next();
	}

	const { session, user } = await sessionService.validateSessionToken(sessionId);
	if (session !== null) {
		const sessionCookie = createSessionTokenCookie(session.id, cookieExpiresAt);
		setCookie(c, sessionCookie.name, sessionCookie.value, {
			path: sessionCookie.attributes.path,
			maxAge:
				sessionCookie?.attributes?.maxAge && sessionCookie?.attributes?.maxAge < new TimeSpan(365, 'd').seconds()
					? sessionCookie.attributes.maxAge
					: new TimeSpan(2, 'w').seconds(),
			domain: sessionCookie.attributes.domain,
			sameSite: sessionCookie.attributes.sameSite as any,
			secure: sessionCookie.attributes.secure,
			httpOnly: sessionCookie.attributes.httpOnly,
			expires: sessionCookie.attributes.expires,
		});
	} else {
		const sessionCookie = createBlankSessionTokenCookie();
		setCookie(c, sessionCookie.name, sessionCookie.value, {
			path: sessionCookie.attributes.path,
			maxAge: sessionCookie.attributes?.maxAge,
			domain: sessionCookie.attributes.domain,
			sameSite: sessionCookie.attributes.sameSite as any,
			secure: sessionCookie.attributes.secure,
			httpOnly: sessionCookie.attributes.httpOnly,
			expires: sessionCookie.attributes.expires,
		});
	}
	c.set('session', session);
	c.set('user', user);
	return next();
});
