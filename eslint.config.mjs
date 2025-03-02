import pluginJs from "@eslint/js";

export default [
  pluginJs.configs.recommended,

  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        exports: "readonly",
        fetch: "readonly",
        require: "readonly",
        module: "readonly",
      },
    },
  },

  {
    files: ["tests/**/*"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
    languageOptions: {
      globals: {
        beforeAll: "readonly",
        test: "readonly",
        expect: "readonly",
      },
    },
  },
];
