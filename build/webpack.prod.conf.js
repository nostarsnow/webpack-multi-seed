/* eslint-disable */
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
// 清除目录等
const cleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const CssEntryPlugin = require('./plugins/CssEntryPlugin')
const HtmlEntryInject = require('./plugins/HtmlEntryInject')
const webpackConfigBase = require('./webpack.base.conf')
const utils = require('./utils')
const config = require('./config')
const entries = utils.getEntries()
if ( config.build.includeDir.length > 0 ){
  console.log(`你选择编译的文件夹名为：${config.build.includeDir}`)
}
const webpackConfigProd = {
  mode: 'production', // 通过 mode 声明生产环境
  entry: entries.entries,
  output: {
    path: path.resolve(__dirname, config.path.dist),
    publicPath: config.build.assetsPublicPath,
    filename: config.build.hash ? 'js/[name].[chunkhash:7].js' : 'js/[name].js',
    filename(chunkData){
      let hash = config.build.hash ? '.[chunkhash:7]' : ''
      let name = chunkData.chunk.name
      let dir = path.dirname(name)
      let filename = path.basename(name)
      if ( dir === 'common' ){
        return `common/js/${filename}${hash}.js`;
      }
      return `pages/${dir}/js/${filename}${hash}.js`
    }
    //chunkFilename: config.build.hash ? 'js/[name].[chunkhash:7].js' : 'js/[name].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        /*styles: {
          name: 'common',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },*/

        /*// 复用的文件，单独抽离 后续再优化此配置
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
        }*/
      }
    },
    /**
     * 提取 webpack 运行时代码
     * optimization.runtimeChunk 直接置为 true 或设置 name
     * webpack会添加一个只包含运行时(runtime)额外代码块到每一个入口
     * 注：这个需要看场景使用，会导致每个入口都加载多一份运行时代码
     * manifest js have already inline to every html file, please run build and see it in html.
     * Maybe we don't need manifest file, because we are a multi-page application. each html page's js maybe not complex.
     * So it depending on how you understand your js file complex or simple.
     */
    /*runtimeChunk: {
      name: 'manifest'
    },*/
    // 样式优化
    minimizer: [
    ].concat(
      config.build.uglify ? [new UglifyJsPlugin({
        uglifyOptions: config.uglifyjs
      })] : [],
    ).concat(
      config.build.cssmin ? [new OptimizeCSSAssetsPlugin({})] : [],
    )
  },
  plugins: [
    // 删除dist目录
    new cleanWebpackPlugin(['dist'],{
      root: path.resolve(__dirname, '../'),
      // verbose Write logs to console.
      verbose: true, // 开启在控制台输出信息
      // dry Use boolean 'true' to test/emulate delete. (will not remove files).
      // Default: false - remove files
      dry: false
    }),
    // 根据模块的相对路径生成一个四位数的hash作为模块id
    new webpack.HashedModuleIdsPlugin(),
    new CssEntryPlugin(),
    // 压缩抽离样式
    new MiniCssExtractPlugin({
      //filename: config.build.hash ? 'css/[name].[chunkhash:7].css' : 'css/[name].css',
      moduleFilename({name}){
        let hash = config.build.hash ? '.[chunkhash:7]' : ''
        let dir = path.dirname(name)
        let filename = path.basename(name).replace('.css','')
        if ( dir === 'common' ){
          return `common/css/${filename}${hash}.css`;
        }
        return `pages/${dir}/css/${filename}${hash}.css`
      }
      //chunkFilename: config.build.hash ? 'css/[name].[chunkhash:7].css' : 'css/[name].css'
    }),
    // html输出
    ...entries.htmlPlugins,
    new HtmlEntryInject(),
    new HtmlReplaceWebpackPlugin(config.htmlReplace),
    ...utils.getSpritePlugins(),
  ].concat((config.build.htmlMinify || !config.build.htmlBeautify) ? [] : [new HtmlBeautifyPlugin(config.htmlPlugin.beautify_option)]),
  module: {
  }

}
// 分析依赖图 npm run build --report
if (process.env.npm_config_report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfigProd.plugins.push(new BundleAnalyzerPlugin())
}
//console.log(webpackConfigProd.entry)
module.exports = merge(webpackConfigBase, webpackConfigProd)