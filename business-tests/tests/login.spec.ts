import { test, expect } from "@playwright/test";
import { loginWithPassword } from "../support/auth";
import { businessTestEnv } from "../support/env";

test.describe("Login", () => {
  test("verified user can log in and access private routes", async ({ page }) => {
    test.skip(
      !businessTestEnv.userEmail || !businessTestEnv.userPassword,
      "Missing PLAYWRIGHT_USER_EMAIL or PLAYWRIGHT_USER_PASSWORD in business-tests/.env"
    );

    await loginWithPassword(page, businessTestEnv.userEmail, businessTestEnv.userPassword);

    await expect(page).toHaveURL(/\/home(?:$|[?#])/);

    const accessToken = await page.evaluate(() => window.localStorage.getItem("accessToken"));
    const refreshToken = await page.evaluate(() => window.localStorage.getItem("refreshToken"));

    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();

    await page.goto("/profile");
    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByRole("heading", { name: "My Profile" })).toBeVisible();
  });
});
