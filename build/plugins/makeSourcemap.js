const path = require('path')
const fs = require('fs')
const glob = require('glob')
const config = require('../config')
if (
  config.build.sourceMap &&
  !config.optimizeCSS.cssProcessorOptions.map.annotation &&
  !config.sourceMap.append
) {
  let maps = glob.sync('../' + config.path.dist + `/**/*.map`, {
    cwd: path.resolve(__dirname),
  })
  maps.forEach(_map => {
    let map = path.parse(_map)
    fs.readFile(
      path.resolve(__dirname, `${map.dir}/${map.name}`),
      (err, data) => {
        if (err) {
          console.log(err)
          return false
        }
        let type = /\.js$/.test(map.name) ? '.js' : '.css'
        let source =
          type === '.js'
            ? `\n//# sourceMappingURL=${map.base}`
            : `\n/*# sourceMappingURL=${map.base} */`
        fs.writeFileSync(
          path.resolve(
            __dirname,
            `${map.dir}/${map.name.replace(type, '.') + 'ws' + type}`
          ),
          data.toString() + source,
          'utf8'
        )
      }
    )
  })
  console.log('\n生成sourcemap注释文件成功！')
}else{
  console.log('\n无需生成sourcemap注释文件！')
}
