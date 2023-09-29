import { HttpError_1, error, json } from '@sveltejs/kit';
import { BggClient } from 'boardgamegeekclient';

export async function GET({ url, locals, params }) {
	const game_id = Number(params.id).valueOf();

	// TODO: Debounce excessive calls and possibly throttle
	if (isNaN(game_id) || !isFinite(game_id)) {
		throw error(400, { message: 'Invalid game id' });
	}

	console.log('Searching for', game_id);
	const client = BggClient.Create();
	const response = await client.thing.query({
		id: game_id
	});

	if (!response || response.length === 0) {
		throw error(404, { message: 'No results found in external search' });
	}

	const result = response[0];

	const apiResponse = {
		external_id: result.id,
		name: result.name,
		type: result.type,
		description: result.description,
		thumbnail: result.thumbnail,
		image: result.image,
		year_published: result.yearpublished,
		min_players: result.minplayers,
		max_players: result.maxplayers,
		playing_time: result.playingtime,
		min_playtime: result.minplaytime,
		max_playtime: result.maxplaytime,
		min_age: result.minage
	};

	console.log('Response from BGG', JSON.stringify(result, null, 2));

	return json(apiResponse);
}
