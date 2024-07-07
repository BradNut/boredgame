export async function load(event) {
	const { url, locals } = event;

	return {
		url: url.pathname,
		user: locals.user
	};
};
