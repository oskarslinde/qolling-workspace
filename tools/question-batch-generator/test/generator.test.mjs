import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildDifficultyPlan } from "../src/difficulty.mjs";
import { exportMongoFiles, toMongoDocument } from "../src/exportMongo.mjs";
import { generateBatch } from "../src/generator.mjs";
import { buildQuestionPrompt } from "../src/prompts.mjs";
import { questionHash } from "../src/utils.mjs";
import { validateQuestions } from "../src/validation.mjs";

test("buildDifficultyPlan follows the configured 2000-question mix", () => {
  const plan = buildDifficultyPlan(2000);
  const counts = plan.reduce((acc, difficulty) => {
    acc[difficulty] = (acc[difficulty] ?? 0) + 1;
    return acc;
  }, {});

  assert.equal(counts[1], 700);
  assert.equal(counts[2], 700);
  assert.equal(counts[3], 400);
  assert.equal(counts[4], 140);
  assert.equal(counts[5], 60);
});

test("buildQuestionPrompt includes fun fact curiosity guidance", () => {
  const prompt = buildQuestionPrompt({
    category: "Science",
    difficulty: 3,
    index: 0,
    topic: "space weather",
  });

  assert.match(prompt, /curiosity and surprise of a fun fact/);
  assert.match(prompt, /do not routinely include "did you know"/);
  assert.match(prompt, /If answerSource is a website, include a link when available/);
});

test("validateQuestions rejects duplicate hashes and invalid answer sets", async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "qolling-generator-"));
  try {
    const { reviewFile } = await generateBatch({ count: 2, outputDir: temp, dryRun: true });
    const questions = JSON.parse(await readFile(reviewFile, "utf8"));
    questions[1] = { ...questions[0], answers: questions[0].answers.map((answer) => ({ ...answer })) };
    questions[1].answers[1].correct = true;

    const results = await validateQuestions(questions, { outputDir: temp });
    assert.equal(results[0].valid, true);
    assert.equal(results[1].valid, false);
    assert.match(results[1].errors.join(" "), /exactly one correct answer/);
    assert.match(results[1].errors.join(" "), /duplicate question hash/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("exportMongoFiles writes only valid app-supported fields", async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "qolling-generator-"));
  try {
    const { reviewFile } = await generateBatch({ count: 3, outputDir: temp, dryRun: true });
    const questions = JSON.parse(await readFile(reviewFile, "utf8"));
    const result = await exportMongoFiles(questions, {
      outputDir: temp,
      outputFile: path.join(temp, "questions.mongo.jsonl"),
      chunkSize: 2,
      now: "2026-05-01T00:00:00.000Z",
    });

    assert.equal(result.exportedCount, 3);
    assert.equal(result.chunkFiles.length, 2);

    const lines = (await readFile(result.outputFile, "utf8")).trim().split("\n");
    const doc = JSON.parse(lines[0]);
    assert.equal(doc.draft, false);
    assert.equal(doc.totalAnswers, 0);
    assert.equal(doc.imagePrompt, undefined);
    assert.equal(doc.model, undefined);
    assert.equal(doc.answers.length, 4);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("toMongoDocument maps defaults and questionHash is stable", () => {
  const question = {
    question: "Why does bread brown?",
    answers: [
      { text: "Maillard reactions", correct: true },
      { text: "Freezing", correct: false },
      { text: "Magnetism", correct: false },
      { text: "Evaporation only", correct: false },
    ],
    answerDescription: "Heat causes browning chemistry.",
    answerSource: "Harold McGee, On Food and Cooking",
    imageUrl: "images/bread.webp",
    difficulty: 2,
    categories: ["Food and Cooking"],
    tags: ["baking"],
  };

  const doc = toMongoDocument(question, { now: "2026-05-01T00:00:00.000Z" });
  assert.equal(doc.createdBy, "system-seed");
  assert.equal(doc.approvedBy, "system-seed");
  assert.equal(questionHash(question), questionHash({ ...question, answers: [...question.answers].reverse() }));
});
