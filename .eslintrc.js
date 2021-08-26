export default {
  "env": {
    "browser": false,
    "es6": true,
    "jest": true,
    "node": true
  },
  "extends": "airbnb-base",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "rules": {
    "linebreak-style": 0,
    "consistent-return": 0,
    "camelcase": 0,
  }
};
