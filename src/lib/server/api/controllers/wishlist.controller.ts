import 'reflect-metadata'
import { Controller } from '$lib/server/api/common/types/controller'
import { WishlistsService } from '$lib/server/api/services/wishlists.service'
import { inject, injectable } from 'tsyringe'
import { requireAuth } from '../middleware/auth.middleware'

@injectable()
export class WishlistController extends Controller {
	constructor(@inject(WishlistsService) private readonly wishlistsService: WishlistsService) {
		super()
	}

	routes() {
		return this.controller
			.get('/', requireAuth, async (c) => {
				const user = c.var.user
				const wishlists = await this.wishlistsService.findAllByUserId(user.id)
				return c.json({ wishlists })
			})
			.get('/:cuid', requireAuth, async (c) => {
				const cuid = c.req.param('cuid')
				const wishlist = await this.wishlistsService.findOneByCuid(cuid)
				return c.json({ wishlist })
			})
	}
}
