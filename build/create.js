/* eslint-disable */
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const config = require('./config')
const baseDir = path.join(__dirname, config.path.pages + '/')
let pages = process.argv.slice(2)
pages = pages.join('')
if (pages == '' || pages == null || pages == undefined) {
  console.log('请输入页面名称')
  return
}
let hasPage = fs.existsSync(baseDir + pages)
if (hasPage == true) {
  console.log('该页面已经存在')
  return
}
try {
  mkdirp.sync(baseDir + pages)
  console.log(pages + '目录创建成功')
} catch (error) {
  console.log(pages + '目录创建失败', error)
}

try {
  mkdirp.sync(baseDir + pages + '/' + config.exclude.assets)
  console.log(pages + '/' + config.exclude.assets + '目录创建成功')
} catch (error) {
  console.log(pages + '/' + config.exclude.assets + '目录创建失败', error)
}
try {
  mkdirp.sync(baseDir + pages + '/' + config.exclude.assets + '/img')
} catch (error) {}
try {
  mkdirp.sync(baseDir + pages + '/' + config.exclude.assets + '/css')
} catch (error) {}
try {
  mkdirp.sync(baseDir + pages + '/' + config.exclude.assets + '/js')
} catch (error) {}
try {
  mkdirp.sync(baseDir + pages + '/' + config.exclude.assets + '/tpls')
} catch (error) {}

try {
  fs.writeFileSync(
    baseDir + pages + '/index.html',
    `
  <!-- inject:./index.scss -->
  <!-- inject:./index.js -->
  `
  )
  console.log(pages + '/index.html创建成功')
} catch (error) {
  console.log(pages + '/index.html创建失败')
}
try {
  fs.writeFileSync(baseDir + pages + '/index.js', ``)
  console.log(pages + '/index.js创建成功')
} catch (error) {
  console.log(pages + '/index.js创建失败')
}

try {
  fs.writeFileSync(baseDir + pages + '/index.scss')
  console.log(pages + '/index.scss创建成功')
} catch (error) {
  console.log(pages + '/index.scss创建失败')
}
