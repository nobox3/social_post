const { generateWebpackConfig, merge } = require('shakapacker')
const ForkTSCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const { getEntry } = require('./webpackEntry')

const baseClientWebpackConfig = generateWebpackConfig()

const commonOptions = {
	plugins: [
		new ForkTSCheckerWebpackPlugin(),
		new CompressionPlugin({
			test: /\.(js|css|html|json|ico|svg|eot|otf|ttf|map)$/,
			filename: '[path][base].gz',
			algorithm: 'gzip',
		}),
	],
	resolve: {
		extensions: [
			'.ts', '.tsx', '.jsx', '.mjs', '.js',
			'.sass', '.scss', '.css', '.module.sass', '.module.scss', '.module.css',
			'.png', '.svg', '.gif', '.jpeg', '.jpg',
		],
	},
}

module.exports = (envSpecific) => {
	// Override the entry point with the common entry point
	baseClientWebpackConfig.entry = getEntry('packs/common')

	// Copy the object using merge b/c the baseClientWebpackConfig and commonOptions are mutable globals
	const clientConfig = merge({}, baseClientWebpackConfig, commonOptions)

	// server-bundle is special and should ONLY be built by the serverConfig
	// In case this entry is not deleted, a very strange "window" not found
	// error shows referring to window["webpackJsonp"]. That is because the
	// client config is going to try to load chunks.
	delete clientConfig.entry['server-bundle']

	if (envSpecific) {
		envSpecific(clientConfig)
	}

	let result
	// For HMR, need to separate the the client and server webpack configurations
	if (process.env.WEBPACK_SERVE || process.env.CLIENT_BUNDLE_ONLY) {
		console.log('[React on Rails] Creating only the client bundles.')
		result = clientConfig
	} else {
		// default is the standard client and server build
		console.log('[React on Rails] Creating both client and server bundles.')
		result = [clientConfig]
	}

	// To debug, uncomment next line and inspect "result"
	// debugger
	return result
}
