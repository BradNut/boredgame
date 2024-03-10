import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import db from '$lib/drizzle.js';
import { wishlist_items, wishlists } from '../../../../../schema.js';

// Search a user's collection
export async function GET({ url, locals, params }) {
	const searchParams = Object.fromEntries(url.searchParams);
	// const q = searchParams?.q || '';
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;
	const order = searchParams?.order || 'asc';
	const wishlist_id = params.id;
	console.log('url', url);
	console.log('username', locals?.user?.id);

	if (!locals.user) {
		return new Response(null, {
			status: 401
		});
	}

	const wishlist = await db.query.wishlists.findFirst({
		where: eq(wishlists.user_id, locals?.user?.id)
	});
	console.log('wishlist', wishlist);

	if (!wishlist) {
		console.log('Wishlist was not found');
		error(404, { message: 'Wishlist was not found' });
	}

	try {
		const itemsInWishlist = await db.query.wishlist_items.findMany({
			where: eq(wishlist_items.wishlist_id, wishlist_id),
			with: {
				game: {
					columns: {
						id: true,
						name: true,
						thumb_url: true
					}
				}
			},
			orderBy: (wishlist_items, { asc, desc }) => {
				const dbSort = wishlist_items.created_at;
				if (order === 'asc') {
					return asc(dbSort);
				} else {
					return desc(dbSort);
				}
			},
			offset: skip,
			limit
		});

		return json(itemsInWishlist);
	} catch (e) {
		console.error(e);
		error(500, { message: 'Something went wrong' });
	}
}
