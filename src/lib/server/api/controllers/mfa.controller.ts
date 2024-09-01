import 'reflect-metadata'
import { StatusCodes } from '$lib/constants/status-codes'
import type { Controller } from '$lib/server/api/common/interfaces/controller.interface'
import { verifyTotpDto } from '$lib/server/api/dtos/verify-totp.dto'
import { TotpService } from '$lib/server/api/services/totp.service'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { inject, injectable } from 'tsyringe'
import { CredentialsType } from '../databases/tables'
import { requireAuth } from '../middleware/auth.middleware'
import { UsersService } from '../services/users.service'
import type { HonoTypes } from '../types'

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
