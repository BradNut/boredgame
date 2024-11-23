import { Unauthorized } from '$lib/server/api/common/exceptions';
import type { Sessions, Users } from '$lib/server/api/databases/postgres/tables';
import type { MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';

export const requireFullAuth: MiddlewareHandler<{
  Variables: {
    session: Sessions;
    user: Users;
  };
}> = createMiddleware(async (c, next) => {
  const session = c.var.session;
  if (!session || (session?.twoFactorAuthEnabled && !session?.twoFactorVerified)) {
    throw Unauthorized('You must be logged in to access this resource');
  }
  return next();
});

export const requireTempAuth: MiddlewareHandler<{
	Variables: {
		session: Sessions;
		user: Users;
	};
}> = createMiddleware(async (c, next) => {
	const session = c.var.session;
	if (!session) {
		throw Unauthorized('You must be logged in to access this resource');
	}
	return next();
});