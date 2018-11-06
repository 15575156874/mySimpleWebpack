const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const util = require('./util')
process.env.NODE_ENV = "development"
module.exports = merge(common, {
  mode: 'development',
  entry: util.getEntry().obj.entry,
  // devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, `../dist`),
    hot: true,
    proxy: {
      '/app': {
        target: 'https://test.everonet.com',
        secure: false,
        changeOrigin: true,
        // pathRewrite: {
        //     '^/app': ''
        // }
      }
    }
  },
  plugins: [
    new webpack.NamedModulesPlugin(), //以便更容易查看要修补(patch)的依赖
    new webpack.HotModuleReplacementPlugin(),
    ...util.getEntry().htmlWebpackPluginDevConfig.plugins,
    // new CopyWebpackPlugin([{
    //     from: path.resolve(__dirname, `../src/${process.env.ENV_other ? `${process.env.ENV_other}/` : ''}${process.env.ENV_file}/static`)
    // }])
  ],
  optimization: {},
  module: {
    rules: [{
      test: /\.(html)$/,
      use: {
        loader: 'html-loader',
        options: {
          attrs: [':data-src']
        }
      }
    }, ]
  },
});