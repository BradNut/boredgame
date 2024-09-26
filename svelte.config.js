import 'reflect-metadata'
import { preprocessMeltUI } from '@melt-ui/pp'
import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import sequence from 'svelte-sequential-preprocessor'

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
			$db: './src/lib/server/api/infrastructure/database',
			$server: './src/server',
			$lib: './src/lib',
			$routes: './src/routes',
			$src: './src',
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
}

export default config
