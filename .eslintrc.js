module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: ['vue'],
  extends: [
    'prestashop',
    'plugin:vue/strongly-recommended',
    'prettier/vue',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': ['error'],
    'no-unused-labels': 'off'
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off'
      }
    }
  ]
}
