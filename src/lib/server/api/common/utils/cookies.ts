import { config } from '$lib/server/api/common/config';
import env from '$lib/server/api/common/env';
import { TimeSpan } from 'oslo';

export const cookieMaxAge = 60 * 60 * 24 * 30;
export const cookieExpiresMilliseconds = new TimeSpan(2, 'w').milliseconds();
export const cookieExpiresAt = new Date(Date.now() + cookieExpiresMilliseconds);
export const halfCookieExpiresMilliseconds = cookieExpiresMilliseconds / 2;
export const halfCookieExpiresAt = new Date(Date.now() + halfCookieExpiresMilliseconds);
export const cookieName = 'session';

export function createSessionTokenCookie(token: string, expiresAt: Date) {
	return {
		name: cookieName,
		value: token,
		attributes: {
			path: '/',
			maxAge: cookieMaxAge,
			domain: env.DOMAIN,
			sameSite: 'lax',
			secure: config.isProduction,
			httpOnly: true,
			expires: expiresAt,
		},
	};
}

export function createBlankSessionTokenCookie() {
	return {
		name: cookieName,
		value: '',
		attributes: {
			path: '/',
			maxAge: 0,
			domain: env.DOMAIN,
			sameSite: 'lax',
			secure: config.isProduction,
			httpOnly: true,
			expires: new Date(0),
		},
	};
}
