# AWS-SERVICES Question Plan

## Objective

Build AWS service literacy for a learner who has not used AWS. Preserve the 362-question collection and the service inventory captured in `coverage-matrix.md`. Each service has three distinct foundational learning objectives; these need not follow a fixed purpose/selection/comparison template.

## Difficulty policy

Keep the collection accessible to AWS newcomers. Use difficulty 1-2 for recall and straightforward application and difficulty 3 for reasoning through close distinctions or multiple constraints. Judge difficulty from the knowledge required, not stem length. Allow single-choice and useful two- or three-correct multi-select questions without a format quota.

## Quality policy

All questions use four unique answers, answer-level explanations, technical metadata, categories, authoritative AWS sources, and accurate question-family metadata. State the selection count for multi-select questions. Questions must stand alone outside certification collections, use plausible alternatives, and avoid giving away the answer. Explanations teach the decisive technical distinction without word-count padding.

The inventory is based on the CLF-C02 service-reference snapshot captured on 2026-09-04; this revision preserves that inventory rather than asserting that it remains the current exam scope. Qualify renamed, retired, or restricted offerings when needed and verify changed facts against AWS documentation.

## Generated contents

- Three questions for each service in `coverage-matrix.md`, testing distinct foundational objectives.
- Additional cross-service questions for commonly confused service families.
- JSON files grouped by the official service categories.

## Editorial revision — 2026-09-15

- Generator skill and validator updated: natural wording, flexible formats, explicit multi-select counts, concise explanations, and advisory repetition/leakage checks.
- Revised all 19 files in place. Final structural checks preserve 362 questions and the original per-file service coverage; 15 questions use explicit multi-select. Correct-answer positions were shuffled with their explanations.
- All 362 records pass validator hard checks; the 24 focused regression tests pass. No certification-role filler remains.
- Editorial acceptance remains incomplete: machine-learning and storage still contain overlapping service-recognition objectives and repeated definition-style explanations. Other near-duplicate objectives also need a final semantic review; distinct objective labels do not establish distinct learning outcomes. These are saved-work limitations, not validator failures.
- AWS documentation sources and availability-sensitive names were updated, including migration-service restrictions and renamed offerings. Recheck availability-sensitive questions when regenerating the collection.
- Final acceptance: 362 questions across 19 JSON files, preserved per-service coverage, passing validation and validator tests, and a complete editorial review of stems, options, explanations, and objectives.
