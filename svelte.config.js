import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { preprocessMeltUI } from '@melt-ui/pp';
import sequence from 'svelte-sequential-preprocessor';

/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sequence([vitePreprocess({}), preprocessMeltUI()]),
	vitePlugin: {
		inspector: {
			toggleKeyCombo: 'control-alt-shift',
			showToggleButton: 'always',
			toggleButtonPos: 'bottom-right',
		},
	},
	kit: {
		adapter: adapter(),
		alias: {
			$assets: './src/assets',
			$components: './src/components',
			'$components/*': 'src/lib/components/*',
			$db: './src/db',
			$server: './src/server',
			$lib: './src/lib',
			$state: './src/state',
			$styles: './src/styles',
			$themes: './src/themes',
		},
	},
	shadcn: {
		componentPath: './src/lib/components/ui',
	},
	compilerOptions: {
		enableSourcemap: true,
	},
};

export default config;
