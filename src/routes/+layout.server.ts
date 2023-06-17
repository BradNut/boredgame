export const load = async ({ url, locals }) => {
	return {
		url: url.pathname,
		user: locals.user
	};
};
