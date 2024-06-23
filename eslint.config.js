// @ts-check
// esli

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/", "**/*.config.js"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ["src/**/*.ts", "scripts/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
);
