import { error, json } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { BggClient } from 'boardgamegeekclient';
import type { ISearchRequest } from 'boardgamegeekclient/dist/esm/request/index.js';
import { search_schema } from '$lib/zodValidation.js';

export async function GET({ url }) {
	const searchParams = Object.fromEntries(url.searchParams);
	console.log('searchParams external', searchParams);
	const q = searchParams?.q || '';
	const exact = parseInt(searchParams.exact) || 0;
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;

	// TODO: Debounce and throttle
	try {
		search_schema.parse({
			q,
			limit,
			skip
		});
	} catch (e) {
		console.error(e);
		if (e instanceof ZodError) {
			throw error(400, { message: e.flatten().fieldErrors });
		}

		throw error(500, { message: 'Something went wrong' });
	}

	const client = BggClient.Create();
	const request: ISearchRequest = {
		query: q,
		exact,
		type: ['boardgame', 'boardgameaccessory', 'boardgameexpansion']
	};
	const response = await client.search.query(request);

	if (!response || response.length === 0 || response[0]?.total === 0) {
		console.log('No results found in external search', response);
		throw error(404, { message: 'No results found in external search' });
	}

	const result = response[0];
	const start = skip;
	let end = start + limit;

	if (end > result.total) {
		end = result.total;
	}
	const games = result.items.slice(start, end);
	const apiResponse = {
		totalCount: response[0].total,
		games
	};

	console.log('Response from BGG', JSON.stringify(result, null, 2));

	return json(apiResponse);
}
