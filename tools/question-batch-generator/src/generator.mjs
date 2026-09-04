import { rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  CATEGORIES,
  DEFAULT_APPROVED_BY,
  DEFAULT_CREATED_BY,
  DEFAULT_IMAGE_MODEL,
  DEFAULT_IMAGE_QUALITY,
  DEFAULT_IMAGE_SIZE,
  DEFAULT_TEXT_MODEL,
} from "./constants.mjs";
import { buildDifficultyPlan } from "./difficulty.mjs";
import { buildDryRunPictureQuestion, buildDryRunQuestion, dryRunImageBytes } from "./dryRunFixtures.mjs";
import { buildImagePrompt, buildPictureQuestionPrompt, buildQuestionPrompt } from "./prompts.mjs";
import { downloadFirstImage, findGoogleImage } from "./googleImageSearch.mjs";
import { generateImageWithOpenAI, generateQuestionWithOpenAI } from "./openaiClient.mjs";
import { ensureDir, isoNow, questionHash, slugify, writeJson, writeJsonLine } from "./utils.mjs";
import { validateQuestion } from "./validation.mjs";

export async function generateBatch(options) {
  const count = options.count;
  const outputDir = options.outputDir;
  const imagesDir = path.join(outputDir, "images");
  const textModel = options.textModel ?? DEFAULT_TEXT_MODEL;
  const imageModel = options.imageModel ?? DEFAULT_IMAGE_MODEL;
  const imageSize = options.imageSize ?? DEFAULT_IMAGE_SIZE;
  const imageQuality = options.imageQuality ?? DEFAULT_IMAGE_QUALITY;
  const createdBy = options.createdBy ?? DEFAULT_CREATED_BY;
  const approvedBy = options.approvedBy ?? DEFAULT_APPROVED_BY;
  const startIndex = options.startIndex ?? 0;
  const dryRun = Boolean(options.dryRun);
  const mode = options.mode ?? "standard";
  if (!["standard", "picture-search"].includes(mode)) {
    throw new Error(`Unsupported generate mode: ${mode}`);
  }
  const logger = options.logger;
  const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
  const googleApiKey = options.googleApiKey ?? process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const googleSearchEngineId = options.googleSearchEngineId ?? process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;
  const auditFile = path.join(outputDir, "audit.jsonl");
  const reviewFile = path.join(outputDir, "questions.review.json");
  const seen = new Set();
  const questions = [];
  const difficultyPlan = buildDifficultyPlan(count);

  await ensureDir(imagesDir);
  if (options.clean) {
    logInfo(logger, `Cleaning output directory: ${outputDir}`);
    await rm(outputDir, { recursive: true, force: true });
    await ensureDir(imagesDir);
  }

  logInfo(
    logger,
    `Starting batch: count=${count}, startIndex=${startIndex}, mode=${mode}, textModel=${textModel}, imageModel=${imageModel}, imageSize=${imageSize}, imageQuality=${imageQuality}, dryRun=${dryRun}`,
  );

  for (let offset = 0; offset < count; offset += 1) {
    const index = startIndex + offset;
    const category = CATEGORIES[index % CATEGORIES.length];
    const difficulty = difficultyPlan[offset];
    const pictureSearchMode = mode === "picture-search";
    const prompt = pictureSearchMode
      ? buildPictureQuestionPrompt({ category, difficulty, index, topic: options.topic })
      : buildQuestionPrompt({ category, difficulty, index, topic: options.topic });
    const label = `#${index + 1} (${offset + 1}/${count}, ${category}, difficulty ${difficulty})`;
    logInfo(logger, `${label}: generating question`);
    const generated = dryRun
      ? pictureSearchMode
        ? buildDryRunPictureQuestion({ category, difficulty })
        : buildDryRunQuestion({ category, difficulty })
      : await generateQuestionWithOpenAI({ apiKey, model: textModel, prompt });

    const question = normalizeGeneratedQuestion(generated, {
      category,
      difficulty,
      createdBy,
      approvedBy,
      now: isoNow(),
    });

    const imagePrompt = pictureSearchMode ? "" : buildImagePrompt(question);
    const imageSlug = `${String(index + 1).padStart(5, "0")}-${slugify(question.question)}`;
    const imageResult = pictureSearchMode
      ? await resolveSearchImage({
          dryRun,
          googleApiKey,
          googleSearchEngineId,
          query: question.imageSearchQuery,
          googleSafe: options.googleSafe,
          googleRights: options.googleRights,
          googleImageType: options.googleImageType,
          googleResultCount: options.googleResultCount,
          imageSlug,
          label,
          logger,
        })
      : await resolveGeneratedImage({
          dryRun,
          apiKey,
          imageModel,
          imagePrompt,
          imageSize,
          imageQuality,
          imageSlug,
          label,
          logger,
        });
    const imageFileName = imageResult.fileName;
    const imagePath = path.join(imagesDir, imageFileName);
    await writeFile(imagePath, imageResult.bytes);
    logInfo(logger, `${label}: wrote image ${imagePath}`);

    question.imageUrl = path.posix.join("images", imageFileName);
    question.imagePrompt = imagePrompt;
    question.model = textModel;
    question.imageModel = pictureSearchMode ? "google-custom-search" : imageModel;
    if (pictureSearchMode) {
      question.imageSourceUrl = imageResult.sourceUrl;
      question.imageSourcePage = imageResult.sourcePage;
      question.imageSourceTitle = imageResult.sourceTitle;
    }

    const errors = await validateQuestion(question, { seen, index: offset, outputDir });
    const duplicateHash = questionHash(question);
    seen.add(duplicateHash);

    questions.push(question);
    await writeJsonLine(auditFile, {
      index,
      category,
      difficulty,
      dryRun,
      mode,
      model: textModel,
      imageModel: question.imageModel,
      questionPrompt: prompt,
      imagePrompt,
      imageSearchQuery: question.imageSearchQuery,
      imageSourceUrl: question.imageSourceUrl,
      imageSourcePage: question.imageSourcePage,
      duplicateHash,
      valid: errors.length === 0,
      errors,
    });
    logInfo(
      logger,
      `${label}: ${errors.length === 0 ? "valid" : `invalid (${errors.join("; ")})`}; audit appended to ${auditFile}`,
    );
  }

  await writeJson(reviewFile, questions);
  logInfo(logger, `Wrote review file ${reviewFile}`);
  return { reviewFile, auditFile, count: questions.length };
}

