const webpackConfig = require('./webpackConfig')
const { addEntry } = require('./webpackEntry')

const testOnly = (clientWebpackConfig) => {
	addEntry('packs/app', clientWebpackConfig.entry)
}

module.exports = webpackConfig(testOnly)
