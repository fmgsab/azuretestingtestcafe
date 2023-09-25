module.exports = {
  extends: ['next', 'turbo', 'prettier', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  // parserOptions: {
  //   babelOptions: {
  //     presets: [require.resolve('next/babel')],
  //   },
  // },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'no-console': 'warn',
    'no-extra-boolean-cast': 'warn',
    '@next/next/no-img-element': 'off',
  },
  env: {
    jest: true,
  },
};

// TODO: in production, add this to extends: 'plugin:react/recommended'
