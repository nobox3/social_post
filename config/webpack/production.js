const webpackConfig = require('./webpackConfig')
const { addEntry } = require('./webpackEntry')

const productionEnvOnly = (clientWebpackConfig) => {
	addEntry('packs/app', clientWebpackConfig.entry)
}

module.exports = webpackConfig(productionEnvOnly)
