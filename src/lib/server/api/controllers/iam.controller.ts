import { Hono } from 'hono'
import { inject, injectable } from 'tsyringe'
import { setCookie } from 'hono/cookie'
import { zValidator } from '@hono/zod-validator'
import type { HonoTypes } from '../types'
import { requireAuth } from '../middleware/auth.middleware'
import type { Controller } from '$lib/server/api/interfaces/controller.interface'
import { IamService } from '$lib/server/api/services/iam.service'
import { LuciaProvider } from '$lib/server/api/providers'
import { limiter } from '$lib/server/api/middleware/rate-limiter.middleware'
import { updateProfileDto } from '$lib/dtos/update-profile.dto'
import { updateEmailDto } from '$lib/dtos/update-email.dto'
import { StatusCodes } from '$lib/constants/status-codes'
import { verifyPasswordDto } from '$lib/dtos/verify-password.dto'

@injectable()
export class IamController implements Controller {
	controller = new Hono<HonoTypes>()

	constructor(
		@inject(IamService) private readonly iamService: IamService,
		@inject(LuciaProvider) private lucia: LuciaProvider,
	) {}

	routes() {
		return this.controller
			.get('/', requireAuth, async (c) => {
				const user = c.var.user
				return c.json({ user })
			})
			.put('/update/profile', requireAuth, zValidator('json', updateProfileDto), limiter({ limit: 30, minutes: 60 }), async (c) => {
				const user = c.var.user
				const { firstName, lastName, username } = c.req.valid('json')
				const updatedUser = await this.iamService.updateProfile(user.id, { firstName, lastName, username })
				if (!updatedUser) {
					return c.json('Username already in use', StatusCodes.BAD_REQUEST)
				}
				return c.json({ user: updatedUser }, StatusCodes.OK)
			})
			.post('/verify/password', requireAuth, zValidator('json', verifyPasswordDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const user = c.var.user
				const { password } = c.req.valid('json')
				const passwordVerified = await this.iamService.verifyPassword(user.id, { password })
				if (!passwordVerified) {
					console.log('Incorrect password')
					return c.json('Incorrect password', StatusCodes.BAD_REQUEST)
				}
				return c.json({}, StatusCodes.OK)
			})
			.post('/update/email', requireAuth, zValidator('json', updateEmailDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const user = c.var.user
				const { email } = c.req.valid('json')
				const updatedUser = await this.iamService.updateEmail(user.id, { email })
				if (!updatedUser) {
					return c.json('Email already in use', StatusCodes.BAD_REQUEST)
				}
				return c.json({ user: updatedUser }, StatusCodes.OK)
			})
			.post('/logout', requireAuth, async (c) => {
				const sessionId = c.var.session.id
				await this.iamService.logout(sessionId)
				const sessionCookie = this.lucia.createBlankSessionCookie()
				setCookie(c, sessionCookie.name, sessionCookie.value, {
					path: sessionCookie.attributes.path,
					maxAge: sessionCookie.attributes.maxAge,
					domain: sessionCookie.attributes.domain,
					sameSite: sessionCookie.attributes.sameSite as any,
					secure: sessionCookie.attributes.secure,
					httpOnly: sessionCookie.attributes.httpOnly,
					expires: sessionCookie.attributes.expires,
				})
				return c.json({ status: 'success' })
			})
	}
}
