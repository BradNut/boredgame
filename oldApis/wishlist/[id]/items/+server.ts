import { error, json } from '@sveltejs/kit';

export async function GET({ url, locals, params }) {
	const searchParams = Object.fromEntries(url.searchParams);
	return json({});
}
