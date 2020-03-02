/* eslint-disable */
const path = require('path')
const glob = require('glob')
const merge = require('webpack-merge')
const htmlWebpackPlugin = require('html-webpack-plugin')
const SpritesmithPlugin = require('webpack-spritesmith')
const config = require('./config')
const devMode = process.env.NODE_ENV !== 'production'
/**
 * 多入口配置
 */
function getDevEntries(){
  // src/pages下的所有js入口文件
  let files = glob.sync(config.path.pages + `/**/index.${config.ext.js}`, {
    cwd: path.resolve(__dirname)
  })
  let entries = {},
      htmlPlugins = [];
  files = files.filter(function (file) {
    let hasAssets = file.includes(`/${config.exclude.assets}/`)
    if ( config.dev.includeDir.length > 0 ){
      let hasInclude = config.dev.includeDir.some(dir=>{
        return new RegExp(`/${dir}/`).test(file)
      })
      // 返回非assets目录和匹配include目录
      return !hasAssets && hasInclude
    }else{
      // 返回非assets目录
      return !hasAssets
    }
  })
  files.forEach(function (_file) {
    let file = path.parse(_file)
    let curDir = file.dir.replace(config.path.pages + '/', '')
    // 添加js入口
    let entryKey = curDir + '/index'
    entries[entryKey] = _file
    // 添加html
    let cfg = {
      template: glob.sync(file.dir + `/index.${config.ext.html}`, {
        cwd: path.resolve(__dirname)
      })[0],
      filename: curDir + '.html',
      inject: config.htmlPlugin.inject,
      chunks: ['commons', 'vendor', 'manifest', entryKey]
    }
    htmlPlugins.push(new htmlWebpackPlugin(cfg))
  })
  return {
    entries,
    htmlPlugins
  }
}
function getEntries(){
  // src/pages下的所有html入口文件
  let htmls = glob.sync(config.path.pages + `/**/*.${config.ext.html}`, {
    cwd: path.resolve(__dirname)
  })
  let entries = {},
      htmlPlugins = [],
      commonEntries = {}
  // src/common/ 下的所有公共css/js文件
  let commonfiles = glob.sync(config.path.common + `/{css,js}/*.${config.ext.cssjs}`, {
    cwd: path.resolve(__dirname)
  })
  commonfiles.forEach(function (_file) {
    let file = path.parse(_file)
    let key = 'common/' + file.name
    if (file.ext !== '.js') {
      key += '.css'
    }
    commonEntries[key] = _file
  })
  htmls = htmls.filter(function (html) {
    let hasAssets = html.includes(`/${config.exclude.assets}/`)
    if ( config.build.includeDir.length > 0 ){
      let hasInclude = config.build.includeDir.some(dir=>{
        return new RegExp(`/${dir}/`).test(html)
      })
      // 返回非assets目录和匹配include目录
      return !hasAssets && hasInclude
    }else{
      // 返回非assets目录
      return !hasAssets
    }
  })

  htmls.forEach(function (_html) {
    let html = path.parse(_html)
    let curDir = html.dir.replace(config.path.pages + '/', '')
    let chunks = []
    // 查找当前html目录下所有css/js文件
    let files = glob.sync(html.dir + `/*.${config.ext.cssjs}`, {
      cwd: path.resolve(__dirname)
    })
    files.forEach(function (_file) {
      let file = path.parse(_file)
      let key = file.dir.replace(config.path.pages + '/', '') + '/' + file.name
      if (file.ext !== '.js') {
        key += '.css'
      }
      entries[key] = _file
      chunks.push(key)
    })
    let cfg = {
      template: _html,
      filename: curDir + '.html',
      //hash: true, //开启hash  ?[hash]
      chunks: Object.keys(commonEntries).concat(chunks),
      inject: false
    }
    if (config.htmlPlugin.minify) {
      cfg = merge(cfg, {
        minify: config.htmlPlugin.minify_option
      })
    }
    htmlPlugins.push(new htmlWebpackPlugin(cfg))
  })
  return {
    entries: merge(entries,commonEntries),
    htmlPlugins
  }
}
function getDevEntriesTest() {
  // src/pages下的所有js/css入口文件
  let files = glob.sync(config.path.pages + `/**/index.${config.ext.js}`, {
    cwd: path.resolve(__dirname)
  })
  let entries = {}
  files.filter(function (_file) {
    return _file.indexOf(config.exclude.dir) < 0
  }).forEach(function (_file) {
    let file = path.parse(_file)
    let key = file.dir.replace(config.path.pages + '/', '') + '/' + file.name
    if (file.ext !== '.js') {
      key += '.css'
    }
    entries[key] = _file
  })
  return entries
}

