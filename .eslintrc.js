module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'google',
    'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
    },
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    SERVER_VARS: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    "require-jsdoc": 'off',
    'valid-jsdoc': 'off',
    complexity: ['error', 10],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/prop-types': 'off',
    'no-invalid-this': 'off',
    'prettier/prettier': [
      'error',
      {
        printWidth: 120, // 行の最大長
        tabWidth: 2, // 1 インデントあたりの空白数
        useTabs: false,
        semi: true, // 式の最後にセミコロンを付加する
        singleQuote: true, // 引用符としてシングルクオートを使用する
      },
    ],
    '@typescript-eslint/ban-types': 'off',
  },
};
