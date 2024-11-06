import { config } from '$lib/server/api/common/config';
import env from '$lib/server/api/common/env';

export function createSessionTokenCookie(token: string, expiresAt: Date) {
	return {
		name: 'session',
		value: token,
		attributes: {
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
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
		name: 'session',
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
