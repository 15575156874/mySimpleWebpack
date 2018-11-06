// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    "parser": "babel-eslint",
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  'globals': {
    'Promise': true,
    'AlipayJSBridge': true,
    'wx': true,
    'WeixinJSBridge': true,
    'window': true,
    'ActiveXObject': true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [
    'plugin:vue/recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  'rules': {
    "indent": ["error", 2],
    "no-multiple-empty-lines": [1, {
      "max": 1
    }], //空行最多不能超过2行
    // "space-before-function-paren": 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}