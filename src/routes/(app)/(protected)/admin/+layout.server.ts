import { redirect } from '@sveltejs/kit';
import type { PageServerData } from './$types';

export const load: PageServerData = async function ({ locals }) {
	if (!locals?.user?.role?.includes('admin')) throw redirect(302, '/');
};
