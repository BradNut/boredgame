import 'reflect-metadata'
import { inject, injectable } from 'tsyringe'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { requireAuth } from '../middleware/auth.middleware'
import type { HonoTypes } from '../types'
import type { Controller } from '$lib/server/api/interfaces/controller.interface'
import { TotpService } from '$lib/server/api/services/totp.service'
import { StatusCodes } from '$lib/constants/status-codes'
import { verifyTotpDto } from '$lib/dtos/verify-totp.dto'
import { UsersService } from '../services/users.service'
import { CredentialsType } from '$db/tables'

@injectable()
export class MfaController implements Controller {
	controller = new Hono<HonoTypes>()

	constructor(
		@inject(TotpService) private readonly totpService: TotpService,
		@inject(UsersService) private readonly usersService: UsersService,
	) {}

	routes() {
		return this.controller
			.get('/totp', requireAuth, async (c) => {
				const user = c.var.user
				const totpCredential = await this.totpService.findOneByUserId(user.id)
				return c.json({ totpCredential })
			})
			.post('/totp', requireAuth, async (c) => {
				const user = c.var.user
				const totpCredential = await this.totpService.create(user.id)
				return c.json({ totpCredential })
			})
			.delete('/totp', requireAuth, async (c) => {
				const user = c.var.user
				try {
					await this.totpService.deleteOneByUserIdAndType(user.id, CredentialsType.TOTP)
					console.log('TOTP deleted')
					return c.body(null, StatusCodes.NO_CONTENT)
				} catch (e) {
					console.error(e)
					return c.status(StatusCodes.INTERNAL_SERVER_ERROR)
				}
			})
			.post('/totp/verify', requireAuth, zValidator('json', verifyTotpDto), async (c) => {
				try {
					const user = c.var.user
					const { code } = c.req.valid('json')
					const verified = await this.totpService.verify(user.id, code)
					if (verified) {
						this.usersService.updateUser(user.id, { mfa_enabled: true })
						return c.json({}, StatusCodes.OK)
					}
					return c.json({}, StatusCodes.BAD_REQUEST)
				} catch (e) {
					console.error(e)
					return c.status(StatusCodes.INTERNAL_SERVER_ERROR)
				}
			})
	}
}
