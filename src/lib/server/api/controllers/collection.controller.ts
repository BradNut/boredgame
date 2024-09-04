import 'reflect-metadata'
import type { Controller } from '$lib/server/api/common/interfaces/controller.interface'
import { CollectionsService } from '$lib/server/api/services/collections.service'
import { Hono } from 'hono'
import { inject, injectable } from 'tsyringe'
import { requireAuth } from '../middleware/auth.middleware'
import type { HonoTypes } from '../types'

@injectable()
export class CollectionController implements Controller {
	controller = new Hono<HonoTypes>()

	constructor(@inject(CollectionsService) private readonly collectionsService: CollectionsService) {}

	routes() {
		return this.controller
			.get('/', requireAuth, async (c) => {
				const user = c.var.user
				const collections = await this.collectionsService.findAllByUserId(user.id)
				console.log('collections service', collections)
				return c.json({ collections })
			})
			.get('/:cuid', requireAuth, async (c) => {
				const cuid = c.req.param('cuid')
				const collection = await this.collectionsService.findOneByCuid(cuid)
				return c.json({ collection })
			})
	}
}
