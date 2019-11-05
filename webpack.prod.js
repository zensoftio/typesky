const Path = require('path');

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const sourcePath = Path.join(__dirname, './src');
const outPath = Path.join(__dirname, './dist');
const isAnalyze = !!process.env.BUNDLE_ANALYZE;

const mode = 'production';
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
  },
};

const optimization = {
  usedExports: true,
    minimizer: [
    new TerserPlugin({
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
      },
    }
  }
};

const output = {
  publicPath: '/',
  path: outPath,
  filename: 'bundle.[hash].js',
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
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        allowTsInNodeModules: false,
        onlyCompileBundledFiles: true,
        compilerOptions: {
          sourceMap: false
        }
      }
    },
    {
      test: /\.(css|scss)$/,
      exclude: [
      /node_modules/
      ],
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: false,
          },
        },
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
            sourceMap: false,
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
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: false,
          },
        },
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
            sourceMap: false,
          },
        }
        ]
    },
    {
      test: /\.(jpg|jpeg|gif|png|eot)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'assets/'
        },
      },
    },
    {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'assets/'
        },
      },
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'assets/'
        },
      },
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'assets/'
        },
      },
    }
    ]
};

const plugins = [
  new webpack.DefinePlugin({
  'process.env.NODE_ENV': '"production"'
}),
  new CleanWebpackPlugin(),
  new CopyWebpackPlugin([
    // {
    //   from: 'public/favicon.ico',
    //   to: 'favicon.ico'
    // },
  ]),
  // TODO: Check if this one is still relevant
  new MiniCssExtractPlugin({
    filename: '[name].[hash].css',
    chunkFilename: '[id].[hash].css',
  }),
  new HtmlWebpackPlugin({
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
    },
    template: 'src/index.html',
  }),
  new CompressionPlugin({
    algorithm: 'gzip',
    filename: '[path].gz[query]',
    minRatio: 0.8,
    test: /\.js$|\.css$|\.html$/,
    threshold: 10240,
  }),
  new ForkTsCheckerWebpackPlugin({
    checkSyntacticErrors: true,
    formatter: 'codeframe',
    reportFiles: [
      '**',
      '!./node_modules/**',
      '!**/__tests__/**',
      '!**/?(*.)(spec|test).*',
    ],
    silent: false,
    tsconfig: 'tsconfig.json',
    tslint: true,
    useTypescriptIncrementalApi: false,
    watch: 'src',
    workers: 1,
  }),
];

isAnalyze ? plugins.push(new BundleAnalyzerPlugin) : undefined;

module.exports = {
  mode,
  entry,
  resolve,
  optimization,
  output,
  module: _module,
  plugins,
};
