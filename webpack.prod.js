const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Path = require('path');

const sourcePath = Path.join(__dirname, './src');
const outPath = Path.join(__dirname, './dist');

module.exports = {
  entry: {
    main: './src/index.tsx',
  },
  output: {
    path: outPath,
    filename: 'bundle.[hash].js',
    publicPath: '/'
  },
  devtool: 'eval',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[hash].css'
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
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false, sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ],
      },
      {
        test: /\.(png|svg|jpg)$/,
        use: ['file-loader'],
      }
    ],
  }
};

