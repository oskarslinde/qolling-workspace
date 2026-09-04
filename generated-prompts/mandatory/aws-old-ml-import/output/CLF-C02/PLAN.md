# CLF-C02 Full-Capacity Question Plan

## Objective

Apply the AIF-C01 coverage workflow to AWS Certified Cloud Practitioner (CLF-C02): create a granular checklist, map every current question where a direct match exists, generate remaining capacity, and consolidate only coherent final collections.

## Baseline

| Measure | Count |
| --- | ---: |
| Existing questions | 234 |
| Official domains | 4 |
| Current coverage reference | `clf-c02-question-coverage-matrix.md` |

## Capacity policy

Use 3 questions for a narrow term or single AWS service capability, 5 for a bounded use case or comparison, 8 for a service-selection/trade-off item, and 10 for an integrated multi-constraint scenario. Each question gets exactly one primary granular-checklist ID tag.

## Execution milestones

1. Create `clf-c02-granular-topic-checklist.md` from the official domain/task outline.
2. Map direct matches in all existing JSON files; update checklist signals and preserve unmatched questions.
3. Generate gap batches by domain: Cloud Concepts; Security and Compliance; Cloud Technology and Services; Billing, Pricing, and Support.
4. Consolidate temporary batches into the five subject collections already in this directory.
5. Validate each JSON file and audit that every checklist row has `Current = Max`.

## Quality gates

- Use current primary AWS sources, exactly four unique answers, answer-level explanations, valid technical metadata, and balanced difficulty.
- For batches of 20 or more questions: at least eight question families and no family above 15%.
- Reject near-duplicate stems, answer sets, objectives, and sources before adding a batch.
- Do not remove a temporary batch until all its questions are verified in a destination collection.

## Completion record

Complete only after every granular checklist row is at capacity, signals equal cross-file tag counts, and all final JSON files pass the validator.
