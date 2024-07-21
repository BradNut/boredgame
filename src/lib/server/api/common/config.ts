import * as envs from '$env/static/private';

const isPreview = process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development';

let domain;
if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
	domain = 'boredgame.vercel.app';
} else if (isPreview) {
	domain = process.env.VERCEL_BRANCH_URL;
} else {
	domain = 'localhost';
}

export const config = { ...envs, isProduction: process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production', domain };
