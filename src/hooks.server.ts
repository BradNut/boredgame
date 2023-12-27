import * as Sentry from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { browser, dev } from '$app/environment';
import { lucia } from '$lib/server/auth';

Sentry.init({
	dsn: 'https://742e43279df93a3c4a4a78c12eb1f879@o4506057768632320.ingest.sentry.io/4506057770401792',
	tracesSampleRate: 1,
	environment: dev ? 'development' : 'production'
});

export const authentication: Handle = async function ({ event, resolve }) {
	const startTimer = Date.now();
	event.locals.startTimer = startTimer;

	let ip = event.request.headers.get('x-forwarded-for') as string;
	if (!ip && browser) {
		ip = event.getClientAddress();
	}
	const country = event.request.headers.get('x-vercel-ip-country') as string || 'unknown';
	event.locals.session = {
		ip,
		country
	};

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	}
	event.locals.user = user;

	return resolve(event);
};

export const handle: Handle = sequence(sequence(Sentry.sentryHandle(), authentication));
export const handleError = Sentry.handleErrorWithSentry();