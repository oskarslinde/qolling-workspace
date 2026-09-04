# Question Generation

## Purpose

Question generation helps admins create multiple-choice question drafts, including image-oriented batch workflows.

## Standard Generation

- Hera calls `POST /admin/ai/generate-question`.
- Request parameters include `topic`, `questionCount`, `model`, `difficulty`, and `seriousness`.
- Zeus validates model, question count, difficulty, seriousness, and daily quota.
- Zeus returns a job response; Hera polls `GET /admin/ai/generation-jobs/{jobId}`.
- Hera maps generated questions into the shared `QuestionForm` for manual review before saving.

## Batch Generation

Admin batch generation can produce larger image-backed question sets and uses the configured text and image models. The local tool in `tools/question-batch-generator/` is for reviewable seed batches and Mongo-ready exports.

## Prompt Rules

- Difficulty is a 1-5 learning level.
- Seriousness is a 1-5 tone/style level: low values are more playful, middle is balanced, high values are precise and assessment-focused.
- Prompts must request exactly one multiple-choice question shape per generated item: question, four answers, one correct answer, explanation, and source where available.
- Generated output must be reviewed before production use.

## Important Files

- Hera: `src/pages/GenerateQuestionPage.jsx`, `src/pages/AdminQuestionBatchGenerationPage.jsx`, `src/services/aiService.js`.
- Zeus: `ai/controller/**`, `ai/service/QuestionGenerationService.java`, `ai/service/QuestionBatchGenerationService.java`, `ai/service/PromptBuilder.java`.
- Tooling: `tools/question-batch-generator/README.md`.
