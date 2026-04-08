module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier", "import", "unused-imports"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": "error",
    "unused-imports/no-unused-imports": "error",
    "import/order": [
      "error",
      {
        groups: [["builtin", "external"], "internal", "parent", "sibling"],
        alphabetize: { order: "asc", caseInsensitive: true },
        "newlines-between": "always",
      },
    ],
    "@typescript-eslint/no-unused-vars": "off",
  },
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
};
