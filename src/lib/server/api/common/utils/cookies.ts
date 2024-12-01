import { config } from '$lib/server/api/common/config';
import env from '$lib/server/api/common/env';
import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import type { CookieOptions } from 'hono/utils/cookie';

export const cookieMaxAge = 60 * 60 * 24 * 30;
export const cookieExpiresMilliseconds = cookieMaxAge * 1000; // new TimeSpan(2, 'w').milliseconds();
export const cookieExpiresAt = new Date(Date.now() + cookieExpiresMilliseconds);
export const halfCookieExpiresMilliseconds = cookieExpiresMilliseconds / 2;
export const halfCookieExpiresAt = new Date(Date.now() + halfCookieExpiresMilliseconds);
export const cookieName = 'session';

export type SessionCookie = {
  name: string;
  value: string;
  attributes: CookieOptions;
};

export function createSessionTokenCookie(token: string, expiresAt: Date): SessionCookie {
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

export function createBlankSessionTokenCookie(): SessionCookie {
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

export function setSessionCookie(c: Context, sessionCookie: SessionCookie) {
  setCookie(c, sessionCookie.name, sessionCookie.value, {
    path: sessionCookie.attributes.path,
    maxAge: sessionCookie.attributes?.maxAge,
    domain: sessionCookie.attributes.domain,
    sameSite: sessionCookie.attributes.sameSite as undefined,
    secure: sessionCookie.attributes.secure,
    httpOnly: sessionCookie.attributes.httpOnly,
    expires: sessionCookie.attributes.expires,
  });
}
