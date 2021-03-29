module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    es6: true,
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    // parser: 'babel-eslint',
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {
  }
}
