import { github } from "$lib/server/auth";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code')
	const state = event.url.searchParams.get('state')
	const { data, error } = await locals.api.oauth.$get({
		params: {
			code,
			state
		}
	})
}

interface GitHubUser {
	id: number;
	login: string;
}