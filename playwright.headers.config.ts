import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/security/e2e",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4323",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "node tests/security/static-headers-server.mjs",
    url: "http://127.0.0.1:4323/",
    reuseExistingServer: false,
  },
});
