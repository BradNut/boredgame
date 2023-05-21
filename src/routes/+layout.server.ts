export const load = async (event: { locals: { user: any }; url: URL }) => {
	return {
		url: event.url.pathname,
		user: event.locals.user
	};
};
