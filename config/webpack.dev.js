const webpack = require('webpack');
const merge = require('webpack-merge');
const APP_PORT = 8080;
const common = require('./webpack.common');
const paths = require('./paths');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  module: {
    rules: [
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
    ],
  },
  devServer: {
    port: APP_PORT,
    contentBase: paths.src,
    historyApiFallback: true,
    inline: true,
    hot: true
  },
});
