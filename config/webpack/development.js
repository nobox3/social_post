const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { I18NextHMRPlugin } = require('i18next-hmr/webpack')
const { resolve } = require('path')
const webpackConfig = require('./webpackConfig')
const { addEntry } = require('./webpackEntry')

const developmentEnvOnly = (clientWebpackConfig) => {
	addEntry('packs/dev', clientWebpackConfig.entry)

	clientWebpackConfig.infrastructureLogging = { appendOnly: false, colors: true }
	clientWebpackConfig.plugins.push(new ReactRefreshWebpackPlugin({ overlay: false }))

	clientWebpackConfig.plugins.push(
		new I18NextHMRPlugin({ localesDir: resolve(__dirname, '../../public/locales') }),
	)

	clientWebpackConfig.devServer.client.overlay = {
		errors: true,
		warnings: true,
		runtimeErrors: (error) => {
			if (error.message === 'ResizeObserver loop completed with undelivered notifications.') {
				return false
			}

			return true
		},
	}
}

module.exports = webpackConfig(developmentEnvOnly)
