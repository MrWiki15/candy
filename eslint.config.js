import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      "dist",
      "eslint.config.js",
      "tailwind.config.js",
      "vite.config.js",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"], // Añadido soporte para ts y tsx
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: typescriptParser, // Utiliza el parser de TypeScript
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
        project: "./tsconfig.json", // Apunta al archivo de configuración de TypeScript
      },
    },
    settings: { react: { version: "18.3" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": typescriptEslint, // Añadido el plugin de TypeScript
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...typescriptEslint.configs.recommended.rules, // Añadidas las reglas recomendadas de TypeScript
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
