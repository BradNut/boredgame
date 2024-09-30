import type { Publishers } from '$db/schema'
import { getPublisher, updatePublisher } from '$lib/utils/db/publisherUtils.js'

export async function GET({ locals, params }) {
	try {
		return await getPublisher(locals, params.id)
	} catch (e) {
		console.error(e)
		return new Response('Could not get publishersTable', {
			status: 500,
		})
	}
}

export async function PUT({ locals, params, request }) {
	const data: Publishers = await request.json()
	const publisherId = params.id
	return await updatePublisher(locals, data, publisherId)
}
