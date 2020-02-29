/* eslint-disable */
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackConfigBase = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const utils = require('./utils')
const config = require('./config')
const entries = utils.getDevEntries()

if ( config.dev.includeDir.length > 0 ){
  console.log(`你选择编译的文件夹名为：${config.dev.includeDir}`)
}
const webpackConfigDev = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: entries.entries,
  watch: true,
  output: {
    //path: path.resolve(__dirname, config.path.dist),
    publicPath: config.dev.assetsPublicPath,
    filename: '[name].js',
    //chunkFilename: 'js/[name].[chunkhash:7].js',
  },
  devServer: {
    contentBase: path.join(__dirname, config.path.dist),
    publicPath: '/',
    port: config.dev.port,
    //noInfo: true,
    compress: true,
    overlay: true, // 浏览器页面上显示错误
    open: true, // 开启浏览器
    // stats: 'errors-only', //stats: 'errors-only'表示只打印错误：
    hot: true, // 开启热更新
    inline: true,
    // 开启调试, 可在移动端等同wifi环境下 ip访问
    disableHostCheck: true,
    host: '0.0.0.0',
    public:'127.0.0.1:' + config.dev.port,
    headers: { 'Access-Control-Allow-Origin': '*' },
    // 跨域配置
    proxy: config.dev.proxyTable,
    before(app, server, compiler) {
      compiler.hooks.done.tapAsync('__ReloadHtml__', (compilation, callback) => {
        const changedFiles = Object.keys(compiler.watchFileSystem.watcher.mtimes);
        if (
          this.hot &&
          changedFiles.some(filePath => config.ext.html.includes(path.parse(filePath).ext.substring(1)))
        ) {
          server.sockWrite(server.sockets, 'content-changed');
        }
        callback()
      })
    }
  },
  // 注册loader
  resolveLoader: {
    modules: ['node_modules', './loaders/']
  },
  plugins: [
    // 热更新
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    /*new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css'
    }),*/
    // html输出
    ...entries.htmlPlugins,
    new HtmlReplaceWebpackPlugin(config.htmlReplace),
    ...utils.getSpritePlugins(),
  ],
  /*optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'common-css',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
        // 复用的文件，单独抽离 后续再优化此配置
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
          minSize: 1,
          priority: 0
        },
        // 提取 node_modules 中代码
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 10
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    },
  },*/
  module: {
  }
}
module.exports = merge(webpackConfigBase, webpackConfigDev)