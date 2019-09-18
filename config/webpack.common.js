const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const paths = require('./paths');

module.exports = {
  entry: {
    main: path.resolve(paths.src, 'index.tsx')
  },
  output: {
    filename: 'bundle.[hash].js',
    path: paths.output,
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(paths.src, 'index.html'),
      favicon: path.resolve(paths.src, 'assets', 'images', 'favicon.ico')
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css', '.scss'],
    modules: ['node_modules'],
    alias: {
      Scenes: path.resolve(paths.src, 'scenes'),
      Components: path.resolve(paths.src, 'kit/components'),
      Modules: path.resolve(paths.src, 'kit/modules'),
      Services: path.resolve(paths.src, 'services/index'),
      Mappers: path.resolve(paths.src, 'mappers/index'),
      Models: path.resolve(paths.src, 'models')
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
    ]
  }
};
