import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// Flat config (ESLint 9) - Next 16 removed `next lint`, so linting now runs
// through the plain ESLint CLI (see the "lint" script in package.json).
// Rule set matches the old .eslintrc.json ("next/core-web-vitals").
export default defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", ".open-next/**", "node_modules/**", "next-env.d.ts", "cloudflare-env.d.ts"]),
]);
