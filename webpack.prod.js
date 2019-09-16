const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Path = require('path');

const sourcePath = Path.join(__dirname, './src');
const outPath = Path.join(__dirname, './dist');

module.exports = {
  entry: {
    main: './src/index.tsx',
  },
  output: {
    filename: "bundle.[hash].js",
    path: outPath,
  },
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/assets/images/favicon.ico'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.[hash].css',
      chunkFilename: '[id].css',
    })
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css', '.scss'],
    modules: ['node_modules'],
    alias: {
      Scenes: Path.resolve(sourcePath, 'scenes'),
      Components: Path.resolve(sourcePath, 'kit/components'),
      Modules: Path.resolve(sourcePath, 'kit/modules'),
      Services: Path.resolve(sourcePath, 'services/index'),
      Mappers: Path.resolve(sourcePath, 'mappers/index'),
      Models: Path.resolve(sourcePath, 'models')
    },
  },
  optimization: {
    minimizer: [new TerserPlugin({extractComments: true}), new OptimizeCSSAssetsPlugin({})]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.(css|scss)$/,
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
              localIdentName: 'zen__[local]___[hash:base64:5]'
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test:   /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test:   /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.(png|svg|jpg|ico)$/,
        use: ['file-loader'],
      }
    ],
  }
};
