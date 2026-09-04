import { writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_APPROVED_BY, DEFAULT_CHUNK_SIZE, DEFAULT_CREATED_BY } from "./constants.mjs";
import { ensureDir, isoNow } from "./utils.mjs";
import { validateQuestions } from "./validation.mjs";

const MONGO_FIELDS = new Set([
  "question",
  "answers",
  "answerDescription",
  "answerSource",
  "imageUrl",
  "difficulty",
  "categories",
  "tags",
  "createdBy",
  "createdAt",
  "approvedBy",
  "approvedAt",
  "draft",
  "totalAnswers",
  "correctAnswers",
  "wrongAnswers",
  "version",
]);

export async function exportMongoFiles(questions, options = {}) {
  const outputDir = options.outputDir ?? process.cwd();
  const outputFile = options.outputFile ?? path.join(outputDir, "questions.mongo.jsonl");
  const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const logger = options.logger;
  logInfo(logger, `Validating ${questions.length} review question${questions.length === 1 ? "" : "s"} before Mongo export`);
  const validation = await validateQuestions(questions, { outputDir });
  const validIndexes = new Set(validation.filter((item) => item.valid).map((item) => item.index));
  const now = options.now ?? isoNow();
  const rejected = validation.filter((item) => !item.valid);
  logInfo(logger, `Validation complete: valid=${validIndexes.size}, rejected=${rejected.length}`);
  for (const item of rejected.slice(0, 20)) {
    logInfo(logger, `Rejected #${item.index + 1}: ${item.errors.join("; ")}`);
  }
  if (rejected.length > 20) {
    logInfo(logger, `Additional rejected questions omitted from log: ${rejected.length - 20}`);
  }

  const docs = questions
    .filter((_, index) => validIndexes.has(index))
    .map((question) => toMongoDocument(question, { now, options }));

  await ensureDir(path.dirname(outputFile));
  await writeFile(outputFile, docs.map((doc) => JSON.stringify(doc)).join("\n") + (docs.length ? "\n" : ""), "utf8");
  logInfo(logger, `Wrote Mongo JSONL file ${outputFile}`);

  const chunkFiles = [];
  for (let start = 0; start < docs.length; start += chunkSize) {
    const chunk = docs.slice(start, start + chunkSize);
    const chunkNumber = String(chunkFiles.length + 1).padStart(4, "0");
    const chunkFile = path.join(path.dirname(outputFile), `questions.mongo.part-${chunkNumber}.jsonl`);
    await writeFile(chunkFile, chunk.map((doc) => JSON.stringify(doc)).join("\n") + "\n", "utf8");
    chunkFiles.push(chunkFile);
    logInfo(logger, `Wrote chunk ${chunkNumber} with ${chunk.length} document${chunk.length === 1 ? "" : "s"}: ${chunkFile}`);
  }

  return {
    outputFile,
    chunkFiles,
    exportedCount: docs.length,
    rejectedCount: questions.length - docs.length,
    validation,
  };
}

function logInfo(logger, message) {
  logger?.info?.(message);
}

export function toMongoDocument(question, { now = isoNow(), options = {} } = {}) {
  const createdAt = question.createdAt ?? now;
  const approvedAt = question.approvedAt ?? now;
  const doc = {
    question: question.question,
    answers: question.answers.map((answer) => ({ text: answer.text, correct: Boolean(answer.correct) })),
    answerDescription: question.answerDescription,
    answerSource: question.answerSource,
    imageUrl: question.imageUrl,
    difficulty: question.difficulty,
    categories: [...question.categories],
    tags: [...question.tags],
    createdBy: question.createdBy ?? options.createdBy ?? DEFAULT_CREATED_BY,
    createdAt,
    approvedBy: question.approvedBy ?? options.approvedBy ?? DEFAULT_APPROVED_BY,
    approvedAt,
    draft: false,
    totalAnswers: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    // Keep optimistic locking compatible with Zeus @Version fields.
    version: { $numberLong: "0" },
  };

  return Object.fromEntries(Object.entries(doc).filter(([key]) => MONGO_FIELDS.has(key)));
}
