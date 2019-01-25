module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  plugins: [
    'vue',
  ],
  extends: [
    'prestashop',
    'plugin:vue/recommended',
  ],
}
