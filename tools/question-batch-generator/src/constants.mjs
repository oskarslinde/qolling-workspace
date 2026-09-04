import { fileURLToPath } from "node:url";

export const CATEGORIES = Object.freeze([
  "Sports",
  "Technology",
  "Pop Culture",
  "History",
  "Geography",
  "Science",
  "Literature",
  "Art",
  "Music",
  "Philosophy",
  "Food and Cooking",
  "Health and Medicine",
]);

export const DIFFICULTY_MIX = Object.freeze({
  1: 0.35,
  2: 0.35,
  3: 0.2,
  4: 0.07,
  5: 0.03,
});

export const DEFAULT_OUTPUT_DIR = fileURLToPath(new URL("../out/", import.meta.url));
export const DEFAULT_TEXT_MODEL = "gpt-5-mini";
export const DEFAULT_IMAGE_MODEL = "gpt-image-1-mini";
export const DEFAULT_IMAGE_SIZE = "1024x1024";
export const DEFAULT_IMAGE_QUALITY = "low";
export const DEFAULT_CREATED_BY = "system-seed";
export const DEFAULT_APPROVED_BY = "system-seed";
export const DEFAULT_CHUNK_SIZE = 100;

export const EDUCATIONAL_ANGLES = Object.freeze([
  "cause and effect",
  "surprising mechanism",
  "real-world application",
  "compare and contrast",
  "historical consequence",
  "common misconception",
  "pattern recognition",
  "practical decision",
]);
