import { Unauthorized } from '$lib/server/api/common/utils/exceptions';
import type { SessionDto } from '$lib/server/api/iam/sessions/dtos/session.dto';
import { SessionsService } from '$lib/server/api/iam/sessions/sessions.service';
import { Container } from '@needle-di/core';
import type { MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';

/* ---------------------------------- Types --------------------------------- */
type AuthStates = 'session' | 'none';
type AuthedReturnType = typeof authed;
type UnauthedReturnType = typeof unauthed;

/* ------------------- Overloaded function implementation ------------------- */
// we have to overload the implementation to provide the correct return type
export function authState(state: 'session'): AuthedReturnType;
export function authState(state: 'none'): UnauthedReturnType;
export function authState(state: AuthStates): AuthedReturnType | UnauthedReturnType {
  if (state === 'session') return authed;
  return unauthed;
}

// resolve dependencies from the container
const sessionService = new Container().get(SessionsService);

/* ------------------------------ Require Auth ------------------------------ */
const authed: MiddlewareHandler<{
  Variables: {
    session: SessionDto;
  };
}> = createMiddleware(async (c, next) => {
  if (!c.var.session) {
    throw Unauthorized('You must be logged in to access this resource');
  }
  return next();
});

/* ---------------------------- Require Unauthed ---------------------------- */
const unauthed: MiddlewareHandler<{
  Variables: {
    session: null;
  };
}> = createMiddleware(async (c, next) => {
  if (c.var.session) {
    throw Unauthorized('You must be logged out to access this resource');
  }
  return next();
});
