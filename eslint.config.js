import { tanstackConfig } from "@tanstack/eslint-config";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import Recommended from "eslint-plugin-prettier/recommended";

export default [
  ...tanstackConfig,
  eslintPluginUnicorn.configs.all,
  Recommended,
];
