import type { SvelteComponent } from 'svelte';
import { collections } from '../schema';

export type Message = { status: 'error' | 'success' | 'warning' | 'info'; text: string };

export type Dialog = {
	isOpen: boolean;
	content?: typeof SvelteComponent<any>;
	additionalData?: SavedGameType | GameType;
};

export type Search = {
	name: string;
	minAge: string;
	minPlayers: string;
	maxPlayers: string;
	exactMinAge: string;
	exactMinPlayers: string;
	exactMaxPlayers: string;
	skip: number;
	currentPage: number;
	limit: number;
};

export type BoredStore = {
	loading: boolean;
	dialog: Dialog;
};

export enum ToastType {
	INFO = 'INFO',
	ERROR = 'ERROR',
	WARNING = 'WARNING',
}

export type ToastData = {
	id: number;
	duration: number;
	dismissible: boolean;
	showButton: boolean;
	autoDismiss: boolean;
	type: ToastType;
	message: string;
};

export type GameMechanic = {
	id: string;
	name: string;
	boardGameAtlasLink: string;
};

export type SavedGameType = {
	id: string;
	name: string;
	thumb_url: string;
	players: string;
	playtime: string;
	mechanics: GameMechanic[];
	searchTerms: string;
	includeInRandom: boolean;
};

export type ListGameType = {
	id: string;
	game_id: string;
	collection_id: string | undefined;
	wishlist_id: string | undefined;
	times_played: number;
	thumb_url: string;
};

export type MechanicType = {
	id: string;
};

export type CategoryType = {
	id: string;
};

export type PublisherType = {
	id: string;
};

export type DesignerType = {
	id: string;
};

export type ArtistType = {
	id: string;
};

export type ExpansionType = {
	id: string;
};

export type BGGLinkType =
	| 'boardgamecategory'
	| 'boardgamemechanic'
	| 'boardgameexpansion'
	| 'boardgameartist'
	| 'boardgamepublisher';

export type BGGLink = {
	id: number;
	type: BGGLinkType;
	value: string;
};

export type GameType = {
	id: string;
	name: string;
	slug: string;
	url: string;
	edit_url: string;
	thumb_url: string;
	image_url: string;
	price: number;
	price_ca: number;
	price_uk: number;
	price_au: number;
	msrp: number;
	year_published: number;
	categories: CategoryType[];
	mechanics: MechanicType[];
	primary_publisher: PublisherType;
	publishers: PublisherType[];
	primary_designer: DesignerType;
	designers: DesignerType[];
	developers: String[];
	artists: ArtistType[];
	expansions: ExpansionType[];
	min_players: number;
	max_players: number;
	min_playtime: number;
	max_playtime: number;
	min_age: number;
	description: string;
	players: string;
	playtime: number;
	external_id: number;
};

export type SearchQuery = {
	limit?: number;
	skip?: number;
	ids?: string[];
	list_id?: string;
	random?: boolean;
	q?: string;
	exact?: boolean;
	designer?: string;
	publisher?: string;
	artist?: string;
	mechanics?: string;
	categories?: string;
	order_by?: string;
	ascending?: boolean;
	min_players?: number;
	max_players?: number;
	min_playtime?: number;
	max_playtime?: number;
	min_age?: number;
	year_published?: number;
	gt_min_players?: number;
	gt_max_players?: number;
	gt_min_playtime?: number;
	gt_max_playtime?: number;
	gt_min_age?: number;
	gt_year_published?: number;
	lt_min_players?: number;
	lt_max_players?: number;
	lt_min_playtime?: number;
	lt_max_playtime?: number;
	lt_min_age?: number;
	lt_year_published?: number;
	fields?: string;
};

export type UICollection = Pick<typeof collections, 'id' | 'cuid' | 'name'>;
