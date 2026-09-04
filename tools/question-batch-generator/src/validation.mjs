import { access } from "node:fs/promises";
import path from "node:path";
import { CATEGORIES } from "./constants.mjs";
import { normalizeText, questionHash } from "./utils.mjs";

const VAGUE_PATTERNS = [
  /^what is true about\b/i,
  /^which statement is true\b/i,
  /^which of these is correct\b/i,
  /^what can be said about\b/i,
];

const WEAK_SOURCE_PATTERNS = [
  /^source:?$/i,
  /^internet$/i,
  /^google$/i,
  /^wikipedia$/i,
  /^various sources$/i,
  /^common knowledge$/i,
];

const COPYRIGHTY_PATTERNS = [
  /\bdisney\b/i,
  /\bmarvel\b/i,
  /\bpokemon\b/i,
  /\bharry potter\b/i,
  /\bstar wars\b/i,
  /\bminecraft\b/i,
  /\bfortnite\b/i,
];

export async function validateQuestions(questions, { outputDir = process.cwd() } = {}) {
  if (!Array.isArray(questions)) {
    throw new Error("Input must be a JSON array of questions");
  }

  const seen = new Set();
  const results = [];

  for (const [index, question] of questions.entries()) {
    const errors = await validateQuestion(question, { seen, index, outputDir });
    const duplicateHash = questionHash(question);
    seen.add(duplicateHash);
    results.push({
      index,
      question: question.question ?? "",
      duplicateHash,
      valid: errors.length === 0,
      errors,
    });
  }

  return results;
}

export async function validateQuestion(question, { seen = new Set(), index = 0, outputDir = process.cwd() } = {}) {
  const errors = [];

  if (!question || typeof question !== "object") {
    return ["question must be an object"];
  }

  requireNonBlank(question.question, "question", errors);
  requireNonBlank(question.answerDescription, "answerDescription", errors);
  requireNonBlank(question.answerSource, "answerSource", errors);
  requireNonBlank(question.imageUrl, "imageUrl", errors);

  if (!Number.isInteger(question.difficulty) || question.difficulty < 1 || question.difficulty > 5) {
    errors.push("difficulty must be an integer from 1 to 5");
  }

  validateStringArray(question.tags, "tags", errors);
  validateStringArray(question.categories, "categories", errors);
  if (Array.isArray(question.categories)) {
    const unknown = question.categories.filter((category) => !CATEGORIES.includes(category));
    if (unknown.length > 0) {
      errors.push(`categories contain unsupported values: ${unknown.join(", ")}`);
    }
  }

  validateAnswers(question.answers, errors);
  validateQualityRules(question, errors);

  const duplicateHash = questionHash(question);
  if (seen.has(duplicateHash)) {
    errors.push(`duplicate question hash: ${duplicateHash}`);
  }

  if (question.imageUrl) {
    const imagePath = path.isAbsolute(question.imageUrl)
      ? question.imageUrl
      : path.resolve(outputDir, question.imageUrl);
    try {
      await access(imagePath);
    } catch {
      errors.push(`image file does not exist: ${question.imageUrl}`);
    }
  }

  if (question.createdBy !== undefined) {
    requireNonBlank(question.createdBy, "createdBy", errors);
  }
  if (question.approvedBy !== undefined) {
    requireNonBlank(question.approvedBy, "approvedBy", errors);
  }

  if (index < 0) {
    errors.push("index cannot be negative");
  }

  return errors;
}

function requireNonBlank(value, field, errors) {
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${field} must be a non-empty string`);
  }
}

function validateStringArray(value, field, errors) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${field} must be a non-empty array`);
    return;
  }

  if (value.some((item) => typeof item !== "string" || !item.trim())) {
    errors.push(`${field} must contain only non-empty strings`);
  }
}

function validateAnswers(answers, errors) {
  if (!Array.isArray(answers) || answers.length !== 4) {
    errors.push("answers must contain exactly 4 answers");
    return;
  }

  const correctCount = answers.filter((answer) => answer?.correct === true).length;
  if (correctCount !== 1) {
    errors.push("answers must contain exactly one correct answer");
  }

  const normalized = answers.map((answer) => normalizeText(answer?.text));
  if (normalized.some((answer) => !answer)) {
    errors.push("answer text must be non-empty");
  }

  if (new Set(normalized).size !== normalized.length) {
    errors.push("answers must not contain duplicate text");
  }
}

function validateQualityRules(question, errors) {
  const questionText = question.question ?? "";
  if (VAGUE_PATTERNS.some((pattern) => pattern.test(questionText))) {
    errors.push("question wording is too vague");
  }

  const source = String(question.answerSource ?? "").trim();
  if (source.length < 12 || WEAK_SOURCE_PATTERNS.some((pattern) => pattern.test(source))) {
    errors.push("answerSource is too weak");
  }

  const generationText = [
    question.question,
    question.answerDescription,
    question.imagePrompt,
    ...(Array.isArray(question.tags) ? question.tags : []),
  ].join(" ");

  if (COPYRIGHTY_PATTERNS.some((pattern) => pattern.test(generationText))) {
    errors.push("content references protected entertainment IP; use neutral educational imagery");
  }

  if (/\b(your|my|i like|favorite color|personal preference)\b/i.test(questionText)) {
    errors.push("question appears to ask for personal preference rather than educational knowledge");
  }
}

