import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import db from '../../../../../db';
import { collection_items, usersTable } from '$db/schema';

// Search a user's collection
export async function GET({ url, locals, params }) {
	const searchParams = Object.fromEntries(url.searchParams);
	const q = searchParams?.q || '';
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;
	const order = searchParams?.order || 'asc';
	const sort = searchParams?.sort || 'name';
	const collection_id = params.id;
	console.log('url', url);
	console.log('username', locals?.user?.id);

	if (!locals.user) {
		error(401, { message: 'Unauthorized' });
	}

	const collection = await db.query.collections.findFirst({
		where: eq(usersTable.id, locals?.user?.id),
	});
	console.log('collection', collection);

	if (!collection) {
		console.log('Collection was not found');
		error(404, { message: 'Collection was not found' });
	}

	try {
		const userCollectionItems = await db.query.collection_items.findMany({
			where: eq(collection_items.collection_id, collection_id),
			with: {
				game: {
					columns: {
						id: true,
						name: true,
						thumb_url: true,
					},
				},
			},
			orderBy: (collection_items, { asc, desc }) => {
				const dbSort =
					sort === 'dateAdded' ? collection_items.created_at : collection_items.times_played;
				if (order === 'asc') {
					return asc(dbSort);
				} else {
					return desc(dbSort);
				}
			},
			offset: skip,
			limit,
		});

		return json(userCollectionItems);
	} catch (e) {
		console.error(e);
		error(500, { message: 'Something went wrong' });
	}
}
