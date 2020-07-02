const webpack = require('webpack')
const baseConfig = require('./webpack.base.conf')
const buildConfig = require('./webpack.prod.conf')

webpack(buildConfig, async (err, stats) => {
  if (err) {
    return console.log(err)
  }
  console.log(stats.toString(baseConfig.stats))
  require('./plugins/makeSourcemap')
})
