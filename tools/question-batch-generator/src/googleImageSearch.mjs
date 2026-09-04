import { Buffer } from "node:buffer";
import path from "node:path";

const CUSTOM_SEARCH_URL = "https://customsearch.googleapis.com/customsearch/v1";
const DEFAULT_SAFE_SEARCH = "active";
const DEFAULT_RESULT_COUNT = 5;

export async function findGoogleImage({
  apiKey,
  searchEngineId,
  query,
  safe = DEFAULT_SAFE_SEARCH,
  rights,
  imgType,
  num = DEFAULT_RESULT_COUNT,
}) {
  if (!apiKey) {
    throw new Error("GOOGLE_CUSTOM_SEARCH_API_KEY is required for picture-search mode");
  }
  if (!searchEngineId) {
    throw new Error("GOOGLE_CUSTOM_SEARCH_ENGINE_ID is required for picture-search mode");
  }
  if (!query) {
    throw new Error("imageSearchQuery is required for picture-search mode");
  }

  const url = new URL(CUSTOM_SEARCH_URL);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("cx", searchEngineId);
  url.searchParams.set("q", query);
  url.searchParams.set("searchType", "image");
  url.searchParams.set("safe", safe);
  url.searchParams.set("num", String(Math.min(Math.max(Number(num) || DEFAULT_RESULT_COUNT, 1), 10)));
  if (rights) {
    url.searchParams.set("rights", rights);
  }
  if (imgType) {
    url.searchParams.set("imgType", imgType);
  }

  const response = await fetch(url);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message ?? response.statusText;
    throw new Error(`Google image search failed: ${message}`);
  }

  const candidates = (payload.items ?? [])
    .filter((item) => typeof item?.link === "string" && item.link.trim())
    .map((item) => ({
      title: item.title ?? "",
      link: item.link,
      mime: item.mime ?? "",
      fileFormat: item.fileFormat ?? "",
      contextLink: item.image?.contextLink ?? "",
      thumbnailLink: item.image?.thumbnailLink ?? "",
      width: item.image?.width,
      height: item.image?.height,
      byteSize: item.image?.byteSize,
    }));

  if (candidates.length === 0) {
    throw new Error(`Google image search returned no image results for query: ${query}`);
  }

  return { query, candidates };
}

export async function downloadFirstImage(candidates, { baseName }) {
  const errors = [];

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate.link);
      if (!response.ok) {
        errors.push(`${candidate.link}: ${response.status} ${response.statusText}`);
        continue;
      }

      const contentType = response.headers.get("content-type") ?? candidate.mime;
      if (!contentType?.startsWith("image/")) {
        errors.push(`${candidate.link}: non-image content-type ${contentType || "unknown"}`);
        continue;
      }

      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length === 0) {
        errors.push(`${candidate.link}: empty image response`);
        continue;
      }

      return {
        bytes,
        extension: extensionForContentType(contentType, candidate.link),
        candidate,
      };
    } catch (error) {
      errors.push(`${candidate.link}: ${error.message}`);
    }
  }

  throw new Error(`Unable to download image for ${baseName}: ${errors.join("; ")}`);
}

function extensionForContentType(contentType, imageUrl) {
  const normalized = contentType.split(";")[0].trim().toLowerCase();
  switch (normalized) {
    case "image/jpeg":
    case "image/jpg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default: {
      const ext = path.extname(new URL(imageUrl).pathname).toLowerCase();
      return ext && ext.length <= 6 ? ext : ".img";
    }
  }
}
