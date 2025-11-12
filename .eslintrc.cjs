module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: undefined,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist/'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'warn',
    // Example: turn off rules conflicting with Prettier formatting (handled by prettier config)
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off'
  }
};
