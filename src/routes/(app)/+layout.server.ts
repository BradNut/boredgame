import { loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from '../$types';
// import { userFullyAuthenticated, userNotFullyAuthenticated } from '$lib/server/auth-utils';
// import { lucia } from '$lib/server/auth';

export const load: LayoutServerLoad = loadFlash(async (event) => {
	const { url, locals, cookies } = event;
	const authedUser = await locals.getAuthedUser();

	// if (userNotFullyAuthenticated(user, session)) {
	// 	await lucia.invalidateSession(locals.session!.id!);
	// 	const sessionCookie = lucia.createBlankSessionCookie();
	// 	cookies.set(sessionCookie.name, sessionCookie.value, {
	// 		path: '.',
	// 		...sessionCookie.attributes,
	// 	});
	// }

	return {
		url: url.pathname,
		// user: userFullyAuthenticated(user, session) ? locals.user : null,
		user: authedUser,
	};
});
