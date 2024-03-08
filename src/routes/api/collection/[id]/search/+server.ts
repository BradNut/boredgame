import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import db from '$lib/drizzle.js';
import { collection_items, collection_items, users } from '../../../../../schema.js';

// Search a user's collection
export async function GET({ url, locals, params }) {
	const searchParams = Object.fromEntries(url.searchParams);
	const q = searchParams?.q || '';
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;
	const order = searchParams?.order || 'asc';
	const sort = searchParams?.sort || 'name';
	const collection_id = params.id;
	const session = await locals.auth.validate();
	console.log('url', url);
	console.log('username', locals?.user?.id);

	if (!session) {
		error(401, { message: 'Unauthorized' });
	}

	const collection = await db.query.collections.findFirst({
		where: eq(users.id, locals?.user?.userId)
	});
	console.log('collection', collection);

	if (!collection) {
		console.log('Collection was not found');
		error(404, { message: 'Collection was not found' });
	}

	try {
		const orderBy = { [sort]: order };
		let collection_items = await db.query.collection_items.findMany({
			where: eq(collection_items.collection_id, collection_id),
				AND: [
					{
						game: {
							name: {
								contains: q
							}
						}
					}
				]
			},
			orderBy: [
				{
					game: {
						...orderBy
					}
				}
			],
			include: {
				game: {
					select: {
						id: true,
						name: true,
						thumb_url: true
					}
				}
			},
			skip,
			take: limit
		});

		return json(collection_items);
	} catch (e) {
		console.error(e);
		error(500, { message: 'Something went wrong' });
	}
}
