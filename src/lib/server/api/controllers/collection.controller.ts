import 'reflect-metadata'
import { Controller } from '$lib/server/api/common/types/controller'
import { CollectionsService } from '$lib/server/api/services/collections.service'
import { inject, injectable } from 'tsyringe'
import { requireAuth } from '../middleware/auth.middleware'

@injectable()
export class CollectionController extends Controller {
	constructor(@inject(CollectionsService) private readonly collectionsService: CollectionsService) {
		super()
	}

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
