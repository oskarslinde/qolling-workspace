import fs from "node:fs";
import path from "node:path";
import { expect, Page, test } from "@playwright/test";
import { ApiMockOptions, installApiMocks, SessionMode, withSession } from "../support/apiMocks";
import { businessTestEnv } from "../support/env";

type ScreenshotCase = {
  id: string;
  role: SessionMode;
  route: string;
  apiMockOptions?: ApiMockOptions;
  preScreenshot?: (page: Page) => Promise<void>;
  waitFor: (page: Page) => Promise<void>;
};

const MOCK_INLINE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='700' viewBox='0 0 1200 700'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23539f8b'/%3E%3Cstop offset='100%25' stop-color='%239ad2c0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='700' fill='url(%23g)'/%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='10' opacity='0.8'%3E%3Ccircle cx='190' cy='120' r='80'/%3E%3Ccircle cx='1000' cy='560' r='120'/%3E%3C/g%3E%3Ctext x='600' y='350' fill='%23ffffff' font-family='Arial,sans-serif' font-size='72' text-anchor='middle'%3EMock question image%3C/text%3E%3C/svg%3E";

const screenshotCases: ScreenshotCase[] = [
  {
    id: "about",
    role: "guest",
    route: "/about",
    waitFor: (page) => expect(page.getByText("Welcome to")).toBeVisible(),
  },
  {
    id: "login",
    role: "guest",
    route: "/login",
    waitFor: (page) => expect(page.getByRole("button", { name: "Log in" })).toBeVisible(),
  },
  {
    id: "register",
    role: "guest",
    route: "/register",
    waitFor: (page) => expect(page.getByRole("button", { name: "Sign up" })).toBeVisible(),
  },
  {
    id: "verify-email",
    role: "guest",
    route: "/verify-email?token=valid-token",
    waitFor: (page) => expect(page.getByRole("heading", { name: "Email Verified!" })).toBeVisible(),
  },
  {
    id: "home",
    role: "user",
    route: "/home",
    waitFor: (page) => expect(page.getByText("Mock question 1?")).toBeVisible(),
  },
  {
    id: "question-with-image",
    role: "user",
    route: "/home",
    apiMockOptions: {
      feedQuestionImageUrl: MOCK_INLINE_IMAGE,
    },
    waitFor: (page) => expect(page.getByRole("img", { name: "Question image" })).toBeVisible(),
  },
  {
    id: "question-result-view",
    role: "user",
    route: "/home",
    preScreenshot: async (page) => {
      await page.getByRole("button", { name: "Answer A" }).click();
    },
    waitFor: (page) => expect(page.getByRole("button", { name: "Next" })).toBeVisible(),
  },
  {
    id: "questions-new",
    role: "user",
    route: "/questions/new",
    waitFor: (page) => expect(page.getByRole("heading", { level: 1, name: "Create Question" })).toBeVisible(),
  },
  {
    id: "questions-me",
    role: "user",
    route: "/questions/me",
    waitFor: (page) => expect(page.getByRole("heading", { name: "My Questions" })).toBeVisible(),
  },
  {
    id: "collections-public",
    role: "user",
    route: "/collections/public",
    waitFor: (page) => expect(page.getByRole("heading", { name: "Public Collections" })).toBeVisible(),
  },
  {
    id: "collection-public-detail",
    role: "user",
    route: "/collections/public/col-1",
    waitFor: (page) => expect(page.getByRole("heading", { level: 1, name: "Mock Collection" })).toBeVisible(),
  },
  {
    id: "collection-session-config",
    role: "user",
    route: "/collections/public/col-1/session/config",
    waitFor: (page) => expect(page.getByRole("heading", { name: "New collection session" })).toBeVisible(),
  },
  {
    id: "collections-my",
    role: "user",
    route: "/collections/my",
    waitFor: (page) => expect(page.getByRole("heading", { name: "My Collections" })).toBeVisible(),
  },
  {
    id: "collection-my-edit",
    role: "user",
    route: "/collections/my/col-1/edit",
    waitFor: (page) => expect(page.getByRole("heading", { name: "Edit collection" })).toBeVisible(),
  },
  {
    id: "profile",
    role: "user",
    route: "/profile",
    waitFor: (page) => expect(page.getByRole("heading", { name: "My Profile" })).toBeVisible(),
  },
  {
    id: "author-profile",
    role: "user",
    route: "/users/author-1?username=author1",
    waitFor: (page) => expect(page.getByRole("heading", { name: "Author profile" })).toBeVisible(),
  },
  {
    id: "admin",
    role: "admin",
    route: "/admin",
    waitFor: (page) => expect(page.getByRole("heading", { name: "Admin panel" })).toBeVisible(),
  },
  {
    id: "admin-review-collections",
    role: "admin",
    route: "/admin/review-collections",
    waitFor: (page) => expect(page.getByRole("heading", { name: "Review question collections" })).toBeVisible(),
  },
  {
    id: "admin-approve-questions",
    role: "admin",
    route: "/admin/approve-questions",
    waitFor: (page) => expect(page.getByRole("heading", { name: "Pending approvals" })).toBeVisible(),
  },
  {
    id: "admin-generate-question",
    role: "admin",
    route: "/admin/generate-question",
    waitFor: (page) => expect(page.getByRole("heading", { name: "Generate question with AI" })).toBeVisible(),
  },
  {
    id: "admin-users",
    role: "admin",
    route: "/admin/users",
    waitFor: (page) => expect(page.getByRole("heading", { name: "Manage users" })).toBeVisible(),
  },
];

