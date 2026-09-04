export const businessTestEnv = {
  baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173",
  apiBaseURL: process.env.PLAYWRIGHT_API_BASE_URL || "http://127.0.0.1:8080/api/v1",
  adminEmail: process.env.PLAYWRIGHT_ADMIN_EMAIL || "",
  adminPassword: process.env.PLAYWRIGHT_ADMIN_PASSWORD || "",
  publicCollectionId: process.env.PLAYWRIGHT_PUBLIC_COLLECTION_ID || "",
  userEmail: process.env.PLAYWRIGHT_USER_EMAIL || "",
  userPassword: process.env.PLAYWRIGHT_USER_PASSWORD || "",
  screenshotDir: process.env.PLAYWRIGHT_SCREENSHOT_DIR || "artifacts/screenshots",
  screenshotFilter: process.env.PLAYWRIGHT_SCREENSHOT_FILTER || "",
};
