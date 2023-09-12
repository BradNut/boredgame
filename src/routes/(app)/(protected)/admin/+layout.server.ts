import { redirect } from '@sveltejs/kit';

export const load = async function ({ locals }) {
	if (!locals?.user?.role?.includes('admin')) throw redirect(302, '/');
};
