import { allCollections, getCollectionByCUID, numberOfCollections } from '$lib/server/api/collections/collection.routes';
import { CollectionsService } from '$lib/server/api/collections/collections.service';
import { requireFullAuth } from '$lib/server/api/common/middleware/require-auth.middleware';
import { Controller } from '$lib/server/api/common/types/controller';
import { StatusCodes } from '$lib/utils/status-codes';
import { inject, injectable } from '@needle-di/core';
import { openApi } from 'hono-zod-openapi';

@injectable()
export class CollectionController extends Controller {
  constructor(private collectionsService = inject(CollectionsService)) {
    super();
  }

  routes() {
    return this.controller
      .get('/', requireFullAuth, openApi(allCollections), async (c) => {
        const user = c.var.user;
        const collections = await this.collectionsService.findAllByUserId(user.id);
        console.log('collections service', collections);
        return c.json({ collections }, StatusCodes.OK);
      })
      .get('/count', requireFullAuth, openApi(numberOfCollections), async (c) => {
        const user = c.var.user;
        const collections = await this.collectionsService.findAllByUserIdWithDetails(user.id);
        return c.json({ count: collections?.length || 0 }, StatusCodes.OK);
      })
      .get('/:cuid', requireFullAuth, openApi(getCollectionByCUID), async (c) => {
        const cuid = c.req.param('cuid');
        const collection = await this.collectionsService.findOneByCuid(cuid);

        if (!collection) {
          return c.json('Collection not found', StatusCodes.NOT_FOUND);
        }

        return c.json({ collection }, StatusCodes.OK);
      });
  }
}
