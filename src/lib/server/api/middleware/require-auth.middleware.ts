import { Unauthorized } from '$lib/server/api/common/exceptions'
import type { MiddlewareHandler } from 'hono'
import { createMiddleware } from 'hono/factory'
import type { Session, User } from 'lucia'

export const requireAuth: MiddlewareHandler<{
	Variables: {
		session: Session
		user: User
	}
}> = createMiddleware(async (c, next) => {
	const user = c.var.user
	if (!user) throw Unauthorized('You must be logged in to access this resource')
	return next()
})
