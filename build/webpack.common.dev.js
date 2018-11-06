const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
process.env.NODE_ENV = "development"
module.exports = merge(common, {
  mode: 'development',
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