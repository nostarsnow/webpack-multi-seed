/* eslint-disable */
const RE_CSS = /\.css$/i;
const RE_NAME = /\[name\]/gi;
const RE_JS_MAP = /\.js(|\.map)$/i;
module.exports = class CssEntryPlugin {
  apply (compiler) {
    compiler.hooks.compilation.tap('CssEntryPlugin', (compilation) => {
      compilation.mainTemplate.hooks.renderManifest.tap('CssEntryPlugin', (result) => {
        for (const file of result) {
          const { filenameTemplate, pathOptions } = file;
          const { chunk } = pathOptions || {};
          const name = chunk && (chunk.name || chunk.id);
          if (RE_CSS.test(name) && typeof filenameTemplate === 'string') {
            const rename = name.replace(RE_CSS, '');
            file.filenameTemplate = filenameTemplate.replace(RE_NAME, rename);
          }
        }
        return result;
      });
    });
    compiler.hooks.emit.tapAsync('CssEntryPlugin', (compilation, callback) => {
      
      compilation.chunks.filter(chunk => {
        return RE_CSS.test(chunk.name);
      }).forEach(chunk => {
        // remove unused js files
        chunk.files.forEach(file => {
          if (RE_JS_MAP.test(file)) {
            let _chunk = compilation.entrypoints.get(chunk.name).chunks.find(v=>v.name === chunk.name)
            _chunk.files = _chunk.files.filter(v=>!RE_JS_MAP.test(v))
            delete compilation.assets[file];
          }
        });
      });
      callback();
    });
  }
}