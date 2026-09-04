import { test, expect } from "@playwright/test";
import { loginWithPassword } from "../support/auth";
import { businessTestEnv } from "../support/env";

async function resolvePublicCollectionId(page) {
  if (businessTestEnv.publicCollectionId) {
    return businessTestEnv.publicCollectionId;
  }

  await page.goto("/collections/public");
  await expect(page.getByRole("heading", { name: "Public Collections" })).toBeVisible();

  const loadingStatus = page.getByText("Loading public collections");
  await loadingStatus.waitFor({ state: "hidden", timeout: 15000 }).catch(() => {});

  const emptyState = page.getByText("No public collections are available yet.");
  const firstCollectionCard = page.locator("main button").filter({ hasText: /View/i }).first();
  await expect(firstCollectionCard.or(emptyState)).toBeVisible({ timeout: 15000 });

  if (await emptyState.isVisible()) {
    throw new Error("No public collections are available yet. Set PLAYWRIGHT_PUBLIC_COLLECTION_ID to a known collection id.");
  }

  if ((await firstCollectionCard.count()) === 0) {
    throw new Error("Unable to find a clickable public collection card on /collections/public");
  }
  await expect(firstCollectionCard).toBeVisible();
  await firstCollectionCard.click();
  await expect(page).toHaveURL(/\/collections\/public\/[^/]+$/);

  const match = page.url().match(/\/collections\/public\/([^/]+)$/);
  if (!match) {
    throw new Error("Unable to resolve a public collection id from /collections/public");
  }

  return match[1];
}

test.describe("Application smoke", () => {
  test("login page is reachable", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Google" })).toBeVisible();
  });

  test("verified user can open the core authenticated surfaces", async ({ page }) => {
    test.skip(
      !businessTestEnv.userEmail || !businessTestEnv.userPassword,
      "Missing PLAYWRIGHT_USER_EMAIL or PLAYWRIGHT_USER_PASSWORD in business-tests/.env"
    );

    await loginWithPassword(page, businessTestEnv.userEmail, businessTestEnv.userPassword);

    await expect(page).toHaveURL(/\/home(?:$|[?#])/);

    await page.goto("/profile");
    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByRole("heading", { name: "My Profile" })).toBeVisible();

    await page.goto("/collections/public");
    await expect(page).toHaveURL(/\/collections\/public$/);
    await expect(page.getByRole("heading", { name: "Public Collections" })).toBeVisible();
  });

  test("admin can reach the AI generation surface", async ({ page }) => {
    test.skip(
      !businessTestEnv.adminEmail || !businessTestEnv.adminPassword,
      "Missing PLAYWRIGHT_ADMIN_EMAIL or PLAYWRIGHT_ADMIN_PASSWORD in business-tests/.env"
    );

    await loginWithPassword(page, businessTestEnv.adminEmail, businessTestEnv.adminPassword);

    await page.goto("/admin/generate-question");
    await expect(page).toHaveURL(/\/admin\/generate-question$/);
    await expect(page.getByRole("heading", { name: "Generate Question with AI" })).toBeVisible();
  });

  test("user can open collection session setup for a known public collection", async ({ page }) => {
    test.skip(
      !businessTestEnv.userEmail || !businessTestEnv.userPassword,
      "Missing PLAYWRIGHT_USER_EMAIL or PLAYWRIGHT_USER_PASSWORD in business-tests/.env"
    );

    await loginWithPassword(page, businessTestEnv.userEmail, businessTestEnv.userPassword);

    const collectionId = await resolvePublicCollectionId(page);

    await page.goto(`/collections/public/${collectionId}/session/config`);
    await expect(page).toHaveURL(new RegExp(`/collections/public/${collectionId}/session/config$`));
    await expect(page.getByRole("heading", { name: "New collection session" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Start session" }).or(page.getByText("This collection does not contain any questions yet."))
    ).toBeVisible();
  });
});
