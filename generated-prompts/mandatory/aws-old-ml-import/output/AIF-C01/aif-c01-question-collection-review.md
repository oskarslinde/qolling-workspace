# AIF-C01 Question Collection Review

## Scope and method

Reviewed the six JSON collections in this directory on 2026-08-31. The review covered import-shape compliance, answer cardinality, metadata completeness, batch diversity, source coverage, and a desk review of question wording. The technical-question generator validator was run against the directory and accepted all 80 questions.

This is a content-quality review, not a claim that these are official AWS certification questions or that every cited source was independently revalidated during this review.

## Status update

The first recommended next-pass item was completed after this review: all 70 original templated answer descriptions were replaced with A-D, concept-specific rationales. Each explanation now identifies the correct set and points the learner to the item's existing cited source. A further 10-question extension was added with source-grounded explanations on every answer.

The second and third recommended next-pass items were completed on 2026-08-31: the duplicate legal-assistant RAG item was replaced with a Bedrock Guardrails scenario, the mis-scoped QuickSight security collection was replaced with AI security and governance content, and the batch now represents eight question families with difficulty levels 3 through 5 present.

## Collection inventory

| File | Questions | Main subject |
| --- | ---: | --- |
| `aws-cloud-services-and-architecture.json` | 2 | NLP foundations |
| `aws-data-engineering-and-analytics.json` | 4 | Amazon QuickSight |
| `aws-security-and-identity.json` | 6 | AI security, governance, and responsible AI |
| `generative-ai-and-amazon-bedrock.json` | 26 | GPT, transformers, RAG, and Bedrock-adjacent concepts |
| `machine-learning-foundations-and-data-preparation.json` | 32 | ML foundations, evaluation, data preparation, and selected AWS AI services |
| `aif-c01-additional-questions.json` | 10 | Bedrock RAG, prompt management, evaluation, and responsible AI |
| **Total** | **80** | |

## AIF-C01 coverage matrix

The matrix below follows the current [AWS AIF-C01 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html). Domain percentages are the share of scored content, not a required question count for this local 80-question study set. Current coverage is an objective-based review of the questions; counts are non-exclusive because one question can support more than one task.

