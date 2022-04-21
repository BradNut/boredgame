import { z } from "zod";

export const BoardGameSearch = z.object({
  minAge: z.number(),
  maxAge: z.number(),
  minPlayers: z.number(),
  maxPlayers: z.number(),
});

export const Game = z.object({
  id: z.string(),
  handle: z.string(),
  name: z.string(),
  url: z.string(),
  edit_url: z.string(),
  price: z.number(),
  price_ca: z.number(),
  price_uk: z.number(),
  price_au: z.number(),
  msrp: z.number(),
  year_published: z.number(),
  min_players: z.number(),
  max_players: z.number(),
  min_playtime: z.number(),
  max_playtime: z.number(),
  min_age: z.number(),
  description: z.string(),
  players: z.string(),
  playtime: z.string(),
});
