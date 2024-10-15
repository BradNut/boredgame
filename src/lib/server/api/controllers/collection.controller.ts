import 'reflect-metadata';
import { StatusCodes } from '$lib/constants/status-codes';
import { Controller } from '$lib/server/api/common/types/controller';
import { allCollections, getCollectionByCUID, numberOfCollections } from '$lib/server/api/controllers/collection.routes';
import { CollectionsService } from '$lib/server/api/services/collections.service';
import { openApi } from 'hono-zod-openapi';
import { inject, injectable } from 'tsyringe';
import { requireAuth } from '../middleware/require-auth.middleware';

@injectable()
export class CollectionController extends Controller {
	constructor(@inject(CollectionsService) private readonly collectionsService: CollectionsService) {
		super();
	}

	routes() {
		return this.controller
			.get('/', requireAuth, openApi(allCollections), async (c) => {
				const user = c.var.user;
				const collections = await this.collectionsService.findAllByUserId(user.id);
				console.log('collections service', collections);
				return c.json({ collections }, StatusCodes.OK);
			})
			.get('/count', requireAuth, openApi(numberOfCollections), async (c) => {
				const user = c.var.user;
				const collections = await this.collectionsService.findAllByUserIdWithDetails(user.id);
				return c.json({ count: collections?.length || 0 }, StatusCodes.OK);
			})
			.get('/:cuid', requireAuth, openApi(getCollectionByCUID), async (c) => {
				const cuid = c.req.param('cuid');
				const collection = await this.collectionsService.findOneByCuid(cuid);

				if (!collection) {
					return c.json('Collection not found', StatusCodes.NOT_FOUND);
				}

				return c.json({ collection }, StatusCodes.OK);
			});
	}
}
