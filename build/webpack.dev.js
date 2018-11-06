const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const commonDev = require('./webpack.common.dev.js');
const util = require('./util')
module.exports = merge(commonDev, {

  plugins: [
  ],
  optimization: {},
  module: {
    rules: []
  },
});