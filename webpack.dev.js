const Path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const sourcePath = Path.join(__dirname, './src');
const outPath = Path.join(__dirname, './build');

const mode = 'development';
const entry = './src/index.tsx';
const resolve = {
  extensions: ['.js', '.ts', '.tsx'],
  modules: ['node_modules'],
  // Fix webpack's default behavior to not load packages with jsnext:main module
  // (jsnext:main directs not usually distributable es6 format, but es6 sources)
  mainFields: ['module', 'browser', 'main'],
  alias: {
    '@App': Path.resolve(sourcePath, './'),
    '@Scenes': Path.resolve(sourcePath, 'kit/scenes'),
    '@Components': Path.resolve(sourcePath, 'kit/components'),
    '@Modules': Path.resolve(sourcePath, 'kit/modules'),
    '@Services': Path.resolve(sourcePath, 'model/services/index'),
    '@Mappers': Path.resolve(sourcePath, 'model/mappers/index'),
    '@Storages': Path.resolve(sourcePath, 'model/storages/index'),
    '@Entities': Path.resolve(sourcePath, 'entities'),
    '@Const': Path.resolve(sourcePath, 'const'),
    '@Types': Path.resolve(sourcePath, 'common/types')
  }
};
const devtool = 'cheap-module-eval-source-map';

const optimization = {
  usedExports: true,
  minimizer: [
    new TerserPlugin({
      sourceMap: true,
      terserOptions: {
        mangle: {
          toplevel: true
        },
        output: {comments: false}
      }
    }),
    new OptimizeCSSAssetsPlugin({})
  ],
  splitChunks: {
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'libraries',
        chunks: 'all'
      }
    }
  }
};

const output = {
  publicPath: '/',
  path: outPath,
  // Removing hash from bundle name seems to reduce memory leak in webpack dev server
  filename: 'bundle.js',
  // Workaround for https://github.com/webpack/webpack/issues/6642
  globalObject: 'this'
};

const _module = {
  rules: [
    {
      test: /\.tsx?$/,
      exclude: [
        /(node_modules)/,
        /\.test.tsx?$/,
        /\.spec.tsx?$/
      ],
      loader: [
        'react-hot-loader/webpack',
        {
          loader: 'ts-loader',
          options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: true,
            allowTsInNodeModules: false,
            onlyCompileBundledFiles: true
          }
        }
      ]
    },
    {
      test: /\.(css|scss)$/,
      // This prevents class name mangling for components from node_modules
      exclude: [
        /node_modules/
      ],
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            discardDuplicates: true,
            importLoaders: 1,
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }
      ]
    },
    {
      test: /\.(css|scss)$/,
      include: [
        /node_modules/
      ],
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            discardDuplicates: true,
            importLoaders: 1,
            modules: true,
            localIdentName: '[local]',
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }
      ]
    },
    {
      test: /\.(jpg|jpeg|gif|png|eot)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/'
        },
      },
    },
    {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/'
        },
      },
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/'
        },
      },
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/'
        },
      },
    }
  ]
};

const plugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"development"'
  }),
  new CleanWebpackPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new CopyWebpackPlugin([
    // {
    //   from: 'public/favicon.ico',
    //   to: 'favicon.ico'
    // },
  ]),
  new HtmlWebpackPlugin({
    template: 'src/index.html',
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    }
  }),
  new ForkTsCheckerWebpackPlugin({
    useTypescriptIncrementalApi: false,
    checkSyntacticErrors: true,
    tsconfig: 'tsconfig.json',
    reportFiles: [
      '**',
      '!./node_modules/**',
      '!**/?(*.)(spec|test).*'
    ],
    watch: 'src',
    workers: 1,
    silent: false,
    tslint: true,
    formatter: 'codeframe'
  }),
];

const devServer = {
    port: 3000,
    contentBase: './src',
    compress: true,
    hot: true,
    inline: true,
    overlay: true,
    watchOptions: {
      ignored: /node_modules/
    },
    historyApiFallback: {
      disableDotRule: true
    }
  };

const node = {
  // workaround for webpack-dev-server issue
  // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
  fs: 'empty',
  net: 'empty'
};

module.exports = {
  mode,
  entry,
  resolve,
  devtool,
  optimization,
  output,
  module: _module,
  plugins,
  devServer,
  node,
};