function getEntriesTest() {
  // src/pages下的所有js/css入口文件
  let files = glob.sync(config.path.pages + `/**/*.${config.ext.cssjs}`, {
    cwd: path.resolve(__dirname)
  })
  let entries = {}
  files.filter(function (_file) {
    return _file.indexOf(config.exclude.dir) < 0
  }).forEach(function (_file) {
    let file = path.parse(_file)
    let key = file.dir.replace(config.path.pages + '/', '') + '/' + file.name
    if (file.ext !== '.js') {
      key += '.css'
    }
    entries[key] = _file
  })
  // src/common/ 下的所有公共css/js文件
  let commonfiles = glob.sync(config.path.common + `/{css,js}/*.${config.ext.cssjs}`, {
    cwd: path.resolve(__dirname)
  })

  commonfiles.forEach(function (_file) {
    let file = path.parse(_file)
    let key = 'common/' + file.name
    if (file.ext !== '.js') {
      key += '.css'
    }
    entries[key] = _file
  })
  return entries
}
/**
 * 多页面配置
 */
function getDevHtmlPlugins() {
  let htmls = glob.sync(config.path.pages + `/**/*.${config.ext.html}`, {
    cwd: path.resolve(__dirname)
  })
  let htmlPlugins = []
  htmls.filter(function (_file) {
    return _file.indexOf(config.exclude.dir) < 0
  }).forEach(function (_file) {
    let file = path.parse(_file)
    let cfg = {
      template: _file,
      filename: file.dir.replace(config.path.pages + '/', '') + '.html',
      inject: true,
      chunks: [file.dir.replace(config.path.pages + '/', '') + '/index'] 
    }
    htmlPlugins.push(new htmlWebpackPlugin(cfg))
  })
  return htmlPlugins
}

function getHtmlPlugins() {
  let htmls = glob.sync(config.path.pages + `/**/*.${config.ext.html}`, {
    cwd: path.resolve(__dirname)
  })
  let htmlPlugins = []
  htmls.filter(function (_file) {
    return _file.indexOf(config.exclude.dir) < 0
  }).forEach(function (_file) {
    let file = path.parse(_file)
    let chunks = []
    // 查找当前html目录下所有css/js文件
    let files = glob.sync(file.dir + `/*.${config.ext.cssjs}`, {
      cwd: path.resolve(__dirname)
    })
    files.forEach(function (_file) {
      let file = path.parse(_file)
      let key = file.dir.replace(config.path.pages + '/', '') + '/' + file.name
      if (file.ext !== '.js') {
        key += '.css'
      }
      chunks.push(key)
    })

    // src/common/ 下的所有公共css/js文件
    let commons = []
    let commonfiles = glob.sync(config.path.common + `/{css,js}/*.${config.ext.cssjs}`, {
      cwd: path.resolve(__dirname)
    })

    commonfiles.forEach(function (_file) {
      let file = path.parse(_file)
      let key = 'common/' + file.name
      if (file.ext !== '.js') {
        key += '.css'
      }
      commons.push(key)
    })
    let cfg = {
      template: _file,
      filename: file.dir.replace(config.path.pages + '/', '') + '.html',
      //hash: true, //开启hash  ?[hash]
      chunks: commons.concat(chunks),
      inject: false
    }
    if (config.htmlPlugin.minify) {
      cfg = merge(cfg, {
        minify: {
          removeComments: true, //移除HTML中的注释
          collapseWhitespace: true, //折叠空白区域 也就是压缩代码
          removeAttributeQuotes: true, //去除属性引用
        }
      })
    }
    htmlPlugins.push(new htmlWebpackPlugin(cfg))
  })
  return htmlPlugins
}

/**
 * 多sprite自动生成
 */
function getSpritePlugins() {
  let dirs = glob.sync(config.path.sprite + `/*/`, {
    cwd: path.resolve(__dirname)
  })
  let sprites = []
  dirs.forEach(function (dir) {
    let name = dir.replace(config.path.sprite,'').replace(/\//g,'')
    sprites.push(
      new SpritesmithPlugin({
        src: {
          cwd: path.resolve(__dirname, dir + '/'),
          glob: '*.png'
        },
        target: {
          image: path.resolve(__dirname, `${config.path.img}/_sprite/${name}.sprite.png`),
          css: path.resolve(__dirname, `${config.path.css}/_import/_sprite/${name}.sprite.scss`)
        },
        apiOptions: {
          cssImageRef: `~img/_sprite/${name}.sprite.png`
        },
        spritesmithOptions: {
          algorithm: 'top-down'
        }
      })
    )
  })
  return sprites
}

module.exports = {
  getDevEntries,
  getEntries,
  getSpritePlugins
}