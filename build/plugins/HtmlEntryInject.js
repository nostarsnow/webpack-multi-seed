/* eslint-disable */
const config = require('../config')
module.exports = class HtmlEntryInject {
  apply (compiler) {
    compiler.hooks.compilation.tap('HtmlEntryInject', (compilation) => {
      if (compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing) {
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('HtmlReplaceWebpackPlugin', (compilation, callback) => {
          let patternString = config.htmlInject.patternString
          let html = compilation.html
          let name = compilation.outputName
          let dir = name.replace(/\.html/, '')
          let chunks = compilation.assets.chunks
          compilation.html = html.replace(
            patternString,
            function(match, $1, entry, $3, index, input){
              if ( !/^common\//.test(entry) ){
                if ( entry.indexOf('./') === -1 ){
                  entry = dir + '/' + entry
                }else{
                  entry = entry.replace('./', dir + '/')
                }
              }
              if ( /\.js$/.test(entry) ){
                let chunk = chunks[entry.replace(/\.js$/,'')]

                return `<script type="text/javascript" src="${chunk.entry}"></script>`
              }
              if ( /\.(css|scss|sass|less)$/.test(entry) ){
                let chunk = chunks[entry.replace(/\.(css|scss|sass|less)$/,'.css')]
                return `<link rel="stylesheet" href="${chunk.css[0]}" />`
              }
            }
          )
          callback();
        });
      }
    })
  }
}