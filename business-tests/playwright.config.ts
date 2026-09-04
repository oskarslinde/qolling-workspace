import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";
const apiBaseURL = process.env.PLAYWRIGHT_API_BASE_URL || "http://127.0.0.1:8080/api/v1";

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["html"], ["list"]] : [["list"]],
  use: {
    baseURL,
    actionTimeout: 8_000,
    navigationTimeout: 15_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 390, height: 844 },
    extraHTTPHeaders: {
      "x-qolling-business-tests": "playwright",
    },
  },
  projects: [
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 7"],
      },
    },
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
  ],
  outputDir: "./test-results",
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5173",
    url: baseURL,
    cwd: path.resolve(process.cwd(), "../hera"),
    reuseExistingServer: !process.env.CI,
    timeout: 45_000,
  },
  metadata: {
    baseURL,
    apiBaseURL,
  },
});
