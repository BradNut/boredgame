import 'reflect-metadata';
import { Hono } from 'hono';
import { inject, injectable } from 'tsyringe';
import { requireAuth } from "../middleware/auth.middleware";
import type { HonoTypes } from '../types';
import type { Controller } from '$lib/server/api/interfaces/controller.interface';
import { TotpService } from '$lib/server/api/services/totp.service';
import {StatusCodes} from "$lib/constants/status-codes";

@injectable()
export class MfaController implements Controller {
	controller = new Hono<HonoTypes>();

	constructor(
		@inject(TotpService) private readonly totpService: TotpService
	) {
	}


	routes() {
		return this.controller
			.get('/totp', requireAuth, async (c) => {
				const user = c.var.user;
				const totpCredential = await this.totpService.findOneByUserId(user.id);
				return c.json({ totpCredential });
			})
			.post('/totp', requireAuth, async (c) => {
				const user = c.var.user;
				const totpCredential = await this.totpService.create(user.id);
				return c.json({ totpCredential })
			})
			.delete('/totp', requireAuth, async (c) => {
				const user = c.var.user;
				await this.totpService.deleteOneByUserId(user.id);
				return c.status(StatusCodes.NO_CONTENT);
			});
	}

}