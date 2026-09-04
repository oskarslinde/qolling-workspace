# AIF-C01 Domain 1 Question-Capacity Plan

## Objective

Fill every `1.1` through `1.3` row in [aif-c01-granular-topic-checklist.md](aif-c01-granular-topic-checklist.md) to its `Max questions` value. The completion rule is exact: cumulative checklist-ID tags and the matching checklist signal must equal the maximum for every Domain 1 row.

## Baseline

| Measure | Count |
| --- | ---: |
| Domain 1 checklist rows | 60 |
| Current tagged questions | 34 |
| Target capacity | 236 |
| Questions still required | 202 |

## Execution milestones

| Milestone | Checklist scope | New questions | Target JSON file | Status |
| --- | --- | ---: | --- | --- |
| 1 | `1.1.01`â€“`1.1.13` | 35 | `aif-c01-domain1-core-concepts-questions.json` | Complete |
| 2 | `1.1.14`â€“`1.1.25` | 30 | `aif-c01-domain1-data-inference-learning-questions.json` | Complete |
| 3 | `1.2.01`â€“`1.2.13` | 48 | `aif-c01-domain1-practical-use-cases-questions.json` | Complete |
| 4 | `1.2.14`â€“`1.3.06` | 47 | `aif-c01-domain1-services-lifecycle-questions.json` | Complete |
| 5 | `1.3.07`â€“`1.3.15` | 42 | `aif-c01-domain1-mlops-metrics-questions.json` | Complete |

## Generation rules

- Assign exactly one primary checklist ID to every new question via its tags.
- Retain existing questions unless review finds a factual, structural, or duplicate defect.
- Use current authoritative AWS documentation as `answerSource`, four unique answers, answer-level rationales, import-valid metadata, and compatible question types.
- For every batch of 20 or more questions, use at least eight question families, keep each family at or below 15% of that batch, and use the balanced difficulty policy.
- Update the checklist signal and grouped coverage view after each milestone.

## Verification record

For each completed milestone, record:

1. Question-validator result for its JSON batch.
2. Count of checklist-ID tags added by row.
3. Confirmation that signals equal tag counts and no row exceeds its maximum.
4. Content-review notes, including source and duplicate review.

Recorded result: all five milestone batches passed the question validator. The final cross-file audit validated all 12 AIF-C01 JSON files and reconciled all 236 Domain 1 checklist-ID tags with their signals.

## Completion record

Completed on 2026-09-01. The final audit validated all 12 AIF-C01 JSON files and confirmed 236 tagged Domain 1 questions across all 60 rows, with every row at its exact maximum.

## Post-completion collection organization

The temporary milestone files were consolidated into the subject collections below and then removed after validation. These are the authoritative collections going forward.

| Collection | Questions | Primary scope |
| --- | ---: | --- |
| `machine-learning-foundations-and-data-preparation.json` | 135 | AI/ML foundations, data, learning methods, practical ML use cases |
| `aws-cloud-services-and-architecture.json` | 77 | AWS managed AI services, lifecycle, MLOps, and architecture |
| `generative-ai-and-amazon-bedrock.json` | 73 | GenAI, foundation models, Bedrock, RAG, prompts, and agents |
| `aws-security-and-identity.json` | 15 | Security, identity, governance, and responsible AI |
| `aws-data-engineering-and-analytics.json` | 4 | Amazon QuickSight analytics |