| Domain / task | Exam weight | What should be covered | Current question coverage |
| --- | ---: | --- | --- |
| **1. Fundamentals of AI and ML** | **20%** | AI/ML terminology, use-case selection, learning types, data types, inference modes, lifecycle, MLOps, and model/business metrics | **Strong: ~30 questions.** ML terminology, classification/regression/clustering, metrics, transfer learning, pipelines, inference, and managed AI-service use cases are present; lifecycle and business metrics need more explicit scenarios. |
| 1.1 Explain basic AI concepts and terminologies | — | AI vs. ML vs. deep learning vs. GenAI vs. agentic AI; models, algorithms, training/inference; bias/fairness; labeled/unlabeled and structured/unstructured data; supervised, unsupervised, and reinforcement learning | **~20 questions.** Strong ML and NLP foundations; agentic AI and inference-mode coverage are limited. |
| 1.2 Identify practical use cases for AI | — | Value and limits of AI, regression/classification/clustering, computer vision, NLP, speech, recommendation, fraud detection, forecasting, knowledge bases, agents, and managed services | **~8 questions.** Classification/regression, QuickSight, A2I, and selected AWS AI services are covered; service-choice scenarios are limited. |
| 1.3 Describe the AI/ML development lifecycle | — | Pipeline stages, model sources and production methods, AWS services by lifecycle stage, experimentation, monitoring, retraining, and performance/business metrics | **~7 questions.** Evaluation and deployment concepts appear, but monitoring, retraining, and production-readiness coverage is thin. |
| **2. Fundamentals of GenAI** | **24%** | GenAI concepts, capabilities/limitations, business applications, AWS infrastructure, tokens, transformers, foundation models, and common failure modes | **Strong: ~24 questions.** GPT, transformers, tokens, RAG, agents, and Bedrock-adjacent concepts are well represented; AWS infrastructure breadth is uneven. |
| 2.1 Explain basic GenAI concepts | — | Generative vs. discriminative AI, tokens, embeddings, transformers, LLMs, multimodality, foundation models, and training/inference concepts | **~17 questions.** GPT, tokenization, attention, transformers, BERT, and model architecture are covered. |
| 2.2 Understand GenAI capabilities and limitations for business problems | — | Use-case fit, hallucinations, bias, context limits, latency/cost, factuality, RAG grounding, and when traditional ML is preferable | **~5 questions.** RAG and model-use scenarios exist; business constraints and limitations need more depth. |
| 2.3 Describe AWS infrastructure and technologies for GenAI applications | — | Amazon Bedrock, SageMaker AI, managed APIs, vector stores, orchestration, storage, networking, and core AWS service roles | **~6 questions.** Bedrock, Knowledge Bases, SageMaker, S3, IAM, and VPC concepts appear; vector-store and orchestration coverage is limited. |
| **3. Applications of Foundation Models** | **28%** | FM selection and application design, prompt engineering, fine-tuning, customization trade-offs, and evaluation | **Moderate: ~21 questions.** RAG, prompt parameters, Prompt management, caching, Guardrails, and evaluation are covered; fine-tuning data preparation is sparse. |
| 3.1 Design considerations for FM applications | — | Model choice by cost/modality/latency/size, inference parameters, RAG and vector databases, customization cost trade-offs, and agents | **~10 questions.** RAG, chunking, temperature, caching, model selection, and agents are present; vector database choices need expansion. |
| 3.2 Choose effective prompt engineering techniques | — | Context/instructions, zero-/one-/few-shot, templates, specificity, experimentation, versioning, prompt injection, hijacking, and jailbreaking | **~7 questions.** Prompt parameters and Prompt management are covered; prompt-risk and few-shot technique coverage is limited. |
| 3.3 Describe FM training and fine-tuning | — | Pre-training, fine-tuning, instruction tuning, transfer learning, continuous pre-training, distillation, RLHF, and representative governed datasets | **~3 questions.** Transfer learning and pre-training appear; FM-specific fine-tuning methods and data curation are under-covered. |
| 3.4 Describe methods to evaluate FM performance | — | Human/benchmark evaluation, Bedrock Model Evaluation, ROUGE, BLEU, BERTScore, LLM-as-judge, application metrics, and business alignment | **~6 questions.** Classification metrics and evaluation concepts are present; FM-specific metrics and business alignment need more questions. |
| **4. Guidelines for Responsible AI** | **14%** | Responsible development, fairness, inclusivity, safety, veracity, legal risks, dataset quality, transparency, explainability, and human-centered design | **Light: ~8 questions.** Guardrails, accountability, A2I, Clarify, and human review are present; legal risk, sustainability, transparency, and model cards need coverage. |
| 4.1 Explain development of responsible AI systems | — | Bias/fairness/inclusivity/robustness/safety/veracity, responsible model and dataset selection, legal risks, human audits, and bias monitoring | **~6 questions.** Guardrails, bias/explainability, human review, and accountability are represented; sustainability and legal-risk scenarios are missing. |
| 4.2 Recognize the importance of transparent and explainable models | — | Transparent vs. opaque models, Model Cards, Clarify, evaluation evidence, safety/transparency trade-offs, and user feedback | **~2 questions.** Explainability and Clarify appear, but Model Cards and human-centered transparency need explicit coverage. |
| **5. Security, Compliance, and Governance for AI Solutions** | **14%** | AI-system security, privacy, source citation/lineage, secure data handling, prompt injection, logging, governance services, compliance, retention, residency, and review processes | **Light: ~10 questions.** IAM, KMS/S3 encryption, private access, Guardrails, CloudTrail, shared responsibility, and governance are present; compliance regulations and lineage need expansion. |
| 5.1 Explain methods to secure AI systems | — | IAM, encryption, Macie, PrivateLink, shared responsibility, Guardrails, data quality/access/integrity, privacy, prompt injection, output validation, logging, and grounding | **~7 questions.** IAM, KMS, S3, VPC endpoints, Guardrails, auditability, and RAG grounding are covered. |
| 5.2 Recognize governance and compliance regulations | — | Config, Inspector, Artifact, CloudTrail, Trusted Advisor, data lifecycle/residency/retention, policies, review cadence, transparency standards, and training | **~3 questions.** CloudTrail, auditability, and governance concepts appear; Artifact, Inspector, Config, residency, and compliance workflows are gaps. |

The largest coverage gaps are FM fine-tuning and evaluation, GenAI business limitations, responsible-AI transparency/legal risk, and compliance/data-governance workflows. The current set also over-indexes on introductory ML and feature-identification questions relative to the domain weights.

## Structural status

The collection currently meets the generator's import contract:

