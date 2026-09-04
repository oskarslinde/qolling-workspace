# MLS-C01 Full-Capacity Question Plan

## Objective

Apply the AIF-C01 coverage workflow to AWS Certified Machine Learning - Specialty (MLS-C01): create a granular checklist, map current questions, generate missing capacity, and consolidate coherent final collections.

## Baseline

| Measure | Count |
| --- | ---: |
| Existing questions | 269 |
| Official domains | 4 |
| Current coverage reference | `mls-c01-question-coverage-matrix.md` |

## Capacity policy

Use 3 questions for a narrow term or tool capability, 5 for a bounded technique/use case, 8 for a service/algorithm/trade-off item, and 10 for integrated production or diagnostic scenarios. Each question gets exactly one primary granular-checklist ID tag.

## Execution milestones

1. Create `mls-c01-granular-topic-checklist.md` from the official domain/task outline.
2. Map direct matches across the existing JSON collections; update checklist signals and preserve unmatched questions.
3. Generate gap batches by domain: Data Engineering; Exploratory Data Analysis; Modeling; ML Implementation and Operations.
4. Consolidate temporary batches into the existing subject collections, including SageMaker, data/analytics, foundations, scenarios, operations, and security.
5. Validate every final JSON file and audit that every checklist row has `Current = Max`.

## Quality gates

- Use current AWS primary documentation, exactly four unique answers, answer-level explanations, import-valid metadata, and balanced difficulty.
- For batches of 20 or more questions: at least eight question families and no family above 15%.
- Reject near-duplicate stems, answer sets, objectives, and sources before adding a batch.
- Do not remove temporary batches until their questions are verified in destination collections.

## Completion record

Complete only after every granular checklist row is at capacity, signals equal cross-file tag counts, and all final JSON files pass the validator.
