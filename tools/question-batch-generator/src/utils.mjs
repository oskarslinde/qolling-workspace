import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";

export function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = rest[index + 1];
    if (!next || next.startsWith("--")) {
      options[key] = true;
      continue;
    }

    options[key] = next;
    index += 1;
  }

  return { command, options };
}

export function intOption(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function stringOption(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export async function ensureDir(directory) {
  await mkdir(directory, { recursive: true });
}

export async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

export async function writeJson(file, data) {
  await ensureDir(path.dirname(file));
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function writeJsonLine(file, data) {
  await ensureDir(path.dirname(file));
  await appendFile(file, `${JSON.stringify(data)}\n`, "utf8");
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function slugify(value, fallback = "question") {
  const slug = normalizeText(value).replace(/\s+/g, "-").slice(0, 80);
  return slug || fallback;
}

export function questionHash(question) {
  const answers = Array.isArray(question.answers)
    ? question.answers.map((answer) => answer?.text ?? answer).sort()
    : [];
  return sha256(`${normalizeText(question.question)}|${answers.map(normalizeText).join("|")}`);
}

export function chooseRoundRobin(values, index) {
  return values[index % values.length];
}

export function isoNow() {
  return new Date().toISOString();
}