- Every question has exactly four unique, nonblank answers.
- 62 questions are `SINGLE_CHOICE`; 18 are `MULTI_SELECT`.
- Multi-select questions have two (6 questions) or three (12 questions) correct answers; none have four correct answers.
- Every question has a category, difficulty, `metadata.questionType`, `answerDescription`, and `answerSource`.
- No prohibited metadata prefixes were found in display tags.

## Diversity and difficulty

| Dimension | Observed | Assessment |
| --- | --- | --- |
| Difficulty 1 | 26 (32.5%) | Still weighted toward introductory recall. |
| Difficulty 2 | 37 (46.3%) | Dominant level. |
| Difficulty 3 | 11 (13.8%) | Applied scenarios are now represented more strongly. |
| Difficulty 4 | 4 (5.0%) | Multi-factor design questions added. |
| Difficulty 5 | 2 (2.5%) | Reserved for complex governance and architecture judgment. |
| `QT01` term-to-definition | 22 (31.4%) | Still recall-heavy, but no longer the only foundational family. |
| `QT03` feature identification | 39 (55.7%) | Still above the skill's 15% maximum; further enrichment is recommended. |
| `QT05`, `QT09`, `QT13`, `QT28`, `QT37` | 7 (10.0%) | Added responsibility, trade-off, configuration, security, and correct-statements coverage. |
| `QT07` scenario selection | 2 (2.9%) | Retained for basic scenario reasoning. |

The current 77.5% single-choice / 22.5% multi-select split remains somewhat more single-choice than the skill's preferred large-batch balance of approximately 60% single-choice, 25% two-correct, and 15% three-correct.

## Content strengths

- The collection covers useful AIF-C01-adjacent foundations: tokenization, transformers, GPT, RAG, QuickSight, evaluation metrics, data preparation, A2I, and Lambda design.
- The three scenario-style questions make the learner select an architecture rather than only recognize a definition.
- The repaired multi-select items now include a meaningful distractor instead of treating every option as correct.
- Sources are present on all questions: 28 use scikit-learn documentation, 24 use Hugging Face course material, 17 use AWS documentation, and one uses NIST guidance.

## Findings to address before treating this as a strong production batch

### High priority

1. **All 70 answer explanations are templated rather than instructional.** Each `answerDescription` labels the options, but uses the same generic statement (for example, that an option “matches the concept or requirement”). It does not explain *why* a correct option is correct or *why* a distractor is wrong. Replace these with question-specific A-D rationales; this is the collection's largest learning-quality gap.

2. **Question-family diversity is broader but still uneven.** Eight families are now represented, including security responsibility, trade-offs, configuration purpose, and correct-statements items. QT03 remains above the skill's 15% maximum, so additional compatible rewrites are still worthwhile.

3. **Difficulty now includes applied and advanced items, but remains weighted low.** The batch includes seven level-3, two level-4, and one level-5 question. Add more applied Bedrock/RAG architecture, model-evaluation trade-off, governance, data-quality, and operational-diagnosis problems in a future pass.

### Medium priority

4. **Resolved: the security/identity collection was mis-scoped.** The six QuickSight items were replaced with AIF-C01-relevant identity, governance, encryption, responsible-AI, and access-control questions.

5. **Some citations are broad rather than question-specific.** A single Hugging Face introductory course link backs many distinct transformer/GPT claims, and a single scikit-learn supervised-learning page backs many metrics and data-preparation claims. Retain the sources, but cite the most direct page or a complete book chapter per question during the next enrichment pass.

6. **Resolved: the near-duplicate RAG scenario was removed.** The replacement tests Amazon Bedrock Guardrails and its safety-policy role.

7. **Several stems are overly absolute or broad.** For example, “most suitable” architecture/model questions can become ambiguous as technology evolves. Add constraints (data type, latency, tuning, managed-service requirement, or deployment context) so that one answer is objectively best.

## Recommended next pass

1. Replace the generic `answerDescription` text with source-grounded explanations for all four options.
2. Completed: removed the near-duplicate RAG question and corrected the security/identity collection's scope.
3. Completed in this pass: the batch now represents eight question families and includes meaningful difficulty levels 3-5; QT03 concentration remains a future enrichment target.
4. Perform a source-by-source factual review after the revisions, prioritizing Amazon Bedrock, RAG, Amazon QuickSight Q, metrics, and AWS AI service claims.

## Verification recorded

```text
Validated 80 question(s).
```
