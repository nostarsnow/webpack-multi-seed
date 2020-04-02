/* eslint-disable */
const src = '../src'
const dist = '../dist'
const env = process.env.NODE_ENV || 'development'
const https = require('https')
let path = {
  build: './build',
  src: src,
  pages: src + '/pages',
  common: src + '/common',
  plugins: src + '/common/plugins',
  js: src + '/common/js',
  css: src + '/common/css',
  tpls: src + '/common/tpls',
  static: src + '/static',
  img: src + '/common/img',
  sprite: src + '/common/img/_sprite',
  dist,
}
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: path.dist,
    assetsPublicPath: '/',
    // 默认端口
    port: 8888,
    eslint: true,
    includeDir: [],
    hash: true,
    /**
     * https://webpack.docschina.org/configuration/dev-server/#devserver-proxy
     * 开发环境跨域配置, 默认关闭, 配置如下
     * 请求到 /api/users 现在会被代理到请求 http://localhost:3000/api/users
     * pathRewrite重写路径
     * 如果是https请求需要添加agent : https.globalAgent
     */
    /*proxyTable: {
      '/api': {
        target: 'https://zuhaowan.zuhaowan.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        agent : https.globalAgent 
      },
      }
    },*/
    proxyTable: {
      '/zuhaowan': {
        target: 'https://www.zuhaowan.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/zuhaowan': '',
        },
        agent: https.globalAgent,
      },
    },
  },
  build: {
    assetsRoot: path.dist,
    assetsSubDirectory: path.dist,
    assetsPublicPath: '/',
    bundleAnalyzerReport: process.env.npm_config_report,
    hash: false,
    uglify: true,
    cssmin: true,
    htmlMinify: false,
    htmlBeautify: true,
    includeDir: [],
  },
  globals: {
    __DEV__: env === 'development',
    __PROD__: env === 'production',
    __TEST__: env === 'test',
  },
  htmlReplace: [
    {
      pattern: '__VERSION__',
      replacement: '3.0',
    },
    {
      pattern: '__CDN__',
      replacement: '//zuhaowan.zuhaowan.com',
    },
    {
      pattern: '__ICONURL__',
      replacement: '//zuhaowan.zuhaowan.com/v1/images/favicon.ico',
    },
  ],
  htmlPlugin: {
    inject: 'body',
    minify_option: {
      removeComments: true, //移除HTML中的注释
      collapseWhitespace: true, //折叠空白区域 也就是压缩代码
      removeAttributeQuotes: true, //去除属性引用
    },
    beautify_option: {
      config: {
        html: {
          end_with_newline: true,
          indent_size: 4,
          indent_with_tabs: true,
          indent_inner_html: true,
          preserve_newlines: true,
          unformatted: ["p", "i", "b", "span"]
        }
      },
      replace: [' type="text/javascript"']
    }
  },
  htmlInject: {
    // <!-- inject:common/common.scss -->
    patternString: /(<!--\s*|@@)inject:([\w-\/\.]+)(\s*-->)?/g,
    // <!-- inject:<link rel="stylesheet" href="common/common.scss" /> -->
    patternLink: /(<!--\s*|@@)inject:<link[^>]*href="?([\w-\/\.]+)"?[^>]*>\s*\/?>(\s*-->)?/g,
    // <!-- inject:<script type="text/javascript" src="common/common.scss" ></script> -->
    patternScript: /(<!--\s*|@@)inject:<script[^>]*src="?([\w-\/\.]+)"?[^>]*>\s*<\/script>(\s*-->)?/g,
  },
  path: path,
  exclude: {
    assets: '_assets',
  },
  ext: {
    meta: '{txt,ico}',
    resource: '{css,js}',
    html: '{html,ejs}',
    css: '{css,less,sass,scss}',
    img: '{png,jpeg,jpg,gif,svg}',
    js: 'js',
    cssjs: '{css,less,sass,scss,js}',
    assets: '{png,jpeg,jpg,gif,svg,mp3,mp4,ogg,eot,woff,woff2,ttf}',
  },
  autoprefixer: {
    overrideBrowserslist: [
      '> 1%',
      'Firefox >= 10',
      'ie >= 9',
      'iOS >= 4',
      'Chrome >= 10',
    ],
  },
  uglifyjs: {
    minify: true,
    mangle: true,
    cache: false,
    parallel: true,
    compress: {
      drop_console: false,
    },
  },
  stylelint: {
    enable: true,
    options: {
      reporters: [
        {
          formatter: 'string',
          console: true,
        },
      ],
    },
  },
  eslint: {
    enable: true,
    options: {},
    formatter: {},
  },
}
