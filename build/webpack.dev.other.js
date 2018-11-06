
const merge = require('webpack-merge');
const commonDev = require('./webpack.common.dev.js');
const util =require('./util.js')
process.env.NODE_ENV = "development"
console.log('入口', `other/${process.env.ENV_other}`, util.getEntry(`other/${process.env.ENV_other}`).obj.entry)
module.exports = merge(commonDev, {
  plugins: [
  ],
  optimization: {},
  module: {
    rules: []
  },
});
process.env.ENV_other?`other/${process.env.ENV_other}`:''