export const load: PageServerLoad = async ({ fetch, url }) => {
	const searchParams = Object.fromEntries(url?.searchParams);
	const q = searchParams?.q;
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;

	return {
		q,
		limit,
		skip
	};
};
