module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    // relax TypeScript any usage for now during the build
    "@typescript-eslint/no-explicit-any": "off",
    // warn instead of error for unused vars, ignore args starting with _
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    // disable core no-unused-vars to avoid duplicate reports
    "no-unused-vars": "off",
    // relax react hooks exhaustive deps for now
    "react-hooks/exhaustive-deps": "off",
    // avoid forcing explicit return types everywhere
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
};
