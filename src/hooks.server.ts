import * as Sentry from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { auth } from '$lib/server/lucia';

Sentry.init({
	dsn: 'https://742e43279df93a3c4a4a78c12eb1f879@o4506057768632320.ingest.sentry.io/4506057770401792',
	tracesSampleRate: 1,
	environment: dev ? 'development' : 'production'
});

export const authentication: Handle = async function ({ event, resolve }) {
	const startTimer = Date.now();
	event.locals.startTimer = startTimer;

	event.locals.auth = auth.handleRequest(event);
	if (event?.locals?.auth) {
		console.log('auth not empty');
		console.log('auth', event.locals.auth);
		try {
			const session = await event.locals.auth.validate();
			console.log('user', session?.user);
			console.log('session', JSON.stringify(session, null, 2));
			event.locals.user = session?.user;
			// if (event.route.id?.startsWith('/(protected)')) {
			// if (!user) throw redirect(302, '/sign-in');
			// if (!user.verified) throw redirect(302, '/verify/email');
			// }
		} catch (error) {
			console.error('Error validating user', error);
		}
	} else {
		console.log('auth empty');
	}
	return await resolve(event);
};

// This hook is used to pass our prisma instance to each action, load, and endpoint
// export const prisma: Handle = async function ({ event, resolve }) {
// 	try {
// 		const ip = event.request.headers.get('x-forwarded-for') as string;
// 		const country = event.request.headers.get('x-vercel-ip-country') as string;
// 		event.locals.prisma = prisma_client;
// 		event.locals.session = {
// 			...event.locals.session,
// 			ip,
// 			country
// 		};
// 	} catch (error) {
// 		console.error(error);
// 	}
// 	return await resolve(event);
// };

export const handle: Handle = sequence(sequence(Sentry.sentryHandle(), authentication));
export const handleError = Sentry.handleErrorWithSentry();