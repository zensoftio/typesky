const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Path = require('path');

const sourcePath = Path.join(__dirname, './src');
const outPath = Path.join(__dirname, './dist');

module.exports = {
  entry: {
    main: './src/index.tsx',
  },
  output: {
    filename: "bundle.js",
    path: outPath,
  },
  devtool: 'eval',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      // inject: true,
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
              localIdentName: '[name]__[local]___[hash:base64:5]',
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
        test: /\.(png|svg|jpg)$/,
        use: ['file-loader'],
      }
    ],
  },
  devServer: {
    port: 8080,
    contentBase: sourcePath,
    historyApiFallback: true,
    inline: true,
  },
};
