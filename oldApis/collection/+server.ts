import { error } from '@sveltejs/kit';

// Fetch collection for user
export function GET({ url }) {
	const searchParams = Object.fromEntries(url.searchParams);
	const q = searchParams?.q;
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;

	return new Response();
}

// Create a new collection for user
export function POST({ url }) {
	const searchParams = Object.fromEntries(url.searchParams);
	const q = searchParams?.q;
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;
}

// Update or Create a collection
export function PUT({ url }) {
	const searchParams = Object.fromEntries(url.searchParams);
	const q = searchParams?.q;
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;
}

//
