// eslint.config.mjs
import js from "@eslint/js";
import next from "eslint-config-next";
import tailwind from "eslint-plugin-tailwindcss";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

const config = [
  js.configs.recommended,
  ...next.configs["core-web-vitals"],
  {
    plugins: {
      tailwindcss: tailwind,
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": ["error", { singleQuote: true, semi: true }],
      "tailwindcss/classnames-order": "warn",
      "react/react-in-jsx-scope": "off",
      "@next/next/no-img-element": "off",
    },
    settings: {
      tailwindcss: {
        callees: ["classnames", "cn"],
        config: "tailwind.config.js",
        removeDuplicates: true,
      },
    },
  },
  prettierConfig,
];

export default config;
