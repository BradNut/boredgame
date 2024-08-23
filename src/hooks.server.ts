// import * as Sentry from '@sentry/sveltekit';
import 'reflect-metadata'
import { hc } from 'hono/client';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import type { ApiRoutes } from '$lib/server/api';
import { parseApiResponse } from '$lib/utils/api';
import { StatusCodes } from '$lib/constants/status-codes';

// TODO: Fix Sentry as it is not working on SvelteKit v2
// Sentry.init({
// 	dsn: 'https://742e43279df93a3c4a4a78c12eb1f879@o4506057768632320.ingest.sentry.io/4506057770401792',
// 	tracesSampleRate: 1,
// 	environment: dev ? 'development' : 'production',
// 	enabled: !dev
// });

const apiClient: Handle = async ({ event, resolve }) => {
	/* ------------------------------ Register api ------------------------------ */
	const { api } = hc<ApiRoutes>('/', {
		fetch: event.fetch,
		headers: {
			'x-forwarded-for': event.url.host.includes('sveltekit-prerender') ? '127.0.0.1' : event.getClientAddress(),
			host: event.request.headers.get('host') || ''
		}
	});

	/* ----------------------------- Auth functions ----------------------------- */
	async function getAuthedUser() {
		const { data } = await api.user.$get().then(parseApiResponse)
		return data?.user;
	}

	async function getAuthedUserOrThrow() {
		const { data } = await api.user.$get().then(parseApiResponse);
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

// export const authentication: Handle = async function ({ event, resolve }) {
// 	event.locals.startTimer = Date.now();
//
// 	const ip = event.request.headers.get('x-forwarded-for') as string;
// 	const country = event.request.headers.get('x-vercel-ip-country') as string;
// 	event.locals.ip = dev ? '127.0.0.1' : ip; // || event.getClientAddress();
// 	event.locals.country = dev ? 'us' : country;
//
// 	const sessionId = event.cookies.get(lucia.sessionCookieName);
// 	if (!sessionId) {
// 		event.locals.user = null;
// 		event.locals.session = null;
// 		return resolve(event);
// 	}
//
// 	const { session, user } = await lucia.validateSession(sessionId);
// 	if (session && session.fresh) {
// 		const sessionCookie = lucia.createSessionCookie(session.id);
// 		console.log('sessionCookie', JSON.stringify(sessionCookie, null, 2));
// 		// sveltekit types deviates from the de-facto standard, you can use 'as any' too
// 		event.cookies.set(sessionCookie.name, sessionCookie.value, {
// 			path: '.',
// 			...sessionCookie.attributes,
// 		});
// 	}
// 	console.log('session from hooks', JSON.stringify(session, null, 2));
// 	if (!session) {
// 		const sessionCookie = lucia.createBlankSessionCookie();
// 		console.log('blank sessionCookie', JSON.stringify(sessionCookie, null, 2));
// 		event.cookies.set(sessionCookie.name, sessionCookie.value, {
// 			path: '.',
// 			...sessionCookie.attributes,
// 		});
// 	}
// 	event.locals.user = user;
// 	event.locals.session = session;
//
// 	return resolve(event);
// };

export const handle: Handle = sequence(
	// Sentry.sentryHandle(),
	// authentication,
	apiClient
);
// export const handleError = Sentry.handleErrorWithSentry();
