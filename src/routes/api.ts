import { BOARD_GAME_ATLAS_CLIENT_ID } from '$env/static/private';
import { URLSearchParams } from 'url';

const base = 'https://api.boardgameatlas.com/api';

export function boardGameApi(
	method: string,
	resource: string,
	queryParams: Record<string, string>,
	data?: Record<string, unknown>
) {
	// console.log('queryParams', queryParams);
	queryParams.client_id = BOARD_GAME_ATLAS_CLIENT_ID;
	const urlQueryParams = new URLSearchParams(queryParams);
	const url = `${base}/${resource}${urlQueryParams ? `?${urlQueryParams}` : ''}`;
	return fetch(url, {
		method,
		headers: {
			'Content-Type': 'application/json'
		},
		body: data && JSON.stringify(data)
	});
}
