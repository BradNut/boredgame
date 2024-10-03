import type { GameType, SearchQuery } from '$lib/types'
import { createOrUpdateGameMinimal } from '$lib/utils/db/gameUtils'
import { mapAPIGameToBoredGame } from '$lib/utils/gameMapper.js'
import { search_schema } from '$lib/zodValidation'
import { error } from '@sveltejs/kit'
import type { BggThingDto } from 'boardgamegeekclient/dist/esm/dto/index.js'
import kebabCase from 'just-kebab-case'
import { zod } from 'sveltekit-superforms/adapters'
import { superValidate } from 'sveltekit-superforms/server'

async function searchForGames(locals: App.Locals, eventFetch: typeof fetch, urlQueryParams: URLSearchParams) {
	try {
		console.log('urlQueryParams search games', urlQueryParams)

		const headers = new Headers()
		headers.set('Content-Type', 'application/json')
		const requestInit: RequestInit = {
			method: 'GET',
			headers,
		}
		const url = `/api/games/search${urlQueryParams ? `?${urlQueryParams}` : ''}`
		console.log('Calling internal api', url)
		const response = await eventFetch(url, requestInit)
		console.log('response from internal api', response)

		if (response.status !== 404 && !response.ok) {
			console.log('Status from internal api not 200', response.status)
			error(response.status)
		}

		const games = await response.json()
		console.log('games from DB', games)

		const gameNameSearch = urlQueryParams.get('q') ?? ''
		let totalCount = games?.length || 0

		if (totalCount === 0 || !games.find((game: GameType) => game.slug === kebabCase(gameNameSearch))) {
			console.log('No games found in DB for', gameNameSearch)
			const searchQueryParams = urlQueryParams ? `?${urlQueryParams}` : ''
			const externalResponse = await eventFetch(`/api/external/search${searchQueryParams}`, requestInit)

			console.log('Back from external search', externalResponse)

			if (!externalResponse.ok) {
				console.log('Status not 200', externalResponse.status)
				error(externalResponse.status)
			}

			if (externalResponse.ok) {
				const gameResponse = await externalResponse.json()
				console.log('response from external api', gameResponse)
				const gameList: BggThingDto[] = gameResponse?.games
				totalCount = gameResponse?.totalCount
				console.log('totalCount', totalCount)
				for (const game of gameList) {
					console.log(`Retrieving simplified external game details for id: ${game.id} with name ${game.name}`)
					const externalGameResponse = await eventFetch(`/api/external/game/${game.id}?simplified=true`)
					if (externalGameResponse.ok) {
						const externalGame = await externalGameResponse.json()
						console.log('externalGame', externalGame)
						const boredGame = mapAPIGameToBoredGame(externalGame)
						games.push(createOrUpdateGameMinimal(locals, boredGame, externalGame.id))
					}
				}
			}
		}

		return {
			totalCount,
			games,
		}
	} catch (e) {
		console.log(`Error searching board games ${e}`)
	}
	return {
		totalCount: 0,
		games: [],
	}
}

const defaults = {
	limit: 10,
	skip: 0,
	order: 'name',
	sort: 'asc',
	q: '',
	exact: false,
}

export const load = async ({ locals, fetch, url }) => {
	const searchParams = Object.fromEntries(url?.searchParams)
	console.log('searchParams', searchParams)
	searchParams.order = searchParams.order || defaults.order
	searchParams.sort = searchParams.sort || defaults.sort
	searchParams.q = searchParams.q || defaults.q
	const form = await superValidate(
		{
			...searchParams,
			skip: Number(searchParams.skip || defaults.skip),
			limit: Number(searchParams.limit || defaults.limit),
			exact: searchParams.exact ? searchParams.exact === 'true' : defaults.exact,
		},
		zod(search_schema),
	)

	const queryParams: SearchQuery = {
		limit: form.data?.limit,
		skip: form.data?.skip,
		q: form.data?.q,
		exact: form.data?.exact,
	}

	try {
		if (form.data?.q === '') {
			return {
				form,
				searchData: {
					totalCount: 0,
					games: [],
					wishlists: [],
				},
			}
		}

		if (form.data?.minAge) {
			if (form.data?.exactMinAge) {
				queryParams.min_age = form.data?.minAge
			} else {
				queryParams.gt_min_age = form.data?.minAge === 1 ? 0 : form.data?.minAge - 1
			}
		}

		if (form.data?.minPlayers) {
			if (form.data?.exactMinPlayers) {
				queryParams.min_players = form.data?.minPlayers
			} else {
				queryParams.gt_min_players = form.data?.minPlayers === 1 ? 0 : form.data?.minPlayers - 1
			}
		}
		if (form.data?.maxPlayers) {
			if (form.data?.exactMaxPlayers) {
				queryParams.max_players = form.data?.maxPlayers
			} else {
				queryParams.lt_max_players = form.data?.maxPlayers + 1
			}
		}

		const newQueryParams: Record<string, string> = {}
		for (const key in queryParams) {
			newQueryParams[key] = `${queryParams[key as keyof SearchQuery]}`
		}

		const urlQueryParams = new URLSearchParams(newQueryParams)
		const searchData = await searchForGames(locals, fetch, urlQueryParams)

		console.log('search data', JSON.stringify(searchData, null, 2))

		return {
			form,
			// modifyListForm,
			searchData,
			wishlists: [],
		}
	} catch (e) {
		console.log(`Error searching board games ${e}`)
	}

	console.log('returning default no data')
	return {
		form,
		searchData: {
			totalCount: 0,
			games: [],
		},
		wishlists: [],
	}
}

export const actions = {
	random: async ({ request, locals, fetch }) => {
		const form = await superValidate(request, zod(search_schema))
		const queryParams: SearchQuery = {
			order_by: 'rank',
			ascending: false,
			random: true,
			fields: 'id,name,min_age,min_players,max_players,thumb_url,min_playtime,max_playtime,min_age,description',
		}

		const newQueryParams: Record<string, string> = {}
		for (const key in queryParams) {
			newQueryParams[key] = `${queryParams[key as keyof SearchQuery]}`
		}

		const urlQueryParams = new URLSearchParams(newQueryParams)

		return {
			form,
			searchData: await searchForGames(locals, fetch, urlQueryParams),
		}
	},
}
