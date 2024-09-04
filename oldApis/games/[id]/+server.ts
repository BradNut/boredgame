import { getGame } from '$lib/utils/db/gameUtils.js'
import { error, json } from '@sveltejs/kit'

export const GET = async ({ locals, params }) => {
	const game_id = Number(params.id).valueOf()

	// TODO: Debounce excessive calls and possibly throttle
	if (isNaN(game_id) || !isFinite(game_id)) {
		error(400, { message: 'Invalid game id' })
	}

	try {
		return json(await getGame(locals, params.id))
	} catch (e) {
		console.error(e)
		return new Response('Could not get gamesTable', {
			status: 500,
		})
	}
}
