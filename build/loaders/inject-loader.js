/* eslint-disable */
const loaderUtils = require('loader-utils')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const utils = require('../utils')
const config = require('../config')

module.exports = function(source) {
  //const options = utils.getOptions(this) || {}
  let entries = Object.values(utils.getDevEntries().entries);
  // = /build
  let buildPath = path.resolve(config.path.build)
  // = ..\src\entry.js
  let entryPath = path.relative(buildPath, this.resource)
  // = "../src/entry.js" -> ../src/entry.js
  entryPath = JSON.parse(loaderUtils.stringifyRequest(this, entryPath))
  // entryPath = entryPath.substring(1,entryPath.length-1)
  // 检测是否为entey文件
  let isEntry = entries.some(v=>v === entryPath)

  // 非则返回
  if ( !isEntry ){
    return source
  }
  /*return `
  import 'common/css/common.scss'
import './index.scss'
import 'common/js/common.js'
import './index.js'
  ` + source*/
  // 如是。则获取目录下html文件
  let htmlPath = glob.sync(path.dirname(entryPath) + `/index.${config.ext.html}`, {
    cwd: buildPath
  })[0]
  let html = fs.readFileSync(buildPath + '/' + htmlPath).toString()
  let patternString = config.htmlInject.patternString
  let match, imports = []
  while ((match = patternString.exec(html)) !== null) {
    let name = match[2]
    if ( name === 'index.js' ){
      continue;
    }
    if ( /^common\//.test(name) ){
      if ( /\.js$/.test(name) ){
        name = name.replace(/^common\//, 'common/js/')
      }
      if ( /\.(css|scss|sass|less)$/.test(name) ){
        name = name.replace(/^common\//, 'common/css/')
      }
    }else {
      if ( name.indexOf('./') === -1 ){
        name = './' + name
      }
    }
    imports.push(
      `import '${name}'\n`
    )
  }
  return imports.join('') + source
  // 返回处理后的结果，相当于是打包拦截器
}