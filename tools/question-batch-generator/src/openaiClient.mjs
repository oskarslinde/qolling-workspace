import { Buffer } from "node:buffer";

const RESPONSES_URL = "https://api.openai.com/v1/responses";
const IMAGES_URL = "https://api.openai.com/v1/images/generations";

export async function generateQuestionWithOpenAI({ apiKey, model, prompt }) {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required for non-dry-run generation");
  }

  const response = await fetch(RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: prompt,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(formatOpenAIError("question generation", payload, response.statusText));
  }

  return parseQuestionPayload(extractOutputText(payload));
}

export async function generateImageWithOpenAI({ apiKey, model, prompt, size, quality }) {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required for non-dry-run image generation");
  }

  const response = await fetch(IMAGES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      size,
      quality,
      output_format: "webp",
      n: 1,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(formatOpenAIError("image generation", payload, response.statusText));
  }

  const base64 = payload?.data?.[0]?.b64_json;
  if (!base64) {
    throw new Error("OpenAI image generation did not return b64_json");
  }

  return Buffer.from(base64, "base64");
}

function formatOpenAIError(operation, payload, fallbackMessage) {
  const message = payload?.error?.message ?? fallbackMessage;
  const code = payload?.error?.code;
  const quotaHint =
    code === "insufficient_quota" || /quota/i.test(message)
      ? " Check API billing/quota first; using --text-model/--image-model can reduce spend but cannot bypass exhausted quota."
      : "";

  return `OpenAI ${operation} failed: ${message}${quotaHint}`;
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  const parts = [];
  for (const item of payload?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === "string") {
        parts.push(content.text);
      }
    }
  }

  const text = parts.join("\n").trim();
  if (!text) {
    throw new Error("OpenAI response did not include text output");
  }
  return text;
}

function parseQuestionPayload(text) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(cleaned);
}
