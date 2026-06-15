const eslint = require('@eslint/js')
const globals = require('globals')
const prettier = require('eslint-config-prettier')

module.exports = [
  eslint.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
  prettier,
  { ignores: ['frontend/', 'node_modules/'] },
]
