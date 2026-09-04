import fs from "node:fs";
import path from "node:path";
import { expect, type Locator, type Page, test } from "@playwright/test";
import { loginWithPassword } from "../support/auth";
import { businessTestEnv } from "../support/env";

const COLLECTION_NAME = "TEST 2";

const resolveScreenshotDirectory = (projectName: string) => {
  const configuredRoot = businessTestEnv.screenshotDir.trim() || "artifacts/screenshots";
  const root = path.isAbsolute(configuredRoot)
    ? configuredRoot
    : path.resolve(process.cwd(), configuredRoot);

  return path.join(root, "test-2-collection-session", projectName);
};

const prepareScreenshotDirectory = (projectName: string) => {
  const outputDirectory = resolveScreenshotDirectory(projectName);
  fs.mkdirSync(outputDirectory, { recursive: true });

  for (const entry of fs.readdirSync(outputDirectory, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".png")) {
      fs.rmSync(path.join(outputDirectory, entry.name));
    }
  }
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

const captureStep = async (page: Page, projectName: string, fileName: string) => {
  await page.waitForLoadState("domcontentloaded");
  await page.getByRole("status").filter({ hasText: /loading/i }).waitFor({ state: "hidden" });
  await page.locator('[aria-busy="true"]').waitFor({ state: "hidden" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map(
        (image) =>
          image.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                image.addEventListener("load", () => resolve(), { once: true });
                image.addEventListener("error", () => resolve(), { once: true });
              })
      )
    );
  });
  await disableAnimations(page);
  await page.waitForTimeout(300);

  const outputDirectory = resolveScreenshotDirectory(projectName);
  fs.mkdirSync(outputDirectory, { recursive: true });

  await page.screenshot({ path: path.join(outputDirectory, fileName) });
};

const readQuestionCount = async (page: Page) => {
  const progress = page.getByText(/^Question 1 of \d+$/);
  await expect(progress).toBeVisible();

  const match = (await progress.textContent())?.match(/^Question 1 of (\d+)$/);
  if (!match) {
    throw new Error("Unable to determine the selected TEST 2 question count.");
  }

  return Number.parseInt(match[1], 10);
};

const expectBelowStickyNavigation = async (page: Page, target: Locator) => {
  const navigation = page.locator("nav.app-navbar");
  await expect(navigation).toBeVisible();
  await expect(target).toBeVisible();

  await expect.poll(async () => {
    const [navigationBox, targetBox] = await Promise.all([
      navigation.boundingBox(),
      target.boundingBox(),
    ]);

    if (!navigationBox || !targetBox) {
      return false;
    }

    return targetBox.y >= navigationBox.y + navigationBox.height - 1;
  }, {
    message: "Expected active session content to start below the sticky navigation",
  }).toBe(true);
};

const answerCurrentQuestion = async (page: Page) => {
  const multiSelectInstruction = page.getByText("Select all that apply.", { exact: true });
  const isMultiSelect = await multiSelectInstruction.isVisible();
  const answerGroup = page.getByRole("group", {
    name: isMultiSelect ? "Multiple-answer choices" : "Single-answer choices",
  });
  const options = answerGroup.getByRole("button");

  await expect(answerGroup).toBeVisible();

  if (isMultiSelect) {
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThan(1);

    const firstOption = options.first();
    const lastOption = options.last();
    await firstOption.click();
    await lastOption.click();
    await expect(firstOption).toHaveAttribute("aria-pressed", "true");
    await expect(lastOption).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("alert").filter({ hasText: /Correct|Not quite/ })).toHaveCount(0);
    await page.getByRole("button", { name: "Check answers" }).click();
  } else {
    await expect(page.getByText("Choose one answer.", { exact: true })).toBeVisible();
    await options.first().click();
  }

  const feedback = page.getByRole("alert").filter({ hasText: /Correct|Not quite/ });
  await expect(feedback).toBeVisible();
  const optionCount = await options.count();
  for (let optionIndex = 0; optionIndex < optionCount; optionIndex += 1) {
    await expect(options.nth(optionIndex)).toBeDisabled();
  }

  const feedbackText = (await feedback.textContent()) || "";
  if (/^Correct/.test(feedbackText.trim())) {
    await expect(answerGroup.getByText("Your answer · Correct", { exact: true }).first()).toBeVisible();
    await expect(answerGroup.getByText("Your answer · Incorrect", { exact: true })).toHaveCount(0);
  } else {
    await expect(feedback).toContainText("Not quite");
    const identifiedCorrectAnswers = answerGroup.getByText(/^(Your answer · Correct|Correct answer)$/);
    await expect(identifiedCorrectAnswers.first()).toBeVisible();
  }
};

