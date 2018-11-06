const merge = require('webpack-merge');
const commonPro = require('./webpack.common.pro.js')
module.exports = merge(commonPro,{
  plugins: [
  ],
  optimization:{}
}) 