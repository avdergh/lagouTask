const { merge } = require('webpack-merge');
const common = require('./webpack.common')
const webpack = require('webpack');

module.exports = merge(common,{
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: 'public',
    hot: true
  },
  plugins:[
    new webpack.DefinePlugin({
      BASE_URL: JSON.stringify('public/'),
    }),
    new webpack.HotModuleReplacementPlugin()  
  ]
})
