import type { GameType, SavedGameType } from '$lib/types';
import kebabCase from 'just-kebab-case';
import type { Games } from '$db/schema';

export function convertToSavedGame(game: GameType | SavedGameType): SavedGameType {
	return {
		id: game.id,
		name: game.name,
		thumb_url: game.thumb_url,
		players: game.players,
		playtime: game.playtime,
		searchTerms: `${game.name.toLowerCase()}`,
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
		playtime,
	};
}

export function mapAPIGameToBoredGame(game: GameType): Games {
	// TODO: Fix types
	return {
		name: game.name,
		slug: kebabCase(game.name),
		thumb_url: game.thumb_url,
		image_url: game.image_url,
		year_published: game.year_published,
		min_players: game.min_players,
		max_players: game.max_players,
		min_playtime: game.min_playtime,
		max_playtime: game.max_playtime,
		min_age: game.min_age,
		description: game.description,
	};
}
