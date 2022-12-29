import type { GameType, SavedGameType } from '$lib/types';

export function convertToSavedGame(game: GameType | SavedGameType): SavedGameType {
	return {
		id: game.id,
		name: game.name,
		thumb_url: game.thumb_url,
		players: game.players,
		playtime: game.playtime,
		searchTerms: `${game.name.toLowerCase()}`
	};
}

export function mapSavedGameToGame(game: SavedGameType): GameType {
	const { id, name, thumb_url, players, playtime } = game;
	console.log({ id, name, thumb_url, players, playtime });

	return {
		id,
		handle: '',
		name,
		url: '',
		edit_url: '',
		thumb_url,
		image_url: '',
		price: 0,
		price_ca: 0,
		price_uk: 0,
		price_au: 0,
		msrp: 0,
		year_published: new Date().getFullYear(),
		min_players: 0,
		max_players: 0,
		min_playtime: 0,
		max_playtime: 0,
		min_age: 0,
		description: '',
		description_preview: '',
		players,
		playtime
	};
}

// TODO: TYpe API response
export function mapAPIGameToBoredGame(game: any): GameType {
	const {
		id,
		handle,
		name,
		url,
		edit_url,
		thumb_url,
		image_url,
		price,
		price_ca,
		price_uk,
		price_au,
		msrp,
		year_published,
		min_players,
		max_players,
		min_playtime,
		max_playtime,
		min_age,
		description,
		description_preview,
		players,
		playtime
	} = game;
	return {
		id,
		handle,
		name,
		url,
		edit_url,
		thumb_url,
		image_url,
		price,
		price_ca,
		price_uk,
		price_au,
		msrp,
		year_published,
		min_players,
		max_players,
		min_playtime,
		max_playtime,
		min_age,
		description,
		description_preview,
		players,
		playtime
	};
}
