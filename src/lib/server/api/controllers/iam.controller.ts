import { StatusCodes } from '$lib/constants/status-codes'
import type { Controller } from '$lib/server/api/common/interfaces/controller.interface'
import { updateEmailDto } from '$lib/server/api/dtos/update-email.dto'
import { updateProfileDto } from '$lib/server/api/dtos/update-profile.dto'
import { verifyPasswordDto } from '$lib/server/api/dtos/verify-password.dto'
import { limiter } from '$lib/server/api/middleware/rate-limiter.middleware'
import { LuciaProvider } from '$lib/server/api/providers/lucia.provider'
import { IamService } from '$lib/server/api/services/iam.service'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { inject, injectable } from 'tsyringe'
import { requireAuth } from '../middleware/auth.middleware'
import type { HonoTypes } from '../types'

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
