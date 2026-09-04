# Certificate Tagging Summary

## Scope

Each of the 573 questions in `output/` now has exactly one certificate tag in its existing `tags` array:

- `MLS-C01` for applied machine learning, SageMaker, modeling, data engineering for ML, and ML implementation or operations.
- `AIF-C01` for foundational AI/ML, generative AI, foundation models, Amazon Bedrock, and AI business-use-case concepts.
- `CLF-C02` for general AWS cloud services, security fundamentals, operations, governance, cost, and architecture concepts without an ML-specific objective.

Existing tags were retained. This pass added certificate tags only: no question wording, answers, difficulty values, or question count changed.

## Allocation By Collection

| Collection | Total | MLS-C01 | AIF-C01 | CLF-C02 |
| --- | ---: | ---: | ---: | ---: |
| `amazon-sagemaker-platform-and-algorithms.json` | 148 | 148 | 0 | 0 |
| `aws-cloud-services-and-architecture.json` | 69 | 8 | 2 | 59 |
| `aws-data-engineering-and-analytics.json` | 34 | 10 | 4 | 20 |
| `aws-ml-certification-scenarios.json` | 34 | 34 | 0 | 0 |
| `aws-operations-governance-and-cost.json` | 40 | 5 | 0 | 35 |
| `aws-security-and-identity.json` | 92 | 3 | 6 | 83 |
| `generative-ai-and-amazon-bedrock.json` | 58 | 32 | 26 | 0 |
| `machine-learning-foundations-and-data-preparation.json` | 58 | 26 | 32 | 0 |
| `ml-frameworks-and-compute.json` | 40 | 3 | 0 | 37 |
| **Total** | **573** | **269** | **70** | **234** |

## Classification Rules

`MLS-C01` was assigned to questions about the applied ML lifecycle: SageMaker capabilities, algorithm and model selection, training, tuning, evaluation, feature engineering, model monitoring, endpoints, and ML-specific deployment or security scenarios.

`AIF-C01` was assigned to introductory AI/ML and generative-AI concepts, including foundation models, prompts, transformers, Amazon Bedrock, Amazon Q, and QuickSight Q, when the question did not require ML-system implementation or optimization.

`CLF-C02` was assigned to generic AWS knowledge such as core-service purposes, IAM and security basics, networking, storage, governance, monitoring, containers, cost, and general architecture.

## Important Limit

The certificate tag is a learning-target classification, not a claim that the question is an official exam question or fully blueprint-accurate. Answer correctness, current AWS guidance, ambiguous wording, and multiple-correct-answer issues need a separate quality-review pass before using these as final certification preparation material.
