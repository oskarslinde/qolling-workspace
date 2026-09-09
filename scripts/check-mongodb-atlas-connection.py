"""Verify Atlas discovery, TLS, authentication, and access to the configured database."""

import os
import re
import sys
from pathlib import Path


ENV_FILE = Path(".env.dev")
DEFAULT_TIMEOUT_SECONDS = 15


def fail(message: str) -> None:
    print(f"MongoDB Atlas connection check failed: {message}", file=sys.stderr)
    raise SystemExit(1)


def read_environment_value(name: str) -> str:
    if not ENV_FILE.exists():
        fail(f"{ENV_FILE} does not exist.")

    pattern = re.compile(rf"^\s*(?:export\s+)?{re.escape(name)}\s*=\s*(.*)\s*$")
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        match = pattern.match(line)
        if not match:
            continue
        value = match.group(1).strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
            return value[1:-1]
        return value
    return ""


mongodb_uri = read_environment_value("MONGODB_URI")
if not mongodb_uri:
    fail(f"{ENV_FILE} does not define MONGODB_URI.")

try:
    from pymongo import MongoClient
except ImportError:
    fail("Python package 'pymongo' is required. Install it with: python -m pip install pymongo")

try:
    timeout_seconds = float(os.environ.get("MONGODB_CONNECTION_CHECK_TIMEOUT_SECONDS", DEFAULT_TIMEOUT_SECONDS))
except ValueError:
    fail("MONGODB_CONNECTION_CHECK_TIMEOUT_SECONDS must be a positive number.")
if timeout_seconds <= 0:
    fail("MONGODB_CONNECTION_CHECK_TIMEOUT_SECONDS must be a positive number.")

try:
    client = MongoClient(
        mongodb_uri,
        serverSelectionTimeoutMS=int(timeout_seconds * 1000),
        connectTimeoutMS=int(timeout_seconds * 1000),
        tls=True,
    )
    database = client.get_default_database()
    client.admin.command("ping")
    database.list_collection_names()
except Exception as error:  # PyMongo exposes several concrete network/auth exceptions.
    detail = str(error).replace(mongodb_uri, "<configured MONGODB_URI>")
    detail = re.sub(r"(mongodb(?:\+srv)?://)[^@\s]+@", r"\1<credentials>@", detail)
    fail(f"{type(error).__name__}: {detail}")
finally:
    try:
        client.close()
    except NameError:
        pass

print(f"MongoDB Atlas connection is healthy (database={database.name}).")
