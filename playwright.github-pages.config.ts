import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/github-pages",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4324/padre-claudiano-avelino-site/",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command:
      "BASE_PATH=/padre-claudiano-avelino-site PORT=4324 node tests/security/static-headers-server.mjs",
    url: "http://127.0.0.1:4324/padre-claudiano-avelino-site/",
    reuseExistingServer: false,
  },
});
