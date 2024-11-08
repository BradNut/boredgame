import 'reflect-metadata';
import {
	cookieExpiresAt,
	cookieName,
	createBlankSessionTokenCookie,
	createSessionTokenCookie,
	type SessionCookie,
	setSessionCookie,
} from '$lib/server/api/common/utils/cookies';
import {SessionsService} from '$lib/server/api/services/sessions.service';
import type {MiddlewareHandler} from 'hono';
import {getCookie} from 'hono/cookie';
import {createMiddleware} from 'hono/factory';
import {verifyRequestOrigin} from 'oslo/request';
import {container} from 'tsyringe';
import type {AppBindings} from '../common/types/hono';

// resolve dependencies from the container
const sessionService = container.resolve(SessionsService);

// CSRF protection middleware
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
	const sessionId = getCookie(c, cookieName) ?? null;
	if (!sessionId) {
		c.set('user', null);
		c.set('session', null);
		return next();
	}

	const { session, user } = await sessionService.validateSessionToken(sessionId);
	let sessionCookie: SessionCookie;
	if (session !== null) {
		sessionCookie = createSessionTokenCookie(session.id, cookieExpiresAt);
	} else {
		sessionCookie = createBlankSessionTokenCookie();
	}
	setSessionCookie(c, sessionCookie);
	c.set('session', session);
	c.set('user', user);
	return next();
});
