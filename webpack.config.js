const path = require('path');
const dev = process.env.NODE_ENV === 'development';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [{
  mode: dev ? 'development' : 'production',
  entry: './src/main/main.ts',
  target: 'electron-main',
  devtool: dev ? 'source-map' : undefined,
  externals: ['yargs'],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@common': path.resolve(__dirname, './src/common/'),
      '@main': path.resolve(__dirname, './src/main/'),
      '@buildroot': path.resolve(__dirname),
    }
  },
  output: {
    path: path.resolve(__dirname, './build/src/main'),
    filename: 'main.js',
  },
  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      use: [{ loader: 'ts-loader' }]
    }]
  },
  plugins: []
}, {
  mode: dev ? 'development' : 'production',
  entry: './src/renderer/index.tsx',
  target: 'electron-renderer',
  devtool: dev ? 'source-map' : undefined,
  externals: [],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@common': path.resolve(__dirname, './src/common/'),
      '@renderer': path.resolve(__dirname, './src/renderer/'),
      '@buildroot': path.resolve(__dirname),
    }
  },
  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      use: [{ loader: 'ts-loader' }]
    }, {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    }]
  },
  output: {
    path: path.resolve(__dirname, './build/src/renderer'),
    filename: 'index.js',
  },
  devServer: {
    port: 3000,
    open: false,
    hot: true,
    devMiddleware: {
      writeToDisk: true,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/renderer/index.html' }),
    new MiniCssExtractPlugin(),
  ]
}];
