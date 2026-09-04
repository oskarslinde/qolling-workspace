import { expect, type Page, type Route, test } from "@playwright/test";
import { installApiMocks, withSession } from "../support/apiMocks";

const buildJwt = (payload: Record<string, unknown>) => {
  const encode = (value: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "none", typ: "JWT" })}.${encode(payload)}.`;
};

const asJson = async (route: Route, body: unknown, status = 200) => {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
};

const seedCollectionSession = async (
  page: Page,
  {
    sessionId,
    completed = false,
    endedReason = "completed",
  }: { sessionId: string; completed?: boolean; endedReason?: "completed" | "ended" },
) => {
  const now = "2026-01-03T10:00:00Z";
  const session = {
    id: sessionId,
    collectionId: "col-1",
    collectionName: "Mock Collection",
    config: {
      questionLimit: "5",
      order: "random",
      loop: false,
      shuffleAnswers: false,
    },
    questions: [
      {
        questionId: "q-1",
        text: "What is 2 + 2?",
        answers: ["3", "4", "5", "6"],
        correctAnswerIndex: 1,
        originalCorrectAnswerIndex: 1,
        originalIndexByShuffledIndex: [0, 1, 2, 3],
        correctAnswerText: "4",
        answerDescription: "Basic arithmetic",
        answerSource: "Mock source",
        tags: ["basics"],
        categories: ["Math"],
        difficulty: 2,
        createdByUsername: "author1",
        createdByUserId: "author-1",
        imageUrl: "",
      },
    ],
    sequence: ["q-1"],
    currentIndex: 0,
    cycle: 0,
    stepResults: completed
      ? {
        "0:0": {
          questionId: "q-1",
          selectedAnswerIndex: 1,
          selectedOriginalAnswerIndex: 1,
          correct: true,
          correctAnswer: "4",
          answerDescription: "Basic arithmetic",
          answerSource: "Mock source",
          questionText: "What is 2 + 2?",
        },
      }
      : {},
    completedAt: completed ? now : null,
    endedReason: completed ? endedReason : null,
    startedAt: now,
  };

  await page.addInitScript((payload) => {
    const storageKey = `qolling.collection-learning-session.${payload.sessionId}`;
    window.sessionStorage.setItem(storageKey, JSON.stringify(payload.session));
  }, { sessionId, session });
};

test.describe("Business Page Coverage - Public And Onboarding", () => {
  test("covers legal pages and OAuth failure state", async ({ page }) => {
    await withSession(page, "guest");
    await installApiMocks(page);

    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: "Terms and Conditions" })).toBeVisible();

    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();

    await page.goto("/oauth/callback?oauthError=Access+Denied");
    await expect(page.getByRole("heading", { name: "OAuth login failed" })).toBeVisible();
  });

  test("covers OAuth success and onboarding redirection states", async ({ page }) => {
    await withSession(page, "guest");
    await installApiMocks(page);

    const oauthToken = buildJwt({ sub: "user-1", username: "learner", roles: ["USER"] });
    await page.goto(`/oauth/callback?accessToken=${encodeURIComponent(oauthToken)}&refreshToken=refresh-token`);
    await expect(page).toHaveURL(/\/home$/);

    await withSession(page, "user", { requiresOnboarding: true, requiresTermsAcceptance: true });
    await page.goto("/home");
    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByRole("button", { name: "Accept and continue" })).toBeVisible();
  });
});

test.describe("Business Page Coverage - User Pages And State Variations", () => {
  test("covers draft questions empty and populated states", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);

    await page.goto("/questions/draft");
    await expect(page.getByText("No drafts yet. Create a question to get started.")).toBeVisible();

    await page.route("**/v1/questions/drafts", async (route) => {
      await asJson(route, [{
        id: "draft-1",
        question: "Drafted business question",
        updatedAt: "2026-01-04T10:00:00Z",
      }]);
    });

    await page.goto("/questions/draft");
    await expect(page.getByText("Drafted business question")).toBeVisible();
    await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
  });

  test("covers collection detail and session config variants", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);

    await page.goto("/collections/my/col-1");
    await expect(page.getByRole("heading", { level: 1, name: "Mock Collection" })).toBeVisible();

    await page.goto("/collections/public/col-1/session/config");
    await expect(page.getByRole("button", { name: "Start session" })).toBeVisible();

    await page.route("**/v1/question-collections/col-1/play-questions", async (route) => {
      await asJson(route, []);
    });

    await page.goto("/collections/public/col-1/session/config");
    await expect(page.getByText("This collection does not contain any questions yet.")).toBeVisible();
  });

  test("covers collection session history, play, and results pages", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);

    await page.goto("/collections/public/col-1/session/history");
    await expect(page.getByRole("heading", { name: "Session history" })).toBeVisible();
    await expect(page.getByRole("button", { name: "View results" })).toBeVisible();

    await seedCollectionSession(page, { sessionId: "session-1", completed: false });
    await page.goto("/collections/public/col-1/session/session-1/play");
    await expect(page.getByText("What is 2 + 2?")).toBeVisible();
    await expect(page.getByRole("button", { name: "Skip question" })).toBeVisible();

    await seedCollectionSession(page, { sessionId: "session-1", completed: true, endedReason: "completed" });
    await page.goto("/collections/public/col-1/session/session-1/results");
    await expect(page.getByRole("heading", { name: "Session results" })).toBeVisible();
    await expect(page.getByText("Answered")).toBeVisible();
  });

  test("covers messaging surfaces and empty-state variants", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);

    await page.goto("/messages");
    await expect(page.getByRole("heading", { name: "Messages" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Inbox" })).toBeVisible();

    await page.goto("/messages/friends");
    await expect(page.getByRole("heading", { name: "Friends" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Friend requests" })).toBeVisible();

    await page.goto("/feed");
    await expect(page.getByRole("heading", { name: "Friend activity feed" })).toBeVisible();

    await page.goto("/messages/friends/feed");
    await expect(page.getByRole("heading", { name: "Friend activity feed" })).toBeVisible();

    await page.goto("/messages/threads/friend-1");
    await expect(page.getByRole("button", { name: "Send reply" })).toBeVisible();

    await page.goto("/messages/threads/SYSTEM");
    await expect(page.getByText("This thread is read-only.")).toBeVisible();

    await page.route("**/v1/messages/threads", async (route) => {
      await asJson(route, []);
    });
    await page.goto("/messages");
    await expect(page.getByText("No messages yet.")).toBeVisible();

    await page.route("**/v1/friends/feed", async (route) => {
      await asJson(route, []);
    });
    await page.goto("/feed");
    await expect(page.getByText("No friend activity yet.")).toBeVisible();

    await page.route("**/v1/friends", async (route) => {
      await asJson(route, []);
    });
    await page.goto("/messages/send");
    await expect(page.getByText("You do not have any friends yet.")).toBeVisible();
  });

  test("covers /users route no-target state", async ({ page }) => {
    await withSession(page, "user");
    await installApiMocks(page);

    await page.goto("/users");
    await expect(page.getByText("Author profile is unavailable for this question right now.")).toBeVisible();
  });
});

test.describe("Business Page Coverage - Admin And Placeholder Routes", () => {
  test("covers admin badges, user detail, and placeholder routes", async ({ page }) => {
    await withSession(page, "admin");
    await installApiMocks(page);

    await page.goto("/admin/badges");
    await expect(page.getByRole("heading", { name: "Badge catalog" })).toBeVisible();
    await expect(page.getByText("Collector")).toBeVisible();

    await page.goto("/admin/users/user-1");
    await expect(page.getByRole("heading", { level: 1, name: "Learner Example" })).toBeVisible();
    await expect(page.getByText("Recent interactions")).toBeVisible();

    await page.goto("/admin/questions");
    await expect(page.getByText("Manage questions")).toBeVisible();

    await page.goto("/config");
    await expect(page.getByText("Configuration")).toBeVisible();
  });

  test("covers admin system message publish flow", async ({ page }) => {
    await withSession(page, "admin");
    await installApiMocks(page);

    await page.goto("/admin/system-messages");
    await page.getByRole("textbox", { name: "Message" }).fill("Platform maintenance starts at 23:00 UTC.");
    await page.getByRole("button", { name: "Publish message" }).click();
    await expect(page.getByText("System message published to 42 users.")).toBeVisible();
  });

  test("covers admin batch generation routes and terminal state", async ({ page }) => {
    await withSession(page, "admin");
    await installApiMocks(page);

    await page.goto("/admin/generate-question-images");
    await expect(page.getByRole("heading", { name: "Generate question and images" })).toBeVisible();
    await page.getByRole("button", { name: "Start batch" }).click();
    await expect(page.getByText("Batch ready for review")).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: "Start another batch" }).click();
    await expect(page.getByRole("button", { name: "Start batch" })).toBeVisible();

    await page.goto("/admin/generate-questions-find-images");
    await expect(page.getByRole("heading", { name: "Generate questions and find images" })).toBeVisible();
    await expect(page.getByText("Image provider")).toBeVisible();
  });
});
