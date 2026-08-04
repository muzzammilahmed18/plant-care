import { defineConfig } from "@playwright/test";

// This does NOT start the servers for you — both the backend
// (node server.js) and frontend (npm run dev) need to already be
// running before you run `npx playwright test`, same as when testing
// manually in the browser.
export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://localhost:5173",
  },
});