import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],
	vitePlugin: {
		inspector: true
	},
	kit: {
		adapter: adapter(),
		alias: {
			$assets: './src/assets',
			$components: './src/components',
			'$components/*': 'src/lib/components/*',
			$db: './src/db',
			$lib: './src/lib',
			$state: './src/state',
			$styles: './src/styles',
			$themes: './src/themes'
		}
	},
	shadcn: {
		componentPath: './src/lib/components/ui'
	}
};
export default config;
