import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["**/.next/**", "**/node_modules/**", "**/dist/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Build-tool config files that load under plain Node before any
    // bundler/TS transform exists — Metro, Tailwind, and Babel all require
    // CommonJS `require()` here by convention (their own docs use it), so
    // `no-require-imports` doesn't apply.
    files: ["**/metro.config.js", "**/tailwind.config.js", "**/babel.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
