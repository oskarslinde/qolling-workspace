# AWS MCQ Difficulty Assignment Summary

## Scope

Difficulty values were added to all 573 questions in `output/`. Every value is an integer from `1` through `5` and follows [difficulty-scale.md](difficulty-scale.md).

## Assignment Approach

- `1`: direct definitions, service purposes, and single-fact recall.
- `2`: straightforward selection of a service, feature, model, algorithm, or concept for a stated need.
- `3`: contextual use cases requiring the learner to apply the concept to a scenario.
- `4`: scenarios balancing at least two independent constraints, such as cost and latency, secure cross-account access, scale and performance, or monitoring across accounts.
- `5`: scenarios balancing three or more independent constraints. One question meets this bar: reducing SageMaker preprocessing time for a large S3 dataset while considering performance and efficiency.

The scale measures the reasoning required by the question wording, rather than the importance or obscurity of the AWS feature.
Do y
## Distribution By Collection

| Collection | Total | 1 | 2 | 3 | 4 | 5 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `amazon-sagemaker-platform-and-algorithms.json` | 148 | 41 | 88 | 18 | 1 | 0 |
| `aws-cloud-services-and-architecture.json` | 69 | 38 | 28 | 3 | 0 | 0 |
| `aws-data-engineering-and-analytics.json` | 34 | 7 | 24 | 3 | 0 | 0 |
| `aws-ml-certification-scenarios.json` | 34 | 0 | 10 | 14 | 9 | 1 |
| `aws-operations-governance-and-cost.json` | 40 | 7 | 27 | 5 | 1 | 0 |
| `aws-security-and-identity.json` | 92 | 34 | 55 | 3 | 0 | 0 |
| `generative-ai-and-amazon-bedrock.json` | 58 | 14 | 27 | 16 | 1 | 0 |
| `machine-learning-foundations-and-data-preparation.json` | 58 | 30 | 28 | 0 | 0 | 0 |
| `ml-frameworks-and-compute.json` | 40 | 18 | 20 | 2 | 0 | 0 |
| **Total** | **573** | **189** | **307** | **64** | **12** | **1** |

## Result

The set is intentionally weighted toward foundational recall and basic application: 496 questions (86.6%) are difficulty `1` or `2`. The ML certification scenarios contain most of the advanced questions because they combine operational constraints, service selection, and architecture decisions.
