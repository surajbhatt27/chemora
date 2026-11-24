import { defineConfig } from "vitest/config";

// Separate from vite.config.ts so tests do not load the Tailwind/React plugins.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
