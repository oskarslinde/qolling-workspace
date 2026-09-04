import { spawn } from "node:child_process";

export async function importMongo({ input, uri, db, collection = "multipleChoiceQuestions", logger }) {
  if (!input) {
    throw new Error("--input is required");
  }
  if (!uri) {
    throw new Error("--uri or MONGODB_URI is required");
  }
  if (!db) {
    throw new Error("--db is required");
  }

  const args = [
    "--uri",
    uri,
    "--db",
    db,
    "--collection",
    collection,
    "--file",
    input,
    "--type",
    "json",
  ];

  logInfo(logger, `Starting mongoimport: input=${input}, db=${db}, collection=${collection}`);
  return new Promise((resolve, reject) => {
    const child = spawn("mongoimport", args, { stdio: "inherit", shell: true });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        logInfo(logger, "mongoimport completed successfully");
        resolve();
      } else {
        logInfo(logger, `mongoimport failed with exit code ${code}`);
        reject(new Error(`mongoimport exited with code ${code}`));
      }
    });
  });
}

function logInfo(logger, message) {
  logger?.info?.(message);
}
