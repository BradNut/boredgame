import 'reflect-metadata';
import { Hono } from 'hono';
import { inject, injectable } from 'tsyringe';
import { requireAuth } from "../middleware/auth.middleware";
import type { HonoTypes } from '../types';
import type { Controller } from '../interfaces/controller.interface';
import {WishlistsService} from "$lib/server/api/services/wishlists.service";

@injectable()
export class WishlistController implements Controller {
	controller = new Hono<HonoTypes>();

	constructor(
			@inject(WishlistsService) private readonly wishlistsService: WishlistsService
	) { }

	routes() {
		return this.controller
			.get('/', requireAuth, async (c) => {
				const user = c.var.user;
				const wishlists = await this.wishlistsService.findAllByUserId(user.id);
				return c.json({ wishlists });
			})
			.get('/:cuid', requireAuth, async (c) => {
				const cuid = c.req.param('cuid')
				console.log(cuid)
				const wishlist = await this.wishlistsService.findOneByCuid(cuid)
				return c.json({ wishlist });
			});
	}
}
