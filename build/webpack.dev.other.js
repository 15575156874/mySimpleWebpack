const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const util =require('./util.js')
process.env.NODE_ENV = "development"
console.log('入口', `other/${process.env.ENV_other}`, util.getEntry(`other/${process.env.ENV_other}`).obj.entry)
module.exports = merge(common, {
  mode: 'development',
  // devtool: 'inline-source-map',
  entry: util.getEntry(`other/${process.env.ENV_other}`).obj.entry,
  output: {
    path: path.resolve(__dirname, `../dist/${process.env.ENV_other}/${process.env.ENV_file}`),
    filename: './js/[name].bundle[hash].js',
    chunkFilename: './js/[name].[chunkhash:3].js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, `../dist`),
    hot: true,
    host: '192.168.123.153', //'10.30.4.58'
    port: 8020,
    proxy: {
      '/app':  {
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
    ...util.getEntry(`other/${process.env.ENV_other}/`).htmlWebpackPluginDevConfig.plugins,
    // new CopyWebpackPlugin([{
    //     from: path.resolve(__dirname, `../src/${process.env.ENV_other ? `other/${process.env.ENV_other}/` : ''}${process.env.ENV_file}/static`)
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