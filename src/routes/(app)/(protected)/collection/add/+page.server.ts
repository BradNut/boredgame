import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { notSignedInMessage } from "$lib/flashMessages";

export async function load(event) {
	const { locals } = event;
	const user = locals.user;
	if (!user) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	return {}
}