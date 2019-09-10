const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Path = require('path');
const APP_PORT = 8080;
const HOST = process.env.API_URL
  ? process.env.API_URL.replace(/\d{4}/gi, '')
  : `http://localhost:${APP_PORT}`;

const sourcePath = Path.join(__dirname, './src');
const outPath = Path.join(__dirname, './dist');

module.exports = {
  entry: {
    main: './src/index.tsx',
  },
  output: {
    filename: 'bundle.[hash].js',
    path: outPath,
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
        NODE_ENV: JSON.stringify('development'),
      },
    }),
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
            loader: 'style-loader',
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
        test: /\.(png|svg|jpg)$/,
        use: ['file-loader'],
      }
    ],
  },
  devServer: {
    port: APP_PORT,
    contentBase: sourcePath,
    historyApiFallback: true,
    inline: true,
  },
};
