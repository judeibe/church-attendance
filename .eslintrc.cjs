/** @type {import("@types/eslint").Linter.Config} */
const config = {
  extends: ["next/core-web-vitals", "plugin:prettier/recommended"],
  ignorePatterns: ["node_modules", ".next"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
};

module.exports = config;
