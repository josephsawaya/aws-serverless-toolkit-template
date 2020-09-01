module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true,
    jest: true,
  },
  extends: [
    "plugin:react/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["node_modules", ".build", ".coverage", ".dist"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-var-requires": "off",
  },
};