function logInfo(logger, message) {
  logger?.info?.(message);
}

async function resolveGeneratedImage({ dryRun, apiKey, imageModel, imagePrompt, imageSize, imageQuality, imageSlug, label, logger }) {
  const fileName = `${imageSlug}.webp`;
  logInfo(logger, `${label}: generating image ${fileName}`);
  const bytes = dryRun
    ? dryRunImageBytes()
    : await generateImageWithOpenAI({
        apiKey,
        model: imageModel,
        prompt: imagePrompt,
        size: imageSize,
        quality: imageQuality,
      });

  return { fileName, bytes };
}

async function resolveSearchImage({
  dryRun,
  googleApiKey,
  googleSearchEngineId,
  query,
  googleSafe,
  googleRights,
  googleImageType,
  googleResultCount,
  imageSlug,
  label,
  logger,
}) {
  if (dryRun) {
    const fileName = `${imageSlug}.webp`;
    logInfo(logger, `${label}: using dry-run picture-search image ${fileName}`);
    return {
      fileName,
      bytes: dryRunImageBytes(),
      sourceUrl: "dry-run://image",
      sourcePage: "dry-run://source",
      sourceTitle: "Dry-run image fixture",
    };
  }

  logInfo(logger, `${label}: searching Google images for "${query}"`);
  const searchResult = await findGoogleImage({
    apiKey: googleApiKey,
    searchEngineId: googleSearchEngineId,
    query,
    safe: googleSafe,
    rights: googleRights,
    imgType: googleImageType,
    num: googleResultCount,
  });
  const downloaded = await downloadFirstImage(searchResult.candidates, { baseName: imageSlug });
  const fileName = `${imageSlug}${downloaded.extension}`;
  logInfo(logger, `${label}: selected Google image ${downloaded.candidate.link}`);

  return {
    fileName,
    bytes: downloaded.bytes,
    sourceUrl: downloaded.candidate.link,
    sourcePage: downloaded.candidate.contextLink,
    sourceTitle: downloaded.candidate.title,
  };
}

function normalizeGeneratedQuestion(generated, { category, difficulty, createdBy, approvedBy, now }) {
  const answers = Array.isArray(generated.answers)
    ? generated.answers.map((answer) => {
        if (typeof answer === "string") {
          return { text: answer, correct: answer === generated.correctAnswer };
        }
        return { text: answer.text, correct: Boolean(answer.correct) };
      })
    : [];

  return {
    question: generated.question,
    answers,
    answerDescription: generated.answerDescription,
    answerSource: generated.answerSource,
    imageUrl: "",
    imagePrompt: generated.imagePrompt,
    imageSearchQuery: generated.imageSearchQuery,
    imageAlt: generated.imageAlt,
    difficulty: Number(generated.difficulty ?? difficulty),
    categories: [generated.category && CATEGORIES.includes(generated.category) ? generated.category : category],
    tags: Array.isArray(generated.tags) ? generated.tags.map((tag) => String(tag).toLowerCase().trim()).filter(Boolean) : [],
    createdBy,
    createdAt: now,
    approvedBy,
    approvedAt: now,
    draft: false,
    totalAnswers: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  };
}
