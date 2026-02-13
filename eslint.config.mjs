module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-console': 'off',
  },
}
