import { tanstackConfig } from "@tanstack/eslint-config";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import Recommended from "eslint-plugin-prettier/recommended";
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  {
    ignores: [
      "src/routeTree.gen.ts",
      "**/._*",
      "dist/**",
      "node_modules/**",
      ".idea/**",
      ".nitro/**",
      ".output/**",
      ".tanstack/**",
      "**/*.config.js",
      "**/*.config.ts",
    ],
  },
  ...tanstackConfig,
  eslintPluginUnicorn.configs.all,
  Recommended,
  sonarjs.configs.recommended,
  {
    rules: {
      "max-params": ["error", 4],
    },
  },
  {
    files: ["src/server/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@controller/functions/**",
            "@client/**",
            "@routes/**",
            "@tanstack/react-query",
          ],
          paths: [
            {
              name: "@tanstack/react-start",
              importNames: ["createServerFn"],
              message:
                "You are not allowed to import createServerFn in server code.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/controller/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@server/db/**",
            "@client/**",
            "@routes/**",
            "@tanstack/react-query",
          ],
          paths: [
            {
              name: "@tanstack/react-start",
              importNames: ["createServerOnlyFn"],
              message:
                "You are not allowed to import createServerOnlyFn in controller code.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/client/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@server/*", "@route/*", "@tanstack/react-start"],
        },
      ],
    },
  },
  {
    files: ["src/routes/api/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@server/db/**",
            "@controller/**",
            "@client/**",
            "@routes/(client)/**",
            "@tanstack/react-start",
            "@tanstack/react-query",
          ],
        },
      ],
    },
  },

  {
    files: ["src/routes/(client)/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@server/**",
            "@controller/**",
            "@routes/api/**",
            "@tanstack/react-start",
            "@tanstack/react-query",
          ],
        },
      ],
    },
  },
];
