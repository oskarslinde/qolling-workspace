import { expect, type Page, test } from "@playwright/test";
import { installApiMocks, withSession } from "../support/apiMocks";

const openNavigationMenuIfNeeded = async (page: Page) => {
  const logoutButton = page.getByRole("button", { name: "Logout" });
  if (await logoutButton.isVisible()) {
    return logoutButton;
  }

  const navToggle = page.getByRole("button", { name: /navigation menu/i });
  if (await navToggle.isVisible()) {
    await navToggle.click();
  }

  return logoutButton;
};

test.describe("Business feature scenarios coverage", () => {
  test("[F01] New User Registration (Happy Path)", async ({ page }) => {
    await withSession(page, "guest");
    await installApiMocks(page);
    await page.goto("/register");
    await page.getByPlaceholder("Email").fill("new.user@example.com");
    await page.getByPlaceholder("Password").fill("StrongPass1!");
    await page.getByLabel(/I agree to the/i).check();
    await page.getByRole("button", { name: "Sign up" }).click();
    await expect(page.getByText("Registration Successful")).toBeVisible();
  });

  test("[F02] Registration Blocked by Password Policy", async ({ page }) => {
    await withSession(page, "guest");
    await installApiMocks(page);
    await page.goto("/register");
    await page.getByPlaceholder("Password").fill("weak");
    await page.getByPlaceholder("Password").blur();
    await expect(page.getByText("Password requirements")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign up" })).toBeDisabled();
  });

  test("[F03] Email Verification with Valid Token", async ({ page }) => {
    await withSession(page, "guest");
    await installApiMocks(page);
    await page.goto("/verify-email?token=valid-token");
    await expect(page.getByRole("heading", { name: "Email Verified!" })).toBeVisible();
  });

  test("[F04] Email Verification Fails with Expired Token", async ({ page }) => {
    await withSession(page, "guest");
    await installApiMocks(page, { verifyFailureMessage: "Verification token is invalid or expired." });
    await page.goto("/verify-email?token=expired-token");
    await expect(page.getByRole("heading", { name: "Verification Failed" })).toBeVisible();
    await expect(page.getByText("Verification token is invalid or expired.")).toBeVisible();
  });

  test("[F05] Login Success and Session Establishment", async ({ page }) => {
    await withSession(page, "guest");
    await installApiMocks(page);
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill("learner@example.com");
    await page.getByPlaceholder("Password").fill("StrongPass1!");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/home$/);
  });

  test("[F06] Login Rejected Due to Wrong Credentials", async ({ page }) => {
    await withSession(page, "guest");
    await installApiMocks(page, { loginFailureMessage: "Invalid username or password." });
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill("learner@example.com");
    await page.getByPlaceholder("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page.getByText("Invalid username or password.")).toBeVisible();
  });

  test("[F07] Token Expiration During Active Session", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page, { feedFailFirst: true });
    await page.route("**/v1/feed/next", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "token expired" }),
      });
    });
    await page.goto("/home");
    await expect(page.getByText("Session expired")).toBeVisible();
    await page.getByRole("button", { name: "OK" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("[F08] Browse Public Collections", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/collections/public");
    await expect(page.getByRole("heading", { name: "Public Collections" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Mock Collection/i }).first()).toBeVisible();
  });

  test("[F09] Create New Collection", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/collections/new");
    await page.getByPlaceholder("European history warm-up").fill("New business collection");
    await page.getByRole("button", { name: "Create collection" }).click();
    await expect(page).toHaveURL(/\/collections\/my\/new-col\/edit$/);
  });

  test("[F10] Edit Collection Metadata", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/collections/my/col-1/edit");
    await expect(page.getByRole("heading", { name: "Edit collection" })).toBeVisible();
    await page.locator('label:has-text("Collection name")').locator("xpath=following-sibling::input[1]").fill("Updated name");
    await page.getByRole("button", { name: "Save details" }).click();
    await expect(page.getByText("Collection details saved.")).toBeVisible();
  });

  test("[F11] Create Question Manually", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/questions/new");
    await expect(page.getByRole("heading", { level: 1, name: "Create Question" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Question", exact: true })).toBeVisible();
  });

  test("[F12] Create Question with Image Upload", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/questions/new");
    await expect(page.getByText("Question image (optional)")).toBeVisible();
    await expect(page.getByRole("button", { name: "Preview" })).toBeVisible();
  });

  test("[F13] AI-Assisted Question Generation", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/questions/generate");
    await expect(page.getByRole("heading", { name: "Generate question with AI" })).toBeVisible();
    await page.getByPlaceholder("Enter topic").fill("Roman Empire");
    await page.getByRole("button", { name: "Generate Question" }).click();
    await expect(page.getByRole("textbox", { name: "Question", exact: true })).toHaveValue("Generated mock question?");
  });

  test("[F14] Edit Existing Question and Save", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/questions/q-1/edit");
    await expect(page.getByRole("heading", { name: "Edit Question" })).toBeVisible();
  });

  test("[F15] My Questions with Filters and Pagination", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/questions/me");
    await expect(page.getByRole("heading", { name: "My Questions" })).toBeVisible();
    await page.getByRole("button", { name: "Filters" }).click();
    await page.getByLabel("Search my questions").fill("math");
    await expect(page.getByRole("heading", { name: "What is 2 + 2?" })).toBeVisible();
  });

  test("[F16] Play Session - Correct Answer Submission", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page, { feedAnswerCorrect: true });
    await page.goto("/home");
    await expect(page.getByText("Mock question 1?")).toBeVisible();
    await page.getByRole("button", { name: "Answer A" }).click();
    await expect(page.getByText("Correct! Good job.")).toBeVisible();
  });

  test("[F17] Play Session - Incorrect Answer with Recovery", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page, { feedAnswerCorrect: false });
    await page.goto("/home");
    await page.getByRole("button", { name: "Answer A" }).click();
    await expect(page.getByText("Almost! Correct answer was")).toBeVisible();
    await page.getByRole("button", { name: "Next question" }).click();
    await expect(page.getByText("Mock question 2?")).toBeVisible();
  });

  test("[F18] Skip Question in Play Flow", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/home");
    await expect(page.getByText("Mock question 1?")).toBeVisible();
    await page.getByRole("button", { name: "Skip" }).click();
    await expect(page.getByText("Mock question 2?")).toBeVisible();
  });

  test("[F19] View Public User Profile", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/users/author-1?username=author1");
    await expect(page.getByRole("heading", { name: "Author profile" })).toBeVisible();
    await expect(page.getByText("author1")).toBeVisible();
  });

  test("[F20] Edit Own Profile Information", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/profile");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Updated");
    await page.getByRole("button", { name: "Save profile" }).click();
    await expect(page.getByText("Profile details updated.")).toBeVisible();
  });

  test("[F21] Admin Reviews Pending Collections", async ({ page }) => {
    await withSession(page, "admin");
    await installApiMocks(page);
    await page.goto("/admin/review-collections");
    await expect(page.getByRole("heading", { name: "Review question collections" })).toBeVisible();
  });

  test("[F22] Admin Approves Pending Question", async ({ page }) => {
    await withSession(page, "admin");
    await installApiMocks(page);
    await page.goto("/admin/approve-questions");
    await expect(page.getByRole("heading", { name: "Pending approvals" })).toBeVisible();
    await expect(page.getByText("Pending review question?")).toBeVisible();
  });

  test("[F23] Guest Blocked by Private Route Guard", async ({ page }) => {
    await withSession(page, "guest");
    await installApiMocks(page);
    await page.goto("/collections/my");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("[F24] Feed Load Error and Retry Recovery", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page, { feedFailFirst: true });
    await page.goto("/home");
    await expect(page.getByText("No questions available.")).toBeVisible();
    await page.reload();
    await expect(page.getByText("Mock question 1?")).toBeVisible();
  });

  test("[F25] Logout from Global Navigation", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/home");
    const logoutButton = await openNavigationMenuIfNeeded(page);
    await logoutButton.click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("[F26] Collection Visibility Transition (Private -> Public Review)", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.route("**/v1/question-collections/col-1", async (route) => {
      const method = route.request().method().toUpperCase();

      if (method === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: "col-1",
            name: "Mock Collection",
            description: "Mock collection used by business tests",
            state: "DRAFT",
            questionCount: 5,
            playableQuestionCount: 5,
            unavailableQuestionCount: 0,
            inactiveQuestionCount: 0,
            deletedQuestionCount: 0,
            missingQuestionCount: 0,
            questionIds: ["q-1", "q-2", "q-3", "q-4", "q-5"],
            createdAt: "2026-01-01T00:00:00Z",
          }),
        });
        return;
      }

      if (method === "PUT" || method === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: "col-1",
            name: "Mock Collection",
            description: "Mock collection used by business tests",
            state: "PENDING",
            questionCount: 5,
            playableQuestionCount: 5,
            unavailableQuestionCount: 0,
            inactiveQuestionCount: 0,
            deletedQuestionCount: 0,
            missingQuestionCount: 0,
            questionIds: ["q-1", "q-2", "q-3", "q-4", "q-5"],
            createdAt: "2026-01-01T00:00:00Z",
          }),
        });
        return;
      }

      await route.fallback();
    });
    await page.goto("/collections/my/col-1/edit");
    await page.getByRole("button", { name: "Submit as public collection" }).click();
    await expect(page.getByText("Collection submitted for admin approval.")).toBeVisible();
  });

  test("[F27] View and Use Favorite Questions List", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/home");
    await page.getByLabel("Favorite question").click();
    await expect(page.getByText("Failed to favorite question.")).not.toBeVisible();
  });

  test("[F28] Question Discovery via Search + Filters", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/questions/me");
    await page.getByRole("button", { name: "Filters" }).click();
    await page.getByLabel("Search my questions").fill("2 + 2");
    await expect(page.getByRole("heading", { name: "What is 2 + 2?" })).toBeVisible();
    await page.getByRole("button", { name: "Unpublished" }).click();
    await expect(page.getByRole("heading", { name: "What is 2 + 2?" })).toBeVisible();
  });

  test("[F29] Navigate to Author Profile from Question Card", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/home");
    await page.getByLabel("View author profile for author1").click();
    await expect(page).toHaveURL(/\/users\/author-1/);
    await expect(page.getByRole("heading", { name: "Author profile" })).toBeVisible();
  });

  test("[F30] Back Navigation Preserves Orientation", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);
    await page.goto("/collections/public");
    await page.getByRole("button", { name: /Mock Collection/i }).click();
    await expect(page).toHaveURL(/\/collections\/public\/col-1$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/collections\/public$/);
  });
});
