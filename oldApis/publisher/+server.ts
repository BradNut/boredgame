import { createPublisher } from '$lib/utils/db/publisherUtils.js';
import type { Publishers } from '$db/schema';

type PublisherCreate = {
	publisher: Publishers;
	externalId: string;
};

export async function POST({ request, locals }) {
	const data: PublisherCreate = await request.json();
	console.log('data', data);

	try {
		return await createPublisher(locals, data.publisher, data.externalId);
	} catch (e) {
		console.error(e);
		return new Response('Could not create publisher', {
			status: 500,
		});
	}
}
