const globals = require('globals');
const js = require('@eslint/js');
const haensl = require('@haensl/eslint-config');

const config = {
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.jest
    }
  },
  rules: {
    ...haensl.rules
  }
};

module.exports = [
  js.configs.recommended,
  config
];
