/* eslint-disable */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const loaderUtils = require('loader-utils');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});

const devMode = process.env.NODE_ENV !== 'production';
const config = require('./config');
const path = require('path');
const rules = [
  //暴露$和jQuery到全局
  /*{
    test: require.resolve('../src/common/plugins/jquery/jquery-1.11.1.js'), //require.resolve 用来获取模块的绝对路径
    use: [
      {
        loader: 'expose-loader',
        options: 'jQuery'
      },
      {
        loader: 'expose-loader',
        options: '$'
      }
    ]
  },*/
  {
    test: /\.(css|scss|sass)$/,
    include: [path.resolve(__dirname, config.path.src)],
    exclude: [/node_modules/, path.resolve(__dirname, config.path.plugins)],
    use: [
      devMode
        ? {
            loader: 'style-loader'
          }
        : {
            loader: MiniCssExtractPlugin.loader
          },
      {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins: [require('autoprefixer')(config.autoprefixer)]
        }
      },
      {
        loader: 'resolve-url-loader',
        options: {
          removeCR: true
        }
      },
      {
        loader: 'sass-loader',
        options: {
          data: `@import "config";`,
          sourceMap: true,
        }
      }
    ]
  },
  {
    test: /\.js$/,
    exclude: [/node_modules/, /plugins/],
    loader: 'happypack/loader?id=babel',
  },
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 3 * 1024,
          fallback: 'file-loader',
          // name: 'img/[name].[hash:7].[ext]',
          name(file) {
            return parseFile(file, 'img');
          }
        }
      }
    ]
  },
  {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 3 * 1024,
          fallback: 'file-loader',
          //name: 'medias/[name].[hash:7].[ext]',
          name(file) {
            return parseFile(file, 'medias');
          }
        }
      }
    ]
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 5 * 1024,
          fallback: 'file-loader',
          //name: 'fonts/[name].[hash:7].[ext]',
          name(file) {
            return parseFile(file, 'fonts');
          }
        }
      }
    ]
  },
  /*{
    test: /\.(html)$/,
    loader: 'happypack/loader?id=html'
  },*/
  {
    test: /\.(ejs|html)$/,
    include: [path.resolve(__dirname, config.path.src)],
    loader: 'happypack/loader?id=ejs'
  },
  {
    test: /\.htm$/,
    include: [path.resolve(__dirname, config.path.src)],
    loader: 'happypack/loader?id=ejsnotattr'
  },
  /*{
    test: /\.swig$/,
    include: [path.resolve(__dirname, config.path.src)],
    loader: 'happypack/loader?id=swig'
  },*/
  {
    test: /\.less$/,
    include: [path.resolve(__dirname, config.path.src)],
    loader: 'happypack/loader?id=less'
  }
];
if (config.dev.eslint) {
  rules.unshift({
    test: /\.js$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [path.resolve(__dirname, config.path.pages)],
    options: {
      formatter: require('eslint-friendly-formatter')
    }
  });
}
const plugins = [
  new HappyPack({
    id: 'babel',
    loaders: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env']
        }
      }
    ].concat(devMode ? ['inject-loader'] : []),
    threadPool: happyThreadPool,
    // cache: true,
    verbose: false
  }),
  /*new HappyPack({
    id: 'scss',
    loaders: [
      devMode ? {
        loader: 'style-loader',
        options: {
          sourceMap: true
        }
      } : MiniCssExtractPlugin.loader,
      // MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: [
            require('autoprefixer')(config.autoprefixer)
          ],
          sourceMap: true
        }
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }
    ],
    threadPool: happyThreadPool,
    // cache: true,
    verbose: false
  }),*/
  new HappyPack({
    id: 'less',
    loaders: [
      devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: [require('autoprefixer')(config.autoprefixer)],
          sourceMap: true
        }
      },
      {
        loader: 'less-loader',
        options: {
          sourceMap: true
        }
      }
    ],
    threadPool: happyThreadPool,
    // cache: true,
    verbose: false
  }),
  /*new HappyPack({
    id: 'html',
    loaders: [
      {
        loader: 'html-loader',
        options: {
          interpolate: true,
          attrs: [':src', ':href', ':data-src']
        }
      },
    ],
    threadPool: happyThreadPool,
    // cache: true,
    verbose: false
  }),*/
  new HappyPack({
    id: 'ejs',
    loaders: [
      {
        loader: 'underscore-template-loader',
        options: {
          //prependFilenameComment: __dirname,
          attributes: ['img:src', 'img:data-src']
        }
      }
    ],
    threadPool: happyThreadPool,
    // cache: true,
    verbose: false
  }),
  new HappyPack({
    id: 'ejsnotattr',
    loaders: [
      {
        loader: 'underscore-template-loader',
        options: {
          //prependFilenameComment: __dirname,
          attributes: []
        }
      }
    ],
    threadPool: happyThreadPool,
    // cache: true,
    verbose: false
  })
  /*new HappyPack({
    id: 'swig',
    loaders: ['swig-loader'],
    threadPool: happyThreadPool,
    // cache: true,
    verbose: false
  }),*/
];
function parseFile(file, type) {
  let filePath = path.relative(__dirname, file);
  let relative = JSON.parse(loaderUtils.stringifyRequest(this, filePath));
  let parse = path.parse(relative);
  if (parse.dir.includes(config.path.img)) {
    let dir = parse.dir.replace(config.path.img, '');
    if (dir === '') {
      return `common/${type}/[name].[hash:7].[ext]`;
    } else {
      return `common/${type}${dir}/[name].[hash:7].[ext]`;
    }
  }
  if (parse.dir.includes(config.path.pages)) {
    let dir = parse.dir.replace(`${config.path.pages}/`, '');
    let page = dir.substring(0, dir.indexOf(`/${config.exclude.assets}`));
    let asset = dir
      .replace(`${page}`, '')
      .replace(new RegExp(`\\/${config.exclude.assets}\\/${type}\\/`), '')
      .replace(new RegExp(`\\/${config.exclude.assets}\\/`), '');
    return `pages/${page}/${type}/${asset}/[name].[hash:7].[ext]`;
  }
  return `common/${type}/[name].[hash:7].[ext]`;
}
module.exports = {
  rules,
  plugins
};
