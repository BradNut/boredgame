import "reflect-metadata";
import { StatusCodes } from "$lib/constants/status-codes";
import type { ApiRoutes } from "$lib/server/api";
import { parseApiResponse } from "$lib/utils/api";
import { type Handle, redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { hc } from "hono/client";
import { i18n } from "$lib/i18n";

const handleParaglide: Handle = i18n.handle();

const apiClient: Handle = async ({ event, resolve }) => {
	/* ------------------------------ Register api ------------------------------ */
	const { api } = hc<ApiRoutes>("/", {
		fetch: event.fetch,
		headers: {
			"x-forwarded-for": event.url.host.includes("sveltekit-prerender") ? "127.0.0.1" : event.getClientAddress(),
			host: event.request.headers.get("host") || "",
		},
	});

	/* ----------------------------- Auth functions ----------------------------- */
	async function getAuthedUser() {
		const { data } = await api.me.$get().then(parseApiResponse);
		return { user: data?.user, session: data?.session };
	}

	async function getAuthedUserOrThrow() {
		const { data } = await api.me.$get().then(parseApiResponse);
		if (!data || !data.user) {
			throw redirect(StatusCodes.TEMPORARY_REDIRECT, "/");
		}
		return data?.user;
	}

	/* ------------------------------ Set contexts ------------------------------ */
	event.locals.api = api;
	event.locals.parseApiResponse = parseApiResponse;
	event.locals.getAuthedUser = getAuthedUser;
	event.locals.getAuthedUserOrThrow = getAuthedUserOrThrow;

	/* ----------------------------- Return response ---------------------------- */
	return await resolve(event);
};

export const handle: Handle = sequence(apiClient, handleParaglide);
