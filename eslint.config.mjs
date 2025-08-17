import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "**/node_modules/",
    "core-api/prisma/client/",
    "**/frontend/",
    "**/Dockerfile",
    "**/Makefile",
    "**/README.md",
    "**/.yarn",
    "**/.next",
    "core-api/docs/swagger.yaml",
    "**/prisma/client",
    "**/*.txt",
    "**/*.json",
    "**/*.yaml",
    "**/*.toml",
    "**/*.yml",
    "**/*.prisma",
    "**/*.sql",
    "**/*.mermaid",
    "**/*.webp",
    "**/*.css",
    "**/*.jpeg",
    "**/*.jpg",
    "**/*.png",
    "**/*.md",
    "**/*.ico",
    "**/*.xml",
    "**/*.tar",
    "**/*.html",
    "**/*.cnf",
    ".github/PULL_REQUEST_TEMPLATE.md",
    ".github/ISSUE_TEMPLATE/simple-issue.md",
    "**/.prettierignore",
    "**/.eslintignore",
    "**/*.lock",
    "**/.gitignore",
    "**/.dockerignore",
    "dynamodb/start-dynamodb.sh",
  ]),
  {
    extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
    ),

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-console": "error",
      "no-control-regex": 0,
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
]);
