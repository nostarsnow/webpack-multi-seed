/* eslint-disable */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const loaderUtils = require('loader-utils')
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});

const devMode = process.env.NODE_ENV !== 'production'
const config = require('./config')
const path = require('path')
const rules = [{
    test: /\.(css|scss|sass)$/,
    include: [path.resolve(__dirname, config.path.src)],
    exclude: /node_modules/,
    use: [
      devMode ? {
        loader: 'style-loader',
      } : MiniCssExtractPlugin.loader,
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
          plugins: [
            require('autoprefixer')(config.autoprefixer)
          ]
        }
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }
    ]
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'happypack/loader?id=babel'
  }, {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    use: [{
      loader: "url-loader",
      options: {
        limit: 5 * 1024,
        fallback: 'file-loader',
        // name: 'img/[name].[hash:7].[ext]',
        name(file) {
          let filePath = path.relative(__dirname, file)
          let relative = JSON.parse(loaderUtils.stringifyRequest(this, filePath))
          let parse = path.parse(relative)
          if (parse.dir.includes(config.path.img)) {
            let dir = parse.dir.replace(config.path.img, '')
            if (dir === '') {
              return 'img/[name].[hash:7].[ext]'
            } else {
              return `img${dir}/[name].[hash:7].[ext]`
            }
          }
          if (parse.dir.includes(config.path.pages)) {
            let dir = parse.dir
              .replace(config.path.pages, '')
              .replace(new RegExp(`\\/${config.exclude.assets}\\/img`), '')
              .replace(new RegExp(`\\/${config.exclude.assets}`), '');
            return `img${dir}/[name].[hash:7].[ext]`
          }
          return 'img/[name].[hash:7].[ext]';
        }
      }
    }]
  },
  {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    use: [{
      loader: "url-loader",
      options: {
        limit: 5 * 1024,
        fallback: 'file-loader',
        name: 'medias/[name].[hash:7].[ext]'
      }
    }]
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    use: [{
      loader: "url-loader",
      options: {
        limit: 5 * 1024,
        fallback: 'file-loader',
        name: 'fonts/[name].[hash:7].[ext]'
      }
    }]
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
  })
}
const plugins = [
  new HappyPack({
    id: 'babel',
    loaders: [{
      loader: 'babel-loader',
      options: {
        presets: ['@babel/env'],
      }
    }, ].concat(devMode ? ['inject-loader'] : []),
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
          plugins: [
            require('autoprefixer')(config.autoprefixer)
          ],
          sourceMap: true,
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
    loaders: [{
      loader: 'underscore-template-loader',
      options: {
        prependFilenameComment: __dirname,
        attributes: ['img:src', 'img:data-src']
      }
    }, ],
    threadPool: happyThreadPool,
    // cache: true,
    verbose: false
  }),
  /*new HappyPack({
    id: 'swig',
    loaders: ['swig-loader'],
    threadPool: happyThreadPool,
    // cache: true,
    verbose: false
  }),*/
]
module.exports = {
  rules,
  plugins
};