const readResultMetric = async (page: Page, label: string) => {
  const value = page.getByText(label, { exact: true }).locator("xpath=following-sibling::p");
  await expect(value).toBeVisible();
  return Number.parseInt((await value.textContent())?.trim() || "", 10);
};

const stepFileName = (stepNumber: number, name: string) =>
  `${String(stepNumber).padStart(3, "0")}-${name}`;

test.describe("TEST 2 collection session", () => {
  test("user completes TEST 2 with a UI/UX screenshot at every workflow state", async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    test.skip(
      !businessTestEnv.userEmail || !businessTestEnv.userPassword,
      "Missing PLAYWRIGHT_USER_EMAIL or PLAYWRIGHT_USER_PASSWORD in business-tests/.env"
    );
    prepareScreenshotDirectory(testInfo.project.name);

    await loginWithPassword(page, businessTestEnv.userEmail, businessTestEnv.userPassword);
    await expect(page).toHaveURL(/\/home(?:$|[?#])/);
    await expect(page.getByRole("group", { name: /answer choices/i })).toBeVisible();
    await captureStep(page, testInfo.project.name, stepFileName(1, "logged-in-home.png"));

    await page.goto("/collections/public");
    await expect(page.getByRole("heading", { name: "Public Collections" })).toBeVisible();
    const collectionCard = page.getByRole("button", { name: new RegExp(COLLECTION_NAME, "i") });
    await expect(collectionCard).toBeVisible();
    await captureStep(page, testInfo.project.name, stepFileName(2, "public-collections.png"));

    await page.getByRole("button", { name: "Filters" }).click();
    await page.getByRole("textbox", { name: "Search public collections" }).fill(COLLECTION_NAME);
    await page.getByRole("button", { name: "Search" }).click();

    await expect(collectionCard).toBeVisible();
    await collectionCard.click();
    await expect(page).toHaveURL(/\/collections\/public\/[^/]+$/);
    await expect(page.getByRole("heading", { level: 1, name: COLLECTION_NAME })).toBeVisible();
    await captureStep(
      page,
      testInfo.project.name,
      stepFileName(3, "test-2-collection-detail.png")
    );

    await page.getByRole("button", { name: "New session" }).click();
    await expect(page.getByRole("heading", { name: "New collection session" })).toBeVisible({ timeout: 20_000 });
    await page.getByRole("combobox", { name: "Questions" }).click();
    await page.getByRole("option", { name: "All questions" }).click();
    await page.getByRole("combobox", { name: "Order" }).click();
    await page.getByRole("option", { name: "Sequential" }).click();
    const shuffleAnswers = page.getByRole("checkbox", { name: "Shuffle answer order" });
    if (await shuffleAnswers.isChecked()) {
      await shuffleAnswers.uncheck();
    }
    await captureStep(page, testInfo.project.name, stepFileName(4, "session-config.png"));

    await page.getByRole("button", { name: "Start session" }).click();
    const questionCount = await readQuestionCount(page);

    for (let questionNumber = 1; questionNumber <= questionCount; questionNumber += 1) {
      await expect(page.getByText(new RegExp(`^Question ${questionNumber} of ${questionCount}$`))).toBeVisible();
      await expectBelowStickyNavigation(page, page.getByRole("heading", { level: 3 }).first());
      const beforeAnswerStep = 5 + (questionNumber - 1) * 2;
      const prefix = String(questionNumber).padStart(2, "0");
      await captureStep(
        page,
        testInfo.project.name,
        stepFileName(beforeAnswerStep, `question-${prefix}-before-answer.png`)
      );

      await answerCurrentQuestion(page);
      await captureStep(
        page,
        testInfo.project.name,
        stepFileName(beforeAnswerStep + 1, `question-${prefix}-answer-feedback.png`)
      );

      await page.getByRole("button", { name: "Next question" }).click();
    }

    await expect(page).toHaveURL(/\/collections\/public\/[^/]+\/session\/[^/]+\/results$/);
    const resultsHeading = page.getByRole("heading", { level: 1, name: "Session results" });
    await expectBelowStickyNavigation(page, resultsHeading);
    await expect(page.getByRole("region", { name: "Session performance" })).toBeVisible();
    await expect(page.getByText("Session details", { exact: true })).toBeVisible();
    await expect(page.getByText("Question limit", { exact: true })).toBeHidden();

    const answeredCount = await readResultMetric(page, "Answered");
    const correctCount = await readResultMetric(page, "Correct");
    const incorrectCount = await readResultMetric(page, "Incorrect");
    const skippedCount = await readResultMetric(page, "Skipped");

    expect(answeredCount).toBe(questionCount);
    expect(correctCount + incorrectCount).toBe(answeredCount);
    expect(skippedCount).toBe(0);
    await captureStep(
      page,
      testInfo.project.name,
      stepFileName(5 + questionCount * 2, "session-results.png")
    );
  });
});
