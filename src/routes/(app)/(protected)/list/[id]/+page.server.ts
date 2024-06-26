import { type Actions, fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from 'sveltekit-superforms/server';
import db from "$lib/drizzle.js";
import { modifyListGameSchema } from "$lib/validations/zod-schemas";
import { games, wishlist_items, wishlists } from "../../../../../schema.js";

export async function load({ params, locals }) {
	const user = locals.user;
	if (!user) {
		redirect(302, '/login');
	}

	try {
		const wishlist = await db.select({
			wishlistId: wishlists.id,
			wishlistItems: {
				id: wishlist_items.id,
				gameId: wishlist_items.game_id,
				gameName: games.name,
				gameThumbUrl: games.thumb_url
			},
		}).from(wishlists)
				.leftJoin(wishlist_items, eq(wishlists.id, wishlist_items.wishlist_id))
				.leftJoin(games, eq(games.id, wishlist_items.game_id))
				.where(eq(wishlists.id, params.id));
		return {
			wishlist
		};
	} catch (e) {
		console.error(e);
		return {};
	}
}

export const actions: Actions = {
	// Add game to a wishlist
	add: async (event) => {
		const { params, locals } = event;
		const form = await superValidate(event, zod(modifyListGameSchema));

		if (!locals.user) {
			throw fail(401);
		}

		if (!params?.id) {
			throw fail(400, {
				message: 'Invalid Request'
			});
		}

		const game = await db.query.games.findFirst({
			where: eq(games.id, form.id)
		});

		if (!game) {
			return fail(400, {
				message: 'Game not found'
			});
		}

		const wishlist = await db.query.wishlists.findFirst({
			where: eq(wishlists.id, params.id)
		});

		if (wishlist?.user_id !== locals.user.id) {
			return fail(401, {
				message: 'Unauthorized'
			});
		}

		if (!wishlist) {
			redirect(302, '/404');
		}

		const wishlistItem = await db.insert(wishlist_items).values({
			game_id: game.id,
			wishlist_id: wishlist.id
		});

		if (!wishlistItem) {
			return fail(500, {
				message: 'Something went wrong'
			});
		}

		return {
			form
		};
	},
	// Create new wishlist
	create: async ({ locals }) => {
		if (!locals.user) {
			throw fail(401);
		}
	},
	// Delete a wishlist
	delete: async ({ locals}) => {
		if (!locals.user) {
			throw fail(401);
		}
	},
	// Remove game from a wishlist
	remove: async ({  locals }) => {
		if (!locals.user) {
			throw fail(401);
		}
	}
};
