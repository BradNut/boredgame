import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals, fetch }) => {
	const user = locals.user;
	if (!user) {
		redirect(302, '/login');
	}

	
}