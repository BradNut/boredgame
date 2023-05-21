import { redirect, type Handle } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	console.log(JSON.stringify(event));
	if (event.locals?.auth) {
		const { user } = await event.locals.auth.validateUser();
		event.locals.user = user;
		if (event.route.id?.startsWith('/(protected)')) {
			if (!user) throw redirect(302, '/auth/sign-in');
			if (!user.verified) throw redirect(302, '/auth/verify/email');
		}
	}

	return await resolve(event);
};
