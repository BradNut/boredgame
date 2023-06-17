import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],
	vitePlugin: {
		inspector: true,
	},
	kit: {
		adapter: adapter(),
		alias: {
			$db: './src/db',
			$assets: './src/assets',
			$lib: './src/lib',
			$styles: './src/styles',
			$themes: './src/themes'
		}
	},
};

export default config;
