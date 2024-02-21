import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { BggForm } from "$lib/zodValidation";
import { superValidate } from "sveltekit-superforms/server";

export const load: PageServerLoad = async ({ locals, fetch }) => {
	const user = locals.user;
	if (!user) {
		redirect(302, '/login');
	}

	const form = await superValidate({}, BggForm);

	return { form };
}