#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_CHUNK_SIZE, DEFAULT_IMAGE_MODEL, DEFAULT_OUTPUT_DIR, DEFAULT_TEXT_MODEL } from "./constants.mjs";
import { exportMongoFiles } from "./exportMongo.mjs";
import { generateBatch } from "./generator.mjs";
import { importMongo } from "./importMongo.mjs";
import { intOption, parseArgs, readJson, stringOption } from "./utils.mjs";
import { validateQuestions } from "./validation.mjs";

const { command, options } = parseArgs(process.argv.slice(2));

try {
  switch (command) {
    case "generate":
      await runGenerate(options);
      break;
    case "validate":
      await runValidate(options);
      break;
    case "export:mongo":
      await runExportMongo(options);
      break;
    case "import:mongo":
      await runImportMongo(options);
      break;
    case "help":
    case undefined:
      printHelp();
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

async function runGenerate(options) {
  const count = intOption(options.count, 10);
  const outputDir = path.resolve(stringOption(options.output, DEFAULT_OUTPUT_DIR));
  const logger = createLogger();
  logger.info(
    `Generating ${count} question${count === 1 ? "" : "s"} into ${outputDir} ` +
      `(dryRun=${Boolean(options["dry-run"])}, clean=${Boolean(options.clean)})`,
  );
  const result = await generateBatch({
    count,
    outputDir,
    mode: stringOption(options.mode, "standard"),
    dryRun: Boolean(options["dry-run"]),
    clean: Boolean(options.clean),
    textModel: options["text-model"],
    imageModel: options["image-model"],
    imageSize: options["image-size"],
    imageQuality: options["image-quality"],
    createdBy: options["created-by"],
    approvedBy: options["approved-by"],
    startIndex: intOption(options["start-index"], 0),
    topic: options.topic,
    googleApiKey: options["google-api-key"],
    googleSearchEngineId: options["google-search-engine-id"],
    googleSafe: options["google-safe"],
    googleRights: options["google-rights"],
    googleImageType: options["google-image-type"],
    googleResultCount: intOption(options["google-result-count"], 5),
    logger,
  });

  console.log(`Generated ${result.count} review questions`);
  console.log(`Review file: ${result.reviewFile}`);
  console.log(`Audit file: ${result.auditFile}`);
}

async function runValidate(options) {
  const input = resolveInput(options.input, "questions.review.json");
  const outputDir = path.dirname(input);
  const logger = createLogger();
  logger.info(`Validating questions from ${input}`);
  const questions = await readJson(input);
  const results = await validateQuestions(questions, { outputDir });
  const invalid = results.filter((result) => !result.valid);

  console.log(`Validated ${results.length} questions`);
  console.log(`Valid: ${results.length - invalid.length}`);
  console.log(`Invalid: ${invalid.length}`);
  for (const result of invalid.slice(0, 20)) {
    console.log(`#${result.index + 1}: ${result.errors.join("; ")}`);
  }

  if (invalid.length > 0) {
    process.exitCode = 1;
  }
}

async function runExportMongo(options) {
  const input = resolveInput(options.input, "questions.review.json");
  const outputDir = path.dirname(input);
  const logger = createLogger();
  logger.info(`Exporting Mongo JSONL from ${input}`);
  const questions = await readJson(input);
  const result = await exportMongoFiles(questions, {
    outputDir,
    outputFile: path.resolve(stringOption(options.output, path.join(outputDir, "questions.mongo.jsonl"))),
    chunkSize: intOption(options["chunk-size"], DEFAULT_CHUNK_SIZE),
    createdBy: options["created-by"],
    approvedBy: options["approved-by"],
    logger,
  });

  console.log(`Exported ${result.exportedCount} Mongo documents`);
  console.log(`Rejected ${result.rejectedCount} invalid questions`);
  console.log(`Main file: ${result.outputFile}`);
  console.log(`Chunk files: ${result.chunkFiles.length}`);
  if (result.rejectedCount > 0) {
    process.exitCode = 1;
  }
}

async function runImportMongo(options) {
  const input = resolveInput(options.input, "questions.mongo.jsonl");
  const logger = createLogger();
  await importMongo({
    input,
    uri: options.uri ?? process.env.MONGODB_URI,
    db: options.db,
    collection: options.collection,
    logger,
  });
}

function resolveInput(input, fallbackName) {
  return path.resolve(stringOption(input, path.join(DEFAULT_OUTPUT_DIR, fallbackName)));
}

function printHelp() {
  const script = path.relative(process.cwd(), fileURLToPath(import.meta.url));
  console.log(`Usage:
  node ${script} generate --count 10 --dry-run
  node ${script} generate --mode picture-search --count 10 --output tools/question-batch-generator/out
  node ${script} generate --count 10 --output tools/question-batch-generator/out --text-model ${DEFAULT_TEXT_MODEL} --image-model ${DEFAULT_IMAGE_MODEL}
  node ${script} validate --input tools/question-batch-generator/out/questions.review.json
  node ${script} export:mongo --input tools/question-batch-generator/out/questions.review.json --chunk-size 100
  node ${script} import:mongo --input tools/question-batch-generator/out/questions.mongo.jsonl --uri <mongodb-uri> --db <database>
`);
}

function createLogger() {
  return {
    info(message) {
      console.error(`[question-batch-generator] ${message}`);
    },
  };
}
