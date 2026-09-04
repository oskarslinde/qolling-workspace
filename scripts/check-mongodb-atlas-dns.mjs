import { execFile } from "node:child_process";
import { resolveSrv } from "node:dns/promises";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

const ENV_FILE = ".env.dev";
const DEFAULT_TIMEOUT_SECONDS = 5;
const execFileAsync = promisify(execFile);

const fail = (message) => {
  console.error(`MongoDB Atlas DNS check failed: ${message}`);
  process.exit(1);
};

const readEnvironmentValue = async (name) => {
  const contents = await readFile(ENV_FILE, "utf8");

  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(new RegExp(`^\\s*(?:export\\s+)?${name}\\s*=\\s*(.*)\\s*$`));
    if (!match) {
      continue;
    }

    const value = match[1];
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    if (value.startsWith("'") && value.endsWith("'")) {
      return value.slice(1, -1);
    }
    return value;
  }

  return "";
};

const timeoutSeconds = Number.parseFloat(
  process.env.MONGODB_DNS_CHECK_TIMEOUT_SECONDS ?? String(DEFAULT_TIMEOUT_SECONDS),
);
if (!Number.isFinite(timeoutSeconds) || timeoutSeconds <= 0) {
  fail("MONGODB_DNS_CHECK_TIMEOUT_SECONDS must be a positive number.");
}

const mongodbUri = await readEnvironmentValue("MONGODB_URI");
if (!mongodbUri) {
  fail(`${ENV_FILE} does not define MONGODB_URI.`);
}

let clusterHost;
try {
  const parsedUri = new URL(mongodbUri);
  if (parsedUri.protocol !== "mongodb+srv:") {
    fail("MONGODB_URI must use the mongodb+srv:// Atlas connection format.");
  }
  clusterHost = parsedUri.hostname;
} catch (error) {
  fail("MONGODB_URI is not a valid mongodb+srv:// connection string.");
}

if (!clusterHost) {
  fail("MONGODB_URI does not contain an Atlas cluster hostname.");
}

const srvRecord = `_mongodb._tcp.${clusterHost}`;
let timeoutId;
try {
  const records = process.platform === "win32"
    ? await resolveWindowsSrvRecord(srvRecord, timeoutSeconds)
    : await resolveSrvWithTimeout(srvRecord, timeoutSeconds);

  if (!records.length) {
    fail(`no SRV records were returned for ${srvRecord}.`);
  }
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  fail(
    `could not resolve ${srvRecord} within ${timeoutSeconds} seconds (${reason}). `
      + "Check whether the Atlas cluster is available and whether this machine can resolve external DNS.",
  );
} finally {
  clearTimeout(timeoutId);
}

console.log(`MongoDB Atlas DNS is reachable (${srvRecord}).`);

async function resolveWindowsSrvRecord(record, timeout) {
  const command = [
    `$records = @(Resolve-DnsName -Name '${record}' -Type SRV -DnsOnly -ErrorAction Stop | Where-Object { $_.Type -eq 'SRV' })`,
    "if ($records.Count -eq 0) { Write-Error 'No SRV records returned.'; exit 1 }",
  ].join("; ");

  await execFileAsync(
    "powershell.exe",
    ["-NoProfile", "-NonInteractive", "-Command", command],
    { timeout: timeout * 1000 },
  );
  return [record];
}

async function resolveSrvWithTimeout(record, timeout) {
  return Promise.race([
    resolveSrv(record),
    new Promise((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error(`timed out after ${timeout} seconds`)),
        timeout * 1000,
      );
    }),
  ]);
}
