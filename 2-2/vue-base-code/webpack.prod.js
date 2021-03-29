const { merge } = require('webpack-merge');
const common = require('./webpack.common')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');


module.exports = merge(common,{
  mode: 'production',
  devtool: 'none',
  optimization: {
    usedExports: true,
    minimize: true,
    concatenateModules: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(['public']),
    new webpack.DefinePlugin({
      BASE_URL: JSON.stringify(''),
    })
  ]
})
