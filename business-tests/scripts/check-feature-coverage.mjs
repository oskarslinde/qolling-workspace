import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const projectDir = path.basename(rootDir) === "business-tests"
  ? rootDir
  : path.join(rootDir, "business-tests");
const featureDir = path.join(projectDir, "features");
const testsDir = path.join(projectDir, "tests");

const featureFiles = fs
  .readdirSync(featureDir)
  .filter((name) => name.endsWith(".feature"))
  .sort();

const testFiles = fs
  .readdirSync(testsDir)
  .filter((name) => name.endsWith(".spec.ts"))
  .sort();

const allTestContent = testFiles
  .map((fileName) => fs.readFileSync(path.join(testsDir, fileName), "utf8"))
  .join("\n");

const missingCoverage = [];

for (const featureFileName of featureFiles) {
  const featureId = featureFileName.slice(0, 2);
  const marker = `[F${featureId}]`;
  if (!allTestContent.includes(marker)) {
    missingCoverage.push({ featureFileName, marker });
  }
}

if (missingCoverage.length > 0) {
  console.error("Feature coverage check failed. Missing scenario markers:");
  for (const item of missingCoverage) {
    console.error(`- ${item.featureFileName} -> expected marker ${item.marker}`);
  }
  process.exit(1);
}

console.log(
  `Feature coverage check passed: ${featureFiles.length} feature files are mapped to executable scenario tests.`
);
