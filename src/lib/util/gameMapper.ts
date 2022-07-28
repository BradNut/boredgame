import type { GameType } from '$lib/types';

export function mapAPIGameToBoredGame(game): GameType {
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
