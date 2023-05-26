// const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const postcssMediaMinmax = require('postcss-media-minmax');
const customMedia = require('postcss-custom-media');
const atImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const postcssEnvFunction = require('postcss-env-function');

const config = {
	plugins: [
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		// tailwindcss(),
		//But others, like autoprefixer, need to run after
		autoprefixer(),
		postcssMediaMinmax,
		customMedia,
		atImport(),
		postcssNested,
		postcssEnvFunction({
			importFrom: './src/lib/util/environmentVariables.json'
		}),
	]
};

module.exports = config;
