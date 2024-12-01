import { requireFullAuth } from '$lib/server/api/common/middleware/require-auth.middleware';
import { Controller } from '$lib/server/api/common/types/controller';
import { WishlistsService } from '$lib/server/api/wishlists/wishlists.service';
import { inject, injectable } from '@needle-di/core';

@injectable()
export class WishlistController extends Controller {
  constructor(private wishlistsService = inject(WishlistsService)) {
    super();
  }

  routes() {
    return this.controller
      .get('/', requireFullAuth, async (c) => {
        const user = c.var.user;
        const wishlists = await this.wishlistsService.findAllByUserId(user.id);
        return c.json({ wishlists });
      })
      .get('/:cuid', requireFullAuth, async (c) => {
        const cuid = c.req.param('cuid');
        const wishlist = await this.wishlistsService.findOneByCuid(cuid);
        return c.json({ wishlist });
      });
  }
}
