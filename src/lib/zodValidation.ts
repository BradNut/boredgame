import { z, ZodNumber, ZodOptional } from 'zod';
// import zodToJsonSchema from 'zod-to-json-schema';

export const BoardGameSearch = z.object({
	minAge: z.number(),
	maxAge: z.number(),
	minPlayers: z.number(),
	maxPlayers: z.number()
});

export const saved_game_schema = z.object({
	id: z.string(),
	name: z.string(),
	thumb_url: z.string(),
	players: z.string(),
	playtime: IntegerString(z.number())
});

export const list_game_request_schema = z.object({
	id: z.string(),
	externalId: z.string()
});

export type ListGameSchema = typeof list_game_request_schema;

// https://github.com/colinhacks/zod/discussions/330
function IntegerString<schema extends ZodNumber | ZodOptional<ZodNumber>>(schema: schema) {
	return z.preprocess(
		(value) =>
			typeof value === 'string'
				? parseInt(value, 10)
				: typeof value === 'number'
				? value
				: undefined,
		schema
	);
}

const Search = z.object({
	q: z.string().trim().optional().default(''),
	minAge: IntegerString(z.number().min(1).max(120).optional()),
	minPlayers: IntegerString(z.number().min(1).max(50).optional()),
	maxPlayers: IntegerString(z.number().min(1).max(50).optional()),
	exactMinAge: z.preprocess((a) => Boolean(a), z.boolean().optional()),
	exactMinPlayers: z.preprocess((a) => Boolean(a), z.boolean().optional()),
	exactMaxPlayers: z.preprocess((a) => Boolean(a), z.boolean().optional()),
	sort: z.enum(['asc', 'desc']).optional(),
	sortBy: z.enum(['name', 'min_players', 'max_players', 'min_age', 'times_played']).optional(),
	limit: z.number().min(10).max(100).default(10),
	skip: z.number().min(0).default(0)
});

export const search_schema = z
	.object({
		q: z.string().trim().optional().default(''),
		minAge: IntegerString(z.number().min(1).max(120).optional()),
		minPlayers: IntegerString(z.number().min(1).max(50).optional()),
		maxPlayers: IntegerString(z.number().min(1).max(50).optional()),
		exactMinAge: z.preprocess((a) => Boolean(a), z.boolean().optional()),
		exactMinPlayers: z.preprocess((a) => Boolean(a), z.boolean().optional()),
		exactMaxPlayers: z.preprocess((a) => Boolean(a), z.boolean().optional()),
		sort: z.enum(['asc', 'desc']).optional(),
		sortBy: z.enum(['name', 'min_players', 'max_players', 'min_age', 'times_played']).optional(),
		limit: z.number().min(10).max(100).default(10),
		skip: z.number().min(0).default(0)
	})
	.superRefine(
		({ minPlayers, maxPlayers, minAge, exactMinAge, exactMinPlayers, exactMaxPlayers }, ctx) => {
			console.log({ minPlayers, maxPlayers });
			if (minPlayers && maxPlayers && minPlayers > maxPlayers) {
				ctx.addIssue({
					code: 'custom',
					message: 'Min Players must be smaller than Max Players',
					path: ['minPlayers']
				});
				ctx.addIssue({
					code: 'custom',
					message: 'Min Players must be smaller than Max Players',
					path: ['maxPlayers']
				});
			}

			if (exactMinAge && !minAge) {
				ctx.addIssue({
					code: 'custom',
					message: 'Min Age required when searching for exact min age',
					path: ['minAge']
				});
			}

			if (exactMinPlayers && !minPlayers) {
				ctx.addIssue({
					code: 'custom',
					message: 'Min Players required when searching for exact min players',
					path: ['minPlayers']
				});
			}

			if (exactMaxPlayers && !maxPlayers) {
				ctx.addIssue({
					code: 'custom',
					message: 'Max Players required when searching for exact max players',
					path: ['maxPlayers']
				});
			}
		}
	);

export type SearchSchema = typeof search_schema;

export const collection_search_schema = Search.extend({
	collection_id: z.string()
});

export type CollectionSearchSchema = typeof collection_search_schema;

export const search_result_schema = z.object({
	client_id: z.string(),
	limit: z.number(),
	skip: z.number(),
	ids: z.string().array(),
	list_id: z.string(),
	kickstarter: z.boolean(),
	random: z.boolean(),
	name: z.string(),
	exact: z.boolean(),
	fuzzy_match: z.boolean(),
	designer: z.string(),
	publisher: z.string(),
	artist: z.string(),
	mechanics: z.string(),
	categories: z.string(),
	order_by: z.string(),
	ascending: z.boolean(),
	min_players: z.number(),
	max_players: z.number(),
	min_playtime: z.number(),
	max_playtime: z.number(),
	min_age: z.number(),
	year_published: z.number(),
	gt_min_players: z.number(),
	gt_max_players: z.number(),
	gt_min_playtime: z.number(),
	gt_max_playtime: z.number(),
	gt_min_age: z.number(),
	gt_year_published: z.number(),
	gt_price: z.bigint(),
	gt_msrp: z.bigint(),
	gt_discount: z.bigint(),
	gt_reddit_count: z.number(),
	gt_reddit_week_count: z.number(),
	gt_reddit_day_count: z.number(),
	lt_min_players: z.number(),
	lt_max_players: z.number(),
	lt_min_playtime: z.number(),
	lt_max_playtime: z.number(),
	lt_min_age: z.number(),
	lt_year_published: z.number(),
	lt_price: z.bigint(),
	lt_msrp: z.bigint(),
	lt_discount: z.bigint(),
	lt_reddit_count: z.number(),
	lt_reddit_week_count: z.number(),
	lt_reddit_day_count: z.number(),
	fields: z.string()
});

export type SearchResultSchema = typeof search_result_schema;

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

export const category_schema = z.object({
	id: z.string(),
	name: z.string()
});

export const mechanics_schema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional()
});

const gameSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	year_published: z.number().optional(),
	min_players: z.number().optional(),
	max_players: z.number().optional(),
	min_playtime: z.number().optional(),
	max_playtime: z.number().optional(),
	min_age: z.number().optional(),
	image_url: z.string().optional(),
	thumb_url: z.string().optional(),
	url: z.string().optional(),
	rules_url: z.string().optional(),
	weight_amount: z.number().optional(),
	weight_units: z.enum(['Medium', 'Heavy']).optional(),
	categories: z.array(category_schema).optional(),
	mechanics: z.array(mechanics_schema).optional(),
	designers: z
		.array(
			z.object({
				id: z.string(),
				name: z.string()
			})
		)
		.optional(),
	publishers: z
		.array(
			z.object({
				id: z.string(),
				name: z.string()
			})
		)
		.optional(),
	artists: z
		.array(
			z.object({
				id: z.string(),
				name: z.string()
			})
		)
		.optional(),
	names: z.array(z.string()).optional(),
	expansions: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				year_published: z.number().optional()
			})
		)
		.optional(),
	primary_publisher: z
		.object({
			id: z.string(),
			name: z.string()
		})
		.optional()
});

const searchResultSchema = z.object({
	games: z.array(gameSchema),
	count: z.number()
});

// export const game_raw_schema_json = zodToJsonSchema(game_schema, {
//   $refStrategy: 'none',
// });

export type Game = z.infer<typeof game_schema>;
