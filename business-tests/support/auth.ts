import { expect, Page } from "@playwright/test";

export async function loginWithPassword(page: Page, email: string, password: string) {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "Log in" })).toBeVisible({ timeout: 20_000 });

  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/home(?:$|[?#])/, { timeout: 20_000 });
}
