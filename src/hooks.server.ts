import { hc } from 'hono/client';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { ApiRoutes } from '$lib/server/api';
import { parseApiResponse } from '$lib/utils/api';
import { StatusCodes } from '$lib/constants/status-codes';

const apiClient: Handle = async ({ event, resolve }) => {
	/* ------------------------------ Register api ------------------------------ */
	const { api } = hc<ApiRoutes>('/', {
		fetch: event.fetch,
		headers: {
			'x-forwarded-for': event.getClientAddress(),
			host: event.request.headers.get('host') || ''
		}
	});

	/* ----------------------------- Logging Request ---------------------------- */
	console.log('Request Method:', event.request.method);
	console.log('Request URL:', event.request.url);

	/* ----------------------------- Auth functions ----------------------------- */
	async function getAuthedUser() {
		const { data } = await api.user.me.$get().then(parseApiResponse)
		return data && data.user;
	}

	async function getAuthedUserOrThrow() {
		const { data } = await api.user.me.$get().then(parseApiResponse);
		if (!data || !data.user) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
		return data?.user;
	}

	/* ------------------------------ Set contexts ------------------------------ */
	event.locals.api = api;
	event.locals.parseApiResponse = parseApiResponse;
	event.locals.getAuthedUser = getAuthedUser;
	event.locals.getAuthedUserOrThrow = getAuthedUserOrThrow;

	/* ----------------------------- Return response ---------------------------- */
	const response = await resolve(event);
	return response;
};

export const handle: Handle = sequence(apiClient);
