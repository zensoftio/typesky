const Webpack = require('webpack');
const Path = require('path');

// variables
const isProduction = process.argv.indexOf('-p') >= 0;
const sourcePath = Path.join(__dirname, './src');
const outPath = Path.join(__dirname, './dist');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: sourcePath,
  entry: {
    main: './index.tsx',
    vendor: [
      'react',
      'react-dom',
    ]
  },
  output: {
    path: outPath,
    filename: 'bundle.js',
    publicPath: '/',
    chunkFilename: '[name].bundle.js'
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main']
  },
  module: {
    loaders: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: isProduction
          ? 'awesome-typescript-loader?module=es6'
          : [
            'react-hot-loader/webpack',
            'awesome-typescript-loader'
          ]
      },
      // css
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: !isProduction,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]'
              }
            },
          ]
        })
      },
      {
        test: /\.scss$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          require.resolve('sass-loader')
        ],
      },
      // static assets
      {test: /\.(html|json)$/, use: 'html-loader'},
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 25000,
            name: "[path][name].[hash].[ext]",
          },
        },
      },
    ],
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': isProduction === true ? JSON.stringify('production') : JSON.stringify('development')
    }),

    new Webpack.LoaderOptionsPlugin({
      options: {
        context: sourcePath
      }
    }),
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity
    }),
    new Webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin({
      filename: 'styles.css',
      disable: !isProduction
    }),
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],
  devServer: {
    contentBase: sourcePath,
    historyApiFallback: true,
    hot: true,
    stats: {
      warnings: false
    },
  },
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty'
  }
};
