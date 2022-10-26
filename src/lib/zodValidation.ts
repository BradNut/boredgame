import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const BoardGameSearch = z.object({
  minAge: z.number(),
  maxAge: z.number(),
  minPlayers: z.number(),
  maxPlayers: z.number()
});

export const Board

export const game_schema = z.object({
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
  playtime: z.string()
});

export const game_raw_schema_json = zodToJsonSchema(game_schema, {
  $refStrategy: 'none',
});

export type Game = z.infer<typeof game_schema>;
