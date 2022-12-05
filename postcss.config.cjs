const autoprefixer = require('autoprefixer');
const postcssMediaMinmax = require('postcss-media-minmax');
const customMedia = require('postcss-custom-media');
const atImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const postcssEnvFunction = require('postcss-env-function');

const config = {
  plugins: [
    autoprefixer(),
    postcssMediaMinmax,
    customMedia,
    atImport(),
    postcssNested,
    postcssEnvFunction(),
  ]
};

module.exports = config;
