# MLS-C01 Scope Assessment

## Confirmed Intent

This source set was collected for **AWS Certified Machine Learning - Specialty (`MLS-C01`)**.

The MLS-C01 blueprint is for practitioners who design, build, deploy, optimize, train, tune, and maintain ML solutions on AWS. It has four scored domains:

| MLS-C01 domain | Weight |
| --- | ---: |
| Data Engineering | 20% |
| Exploratory Data Analysis | 24% |
| Modeling | 36% |
| Machine Learning Implementation and Operations | 20% |

Source: [official MLS-C01 exam guide](https://docs.aws.amazon.com/pdfs/aws-certification/latest/machine-learning-specialty-01/machine-learning-specialty-01.pdf).

## Current Assessment

The 573-question set contains a useful MLS-C01 core, especially SageMaker, ML foundations, data processing, and scenario questions. It is not yet a pure MLS-C01 bank because it also contains generic cloud, security, DevOps, networking, CDK, and cost questions with no ML workload context.

The guide expects basic AWS security and ML operations, but explicitly treats advanced networking, database, security, and DevOps knowledge as outside the target candidate scope. A question should therefore stay in MLS-C01 only when its AWS service choice or trade-off is tied to building, training, evaluating, deploying, monitoring, or securing an ML workload.

## What Is Missing For A Dedicated MLS-C01 Bank

1. **Domain mapping:** Each question needs an explicit MLS-C01 domain and task-statement mapping. The current topical files are useful working groups, but are not a blueprint map.
2. **Blueprint balance:** The final bank should be reviewed against the 20/24/36/20 domain weighting. It currently over-represents direct service recall and generic AWS knowledge.
3. **Scenario depth:** More questions should require a specific ML trade-off: data ingestion or transformation, feature engineering, model selection, training and tuning, evaluation, model deployment, monitoring, cost, reliability, or ML-context security.
4. **Focused data engineering and EDA:** Add or strengthen coverage for ingestion patterns, ETL, data quality, missing or corrupt data, feature engineering, visualization, descriptive statistics, labeling, and data preparation decisions.
5. **Focused modeling:** Retain and review questions on framing business problems, algorithm selection, train/validation splits, optimization, regularization, overfitting, bias and variance, metrics, and model comparison.
6. **Focused ML operations:** Retain and review questions on ML endpoints, retraining, model monitoring, failure handling, performance, availability, scaling, cost optimization, and basic IAM/S3/VPC/encryption controls in an ML workload.
7. **Question-quality review:** Each question needs a current AWS-service accuracy review and a valid answer format. MLS-C01 uses single-answer questions with three distractors and multiple-response questions with at least five options. Existing grouping reports already identify some questions with multiple marked-correct answers.

## Suggested Split

Do not move whole files unchanged. Classify each question by its actual learning objective.

| Current collection | Suggested destination | Rationale |
| --- | --- | --- |
| `amazon-sagemaker-platform-and-algorithms.json` | Mostly MLS-C01 | Strong modeling and ML implementation core. Move only generic infrastructure questions without ML trade-offs. |
| `aws-ml-certification-scenarios.json` | Mostly MLS-C01 | Best source of realistic multi-constraint questions. Validate current AWS guidance and single-best-answer quality. |
| `machine-learning-foundations-and-data-preparation.json` | Split MLS-C01 / AIF-C01 | Keep applied modeling, evaluation, and data-preparation questions in MLS-C01. Move basic ML terminology and simple use-case questions to AI Practitioner. |
| `aws-data-engineering-and-analytics.json` | Split MLS-C01 / Cloud Practitioner | Keep ingestion, storage, transformation, analytics, and data-lake questions only when connected to an ML workflow. Move generic service facts to Cloud Practitioner. |
| `generative-ai-and-amazon-bedrock.json` | Split MLS-C01 / AIF-C01 | Bedrock and foundation models are now listed in the MLS-C01 guide, but foundational GenAI concepts, business use cases, and responsible-AI questions fit AI Practitioner better. Keep implementation, model-selection, and ML-operation scenarios in MLS-C01. |
| `aws-operations-governance-and-cost.json` | Mostly Cloud Practitioner; retain ML-context subset | Generic CloudWatch, CodePipeline, governance, and cost questions are not MLS-C01 unless they directly concern ML deployment, monitoring, or ML cost optimization. |
| `aws-security-and-identity.json` | Mostly Cloud Practitioner; retain ML-context subset | Keep basic IAM, S3 policy, security group, VPC, and encryption decisions only when they secure ML data, training, or inference. Move generic KMS, WAF, MITM, root-account, and broad security questions out. |
| `aws-cloud-services-and-architecture.json` | Mostly Cloud Practitioner | General service-definition, CloudFront, RDS, serverless, and broad architecture questions do not establish MLS-C01 capability without an ML use case. |
| `ml-frameworks-and-compute.json` | Split MLS-C01 / Cloud Practitioner | Keep ML training-compute selection and ML deployment concerns. Move generic EC2, SSH, Config, and non-ML operations questions out. |

## Easier Certificate Destinations

Use two destination groups rather than forcing all non-specialty content into one bank:

- **AWS Certified AI Practitioner (`AIF-C01`):** foundational AI/ML, GenAI, foundation-model, Amazon Bedrock, responsible-AI, and AI use-case questions. This exam targets foundational understanding and practical business applications, not building or optimizing ML systems. See the [official AIF-C01 guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01.html).
- **AWS Certified Cloud Practitioner (`CLF-C02`):** general AWS services, cloud concepts, IAM and security basics, storage, networking basics, monitoring, governance, billing, pricing, and Well-Architected questions. See the [official CLF-C02 guide](https://docs.aws.amazon.com/pdfs/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.pdf).

## Recommended Next Step

Review the questions collection by collection and assign each one of three target labels: `MLS-C01`, `AIF-C01`, or `CLF-C02`. Then remove or rewrite questions that do not fit any target cleanly. This preserves the useful content while making each final collection coherent and exam-specific.
