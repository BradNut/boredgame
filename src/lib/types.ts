import type { SvelteComponent } from "svelte";

export type Dialog = {
  isOpen: boolean;
  content?: typeof SvelteComponent;
  additionalData?: SavedGameType | GameType;
}

export type Search = {
  totalCount: number;
  pageSize: number;
  skip: number;
  currentPage: number;
}

export type BoredStore = {
  loading: boolean;
  dialog: Dialog;
  search: Search;
};

export enum ToastType {
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARNING = 'WARNING'
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

export type SavedGameType = {
  id: string;
  name: string;
  thumb_url: string;
}

export type GameType = {
  id: string;
  handle: string;
  name: string;
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
  min_players: number;
  max_players: number;
  min_playtime: number;
  max_playtime: number;
  min_age: number;
  description: string;
  description_preview: string;
  players: string;
  playtime: string;
};

export type SearchQuery = {
  client_id: string;
  limit?: number;
  skip?: number;
  ids?: string[];
  list_id?: string;
  kickstarter?: boolean;
  random?: boolean;
  name?: string;
  exact?: boolean;
  fuzzy_match?: boolean;
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
  gt_price?: bigint;
  gt_msrp?: bigint;
  gt_discount?: bigint;
  gt_reddit_count?: number;
  gt_reddit_week_count?: number;
  gt_reddit_day_count?: number;
  lt_min_players?: number;
  lt_max_players?: number;
  lt_min_playtime?: number;
  lt_max_playtime?: number;
  lt_min_age?: number;
  lt_year_published?: number;
  lt_price?: bigint;
  lt_msrp?: bigint;
  lt_discount?: bigint;
  lt_reddit_count?: number;
  lt_reddit_week_count?: number;
  lt_reddit_day_count?: number;
  fields?: string;
};
