import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-config-prettier/flat";
import globals from "globals";

import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

const baseDirectory = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory });

export default defineConfig(
  {
    ignores: [".next", "build", "node_modules"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs}"],
    ...react.configs.flat.recommended,
  },
  {
    files: ["**/*.{js,jsx,mjs}"],
    ...react.configs.flat["jsx-runtime"],
  },
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
  ...compat.extends("plugin:jsx-a11y/recommended"),
  prettier,
);
