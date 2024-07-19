module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:storybook/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/prop-types": "off",
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      { allowNumber: true },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { fixStyle: "separate-type-imports" },
    ],
    "@typescript-eslint/array-type": ["error", { default: "generic" }],
    "@typescript-eslint/ban-types": "off",
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
          orderImportKind: "asc",
          caseInsensitive: true,
        },
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
        ],
        pathGroups: [
          {
            pattern: "*.{css,scss}",
            patternOptions: { matchBase: true },
            group: "object",
            position: "after",
          },
          {
            pattern: "@/**",
            group: "internal",
          },
          {
            pattern: "react",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "react-dom",
            group: "builtin",
            position: "before",
          },
        ],
        warnOnUnassignedImports: true,
      },
    ],
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.app.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
      },
      node: true,
    },
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["**/*.test.ts"],
      plugins: ["vitest"],
      extends: ["plugin:vitest/legacy-recommended"],
    },
  ],
};
