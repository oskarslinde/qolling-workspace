# Qolling Question Batch Generator

Local CLI for generating reviewable Qolling seed questions and Mongo-ready exports. Product-level generation notes live in `../../docs/features/question-generation.md`.

The tool stays outside Hera and Zeus. It writes review files first, validates them, then exports JSONL only for valid questions.

## Commands

```powershell
node tools/question-batch-generator/src/cli.mjs generate --count 10 --dry-run
node tools/question-batch-generator/src/cli.mjs generate --mode picture-search --count 10 --dry-run
node tools/question-batch-generator/src/cli.mjs validate --input tools/question-batch-generator/out/questions.review.json
node tools/question-batch-generator/src/cli.mjs export:mongo --input tools/question-batch-generator/out/questions.review.json --chunk-size 100
node tools/question-batch-generator/src/cli.mjs import:mongo --input tools/question-batch-generator/out/questions.mongo.jsonl --uri $env:MONGODB_URI --db qolling
```

## Required Credentials

- `OPENAI_API_KEY` for real generation.
- `GOOGLE_CUSTOM_SEARCH_API_KEY` and `GOOGLE_CUSTOM_SEARCH_ENGINE_ID` for picture-search mode.

Dry-run mode uses deterministic local fixtures and should not be used as production content.

## Outputs

- `questions.review.json` - review shape with generation metadata.
- `questions.mongo.jsonl` - Mongo-ready documents.
- `questions.mongo.part-0001.jsonl` - chunked import files.
- `audit.jsonl` - prompts, model names, hashes, and validation status.
- `images/*.webp` - generated or downloaded images.

Google image results still need source/licensing review before production use unless the search configuration enforces the required policy.
