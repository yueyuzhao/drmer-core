module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript",
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  rules: {
    "no-case-declarations": "off",
    quotes: [1, "double", {allowTemplateLiterals: true}],
    indent: [1, 2, {SwitchCase: 1, VariableDeclarator: {var: 1, let: 1, const: 1}}],
    "no-trailing-spaces": 1,
    "brace-style": [1, "1tbs", {allowSingleLine: true}],
    "newline-after-var": [1, "always"],
    "newline-before-return": 1,
    "@typescript-eslint/explicit-module-boundary-types": 1,
    "no-void": 1,
    "comma-dangle": ["error", "only-multiline"],
  },
  ignorePatterns: [
    "**/*.tests.ts"
  ]
};
