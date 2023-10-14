import { error, json } from '@sveltejs/kit';
import { decode } from 'html-entities';
import { BggClient } from 'boardgamegeekclient';

export async function GET({ params, url }) {
	const searchParams = Object.fromEntries(url.searchParams);
	console.log('searchParams external game get', searchParams);
	const simplified = 'true' === searchParams?.simplified || false;
	const game_id = Number(params.id).valueOf();

	// TODO: Debounce excessive calls and possibly throttle
	if (isNaN(game_id) || !isFinite(game_id)) {
		throw error(400, { message: 'Invalid game id' });
	}

	const client = BggClient.Create();
	const response = await client.thing.query({
		id: game_id
	});

	if (!response || response.length === 0) {
		throw error(404, { message: 'No results found in external search' });
	}

	const result = response[0];

	if (simplified) {
		return json({
			external_id: result.id,
			name: decode(result.name)?.trim(),
			type: result.type,
			description: decode(result.description)?.trim(),
			thumbnail: result.thumbnail,
			image: result.image,
			year_published: result.yearpublished,
			min_players: result.minplayers,
			max_players: result.maxplayers,
			playing_time: result.playingtime,
			min_playtime: result.minplaytime,
			max_playtime: result.maxplaytime,
			min_age: result.minage
		});
	}

	const links = result.links;
	let categories = [];
	let mechanics = [];
	let expansions = [];
	let publishers = [];
	let artists = [];
	let designers = [];
	for (const link of links) {
		const linkData = {
			...link,
			value: decode(link.value)?.trim()
		}
		if (link.type === 'boardgamecategory') {
			categories.push(linkData);
		}
		if (link.type === 'boardgamemechanic') {
			mechanics.push(linkData);
		}
		if (link.type === 'boardgameexpansion') {
			expansions.push(linkData);
		}
		if (link.type === 'boardgameartist') {
			artists.push(linkData);
		}
		if (link.type === 'boardgamepublisher') {
			publishers.push(linkData);
		}
		if (link.type === 'boardgamedesigner') {
			designers.push(linkData);
		}
	}

	const apiResponse = {
		external_id: result.id,
		name: decode(result.name)?.trim(),
		type: result.type,
		description: decode(result.description)?.trim(),
		thumbnail: result.thumbnail,
		image: result.image,
		year_published: result.yearpublished,
		min_players: result.minplayers,
		max_players: result.maxplayers,
		playing_time: result.playingtime,
		min_playtime: result.minplaytime,
		max_playtime: result.maxplaytime,
		min_age: result.minage,
		categories,
		mechanics,
		expansions,
		publishers,
		artists,
		designers
	};

	return json(apiResponse);
}
