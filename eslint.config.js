import { tanstackConfig } from "@tanstack/eslint-config";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import Recommended from "eslint-plugin-prettier/recommended";
import sonarjs from "eslint-plugin-sonarjs";

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
      ".utils/**",
      "**/*.config.js",
      "**/*.config.ts",
    ],
  },
  ...tanstackConfig,
  eslintPluginUnicorn.configs.all,
  Recommended,
  sonarjs.configs.recommended,
  {
    plugins: { eslintPluginUnicorn },
    rules: {
      "unicorn/no-array-sort": ["warn"],
    },
  },
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
              name: "@utils/react-start",
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
              name: "@utils/react-start",
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
          patterns: ["@server/*", "@route/*", "@utils/react-start"],
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
            "@utils/react-start",
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
            "@utils/react-start",
            "@tanstack/react-query",
          ],
        },
      ],
    },
  },
];