const resolveOutputRoot = () => {
  const configured = businessTestEnv.screenshotDir.trim();
  if (!configured) {
    return path.resolve(process.cwd(), "artifacts", "screenshots");
  }
  if (path.isAbsolute(configured)) {
    return configured;
  }
  return path.resolve(process.cwd(), configured);
};

const parseFilter = () => {
  const filter = businessTestEnv.screenshotFilter.trim();
  if (!filter) {
    return null;
  }
  return new Set(
    filter
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean)
  );
};

const screenshotOutputRoot = resolveOutputRoot();
const screenshotFilter = parseFilter();

const isIncluded = (screenshotCase: ScreenshotCase) => {
  if (!screenshotFilter || screenshotFilter.size === 0) {
    return true;
  }

  return screenshotFilter.has(screenshotCase.id) || screenshotFilter.has(screenshotCase.role);
};

const disableAnimations = async (page: Page) => {
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    `,
  });
};

test.describe("Core flow screenshots", () => {
  for (const [index, screenshotCase] of screenshotCases.entries()) {
    test(`captures ${screenshotCase.id}`, async ({ page }, testInfo) => {
      test.skip(!isIncluded(screenshotCase), `Filtered by PLAYWRIGHT_SCREENSHOT_FILTER=${businessTestEnv.screenshotFilter}`);

      await withSession(page, screenshotCase.role);
      await installApiMocks(page, screenshotCase.apiMockOptions);

      await page.goto(screenshotCase.route);
      if (screenshotCase.preScreenshot) {
        await screenshotCase.preScreenshot(page);
      }
      await screenshotCase.waitFor(page);

      try {
        await page.waitForLoadState("networkidle", { timeout: 2_000 });
      } catch {
        // Some pages keep polling; this best-effort wait is only for visual stability.
      }

      await disableAnimations(page);
      await page.waitForTimeout(150);

      const projectOutputDir = path.join(screenshotOutputRoot, testInfo.project.name);
      fs.mkdirSync(projectOutputDir, { recursive: true });
      const fileName = `${String(index + 1).padStart(2, "0")}-${screenshotCase.id}.png`;
      const outputPath = path.join(projectOutputDir, fileName);

      await page.screenshot({
        path: outputPath,
      });
    });
  }
});
