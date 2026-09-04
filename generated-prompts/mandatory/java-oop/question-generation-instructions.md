# Question Generation Instructions

Use these instructions when generating one completed question batch from a coverage matrix row.

## Inputs

- Instruction path or instruction name: this file.
- Topic folder path, for example `generated-prompts/mandatory/java-oop`.
- Coverage matrix path, for example `java-oop-coverage-matrix`.
- Topic/subtopic to generate, for example `Constructors and initialization`.
- Existing completed JSON batch to mirror, for example `java-oop-pilot-01-classes-and-objects.json`.

## Required workflow

1. Read the coverage matrix and find the requested subtopic row.
2. Read an existing completed batch JSON in the same topic folder and mirror its structure, metadata style, and answer depth.
3. Generate exactly the number of questions required by each matrix type column:
   - `Conceptual`
   - `Code-reading`
   - `Coding task`
   - `Debugging`
   - `Design/scenario`
4. Create a new JSON file in the same folder using this naming pattern:
   - `<topic-slug>-pilot-<next-number>-<subtopic-slug>.json`
   - Example: `java-oop-pilot-02-constructors-and-initialization.json`
5. After the JSON batch is created, update the matrix row by appending `x` to every completed numeric cell in that row, including:
   - `Weight`
   - every generated type column
   - `Target total`
6. Validate that the JSON is parseable.
7. Review the generated content for duplicate stems, weak distractors, incorrect Java behavior, and metadata consistency.

## JSON item shape

Each question object must include:

- `question`
- `answers`
- `tags`
- `categories`
- `difficulty`
- `answerDescription`

Each question must have exactly four answer choices. Exactly one answer must have `"correct": true`. Every incorrect answer must include a concise `wrongAnswerExplanation`.

## Metadata conventions

Use these categories unless the existing batch establishes different local conventions:

- `Java`
- `OOP`

Use these tags:

- `topic:<topic-slug>`
- `subtopic:<subtopic-slug>`
- `type:<matrix-type-slug>`
- `coverage:<specific-theme-slug>`

Matrix type slugs:

- `conceptual`
- `code-reading`
- `coding-task`
- `debugging`
- `design-scenario`

## Content quality rules

- Keep questions specific to practical Java software development.
- Prefer backend, Spring Boot, API, domain model, and production examples where useful.
- Make distractors plausible and diagnostic, not silly.
- Include code snippets for code-reading, coding-task, and debugging questions when that makes the question stronger.
- Keep each question focused on one concept.
- Cover beginner through senior understanding across the batch when the target count allows it.
- Do not add fallback behavior, mock substitutions, or workaround logic to examples as the correct answer unless explicitly requested.
