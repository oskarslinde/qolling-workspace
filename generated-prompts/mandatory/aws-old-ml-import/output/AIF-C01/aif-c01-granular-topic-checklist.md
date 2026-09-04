# AIF-C01 Granular Topic Checklist

## Purpose and use

This is a question-authoring checklist for the AIF-C01 collection. It decomposes the current AWS Certified AI Practitioner exam outline into deliberately narrow topic items. **Each row has a maximum budget of 10 questions**; split a row again rather than exceeding that budget. The narrowest terms can normally be assessed by one to three questions, while a small scenario set can use up to ten.

This checklist supports the current [AWS AIF-C01 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html) and its task statements. It is a study-content plan, not a reproduction of official exam questions or a claim that the guide is exhaustive.

## Authoring rules

- Keep a row's questions focused on its stated boundary; do not combine unrelated terms merely because they occur in the same domain.
- Prefer scenarios for selection, trade-off, risk, lifecycle, service-choice, and metric items. Reserve simple definitions for terms that genuinely need vocabulary recall.
- Cover AWS services at the decision/concept level expected of a foundational practitioner; do not test implementation, coding, infrastructure build-out, or mathematical derivation that AWS lists as out of scope.
- Record the primary row in the question metadata so future coverage can be counted reliably.

## Domain 1 â€” Fundamentals of AI and ML (20%)

.p

| ID | Topic / item / term | Boundary for this item | Max questions | Collection signal |
| --- | --- | --- | ---: | --- |
| 1.1.01 | Artificial intelligence (AI) | AI as systems performing tasks associated with human intelligence; distinguish from automation by fixed rules. | 3 | 3 — capacity reached |
| 1.1.02 | Machine learning (ML) | ML as learning patterns from data; distinguish from broader AI. | 3 | 3 — capacity reached |
| 1.1.03 | Generative AI (GenAI) | Generating new content versus predicting a label/value. | 4 | 4 — capacity reached |
| 1.1.04 | Deep learning | Neural-network-based ML and when it differs from general ML. | 3 | 3 — capacity reached |
| 1.1.05 | Neural networks | Inputs, layers, and learned parameters at a conceptual level only. | 4 | 4 — capacity reached |
| 1.1.06 | Model and algorithm | Model as learned artifact versus algorithm as method/procedure. | 3 | 3 — capacity reached |
| 1.1.07 | Training and inference | Learning from data versus producing predictions or generated responses. | 4 | 4 — capacity reached |
| 1.1.08 | Large language model (LLM) | Language-focused FM, its inputs/outputs, and suitable language tasks. | 4 | 4 — capacity reached |
| 1.1.09 | Foundation model (FM) | Broad pre-trained model adapted to many downstream tasks. | 4 | 4 — capacity reached |
| 1.1.10 | Agentic AI | Goal-driven agents that reason, use tools, and act within defined controls. | 5 | 5 — capacity reached |
| 1.1.11 | Computer vision | Image/video understanding use cases versus language, speech, and tabular ML. | 3 | 3 — capacity reached |
| 1.1.12 | Natural language processing (NLP) | Understanding, extracting, classifying, or transforming human language. | 4 | 4 — capacity reached |
| 1.1.13 | Bias and fairness | Systematic unequal outcomes and fairness considerations; keep separate from security. | 5 | 5 — capacity reached |
| 1.1.14 | Batch inference | Generating predictions for an accumulated dataset without immediate response needs. | 3 | 3 — capacity reached |
| 1.1.15 | Real-time inference | Low-latency, request-response predictions for interactive use cases. | 3 | 3 — capacity reached |
| 1.1.16 | Asynchronous inference | Long-running or deferred inference where callers need not wait synchronously. | 3 | 3 — capacity reached |
| 1.1.17 | Serverless inference | Managed, event/request-driven inference without managing servers. | 3 | 3 — capacity reached |
| 1.1.18 | Labeled and unlabeled data | Presence or absence of target labels and relation to learning choices. | 4 | 4 — capacity reached |
| 1.1.19 | Tabular and structured data | Rows/columns with defined schema versus less structured forms. | 3 | 3 — capacity reached |
| 1.1.20 | Unstructured data | Text, image, audio, and video data without a fixed tabular schema. | 3 | 3 — capacity reached |
| 1.1.21 | Time-series data | Ordered observations over time and basic forecasting use cases. | 3 | 3 — capacity reached |
| 1.1.22 | Image and text data | Modality characteristics relevant to selecting an AI technique or service. | 4 | 4 — capacity reached |
| 1.1.23 | Supervised learning | Learning from labeled examples; distinguish classification and regression. | 5 | 5 — capacity reached |
| 1.1.24 | Unsupervised learning | Discovering structure in unlabeled data; focus on clustering. | 4 | 4 — capacity reached |
| 1.1.25 | Reinforcement learning | Learning through actions, feedback/rewards, and policy improvement. | 4 | 4 — capacity reached |

#### 1.1 coverage view

The foundational batch is intentionally one-to-one: each question has one primary checklist ID in its tags and covers one previously empty row. Existing coverage for neural networks, computer vision, and time-series data is retained separately in the table above.

| Basic-concepts question | Checklist ID | Primary focus |
| ---: | --- | --- |
| 1–4 | `1.1.01`–`1.1.04` | AI, ML, GenAI, and deep-learning distinctions |
| 5–9 | `1.1.06`–`1.1.10` | Model/algorithm, training/inference, LLMs, FMs, and agents |
| 10–11 | `1.1.12`–`1.1.13` | NLP and fairness |
| 12–15 | `1.1.14`–`1.1.17` | Batch, real-time, asynchronous, and serverless inference |
| 16–19 | `1.1.18`–`1.1.20`, `1.1.22` | Labels, data structure, unstructured data, and modality fit |
| 20–22 | `1.1.23`–`1.1.25` | Supervised, unsupervised, and reinforcement learning |

### 1.2 Practical AI use cases

| ID | Topic / item / term | Boundary for this item | Max questions | Collection signal |
| --- | --- | --- | ---: | --- |
| 1.2.01 | AI value: decision support | Augmenting human decisions rather than replacing required accountability. | 4 | 4 — capacity reached |
| 1.2.02 | AI value: automation and scale | Repetitive-work automation and scalable pattern recognition. | 4 | 4 — capacity reached |
| 1.2.03 | When AI/ML is unsuitable | Deterministic requirements, inadequate value, unsuitable data, or disproportionate cost. | 6 | 6 — capacity reached |
| 1.2.04 | Cost-benefit assessment | Compare expected value, risk, data readiness, operating cost, and simpler alternatives. | 5 | 5 — capacity reached |
| 1.2.05 | Regression | Predicting a numeric value, such as demand, price, or duration. | 4 | 4 — capacity reached |
| 1.2.06 | Classification | Assigning categories, such as fraud/not-fraud or sentiment class. | 4 | 4 — capacity reached |
| 1.2.07 | Clustering | Grouping similar records without predefined labels. | 4 | 4 — capacity reached |
| 1.2.08 | Speech recognition | Speech-to-text use cases and distinction from speech synthesis. | 3 | 3 — capacity reached |
| 1.2.09 | Recommendation systems | Ranking or suggesting items from user/item signals. | 3 | 3 — capacity reached |
| 1.2.10 | Fraud detection | Classification/anomaly-style fraud use cases and human review need. | 4 | 4 — capacity reached |
| 1.2.11 | Forecasting | Future-value prediction using historical, often time-series, data. | 3 | 3 — capacity reached |
| 1.2.12 | Knowledge bases | Retrieving approved organizational knowledge for answers or assistance. | 4 | 4 — capacity reached |
| 1.2.13 | AI agents in business workflows | Selecting an agent for multi-step, tool-using work rather than a single model response. | 5 | 5 — capacity reached |
| 1.2.14 | SageMaker AI | When its managed ML capabilities fit a use case at a high level. | 4 | 4 — capacity reached |
| 1.2.15 | Amazon Transcribe | Speech-to-text service selection. | 2 | 2 — capacity reached |
| 1.2.16 | Amazon Translate | Text translation service selection. | 2 | 2 — capacity reached |
| 1.2.17 | Amazon Comprehend | Managed NLP analysis, such as entity or sentiment extraction. | 3 | 3 — capacity reached |
| 1.2.18 | Amazon Lex | Conversational bot interface and intent-based interaction. | 3 | 3 — capacity reached |
| 1.2.19 | Amazon Polly | Text-to-speech service selection. | 2 | 2 — capacity reached |
| 1.2.20 | Traditional ML versus FM | Choose by explainability, task fit, regulation, data, cost, and operational constraints. | 7 | 7 — capacity reached |

### 1.3 AI/ML development lifecycle

| ID | Topic / item / term | Boundary for this item | Max questions | Collection signal |
| --- | --- | --- | ---: | --- |
| 1.3.01 | Pipeline stages | Problem, data, development, evaluation, deployment, monitoring, and feedback as a lifecycle. | 6 | 6 — capacity reached |
| 1.3.02 | Data preparation in the lifecycle | Data quality/readiness as an input to training and evaluation, not implementation techniques. | 4 | 4 — capacity reached |
| 1.3.03 | Open-source pre-trained FMs | Benefits and considerations of selecting an existing open model. | 4 | 4 — capacity reached |
| 1.3.04 | Custom model training | When a custom-trained model is appropriate versus using a managed/pre-trained model. | 4 | 4 — capacity reached |
| 1.3.05 | Managed API production model | Consuming a managed model/API versus hosting a model yourself. | 4 | 4 — capacity reached |
| 1.3.06 | Self-hosted API production model | Operational ownership and trade-offs of hosting a model/API. | 4 | 4 — capacity reached |
| 1.3.07 | AWS services by lifecycle stage | High-level service mapping: Bedrock, SageMaker AI, Amazon Q, Amazon Quick, and Kiro. | 8 | 8 — capacity reached |
| 1.3.08 | Experimentation and repeatability | Experiments, reproducibility, and repeatable processes as MLOps concepts. | 4 | 4 — capacity reached |
| 1.3.09 | Scalability, technical debt, and production readiness | Operational concepts that distinguish a prototype from a sustainable ML system. | 5 | 5 — capacity reached |
| 1.3.10 | Model monitoring and retraining | Detecting degradation and deciding when a model needs review or retraining. | 5 | 5 — capacity reached |
| 1.3.11 | Accuracy | Overall correct-prediction metric and its limitation with uneven classes. | 4 | 4 — capacity reached |
| 1.3.12 | Precision | Correctness among positive predictions and false-positive trade-off. | 4 | 4 — capacity reached |
| 1.3.13 | Recall | Ability to find actual positives and false-negative trade-off. | 4 | 4 — capacity reached |
| 1.3.14 | F1 score | Precision-recall balance and when it is useful. | 3 | 3 — capacity reached |
| 1.3.15 | Business outcome metrics | Cost per user, development cost, feedback, and ROI alongside model metrics. | 6 | 6 — capacity reached |

## Domain 2 â€” Fundamentals of GenAI (24%)

### 2.1 Basic GenAI concepts

| ID | Topic / item / term | Boundary for this item | Max questions | Collection signal |
| --- | --- | --- | ---: | --- |
| 2.1.01 | Tokens | Token units and the effect on context, latency, and inference cost. | 5 | 2 — cloud-services question 2; generative-ai question 16 |
| 2.1.02 | Chunking | Splitting source content for retrieval and context use. | 4 | 1 — additional question 2 |
| 2.1.03 | Embeddings and vectors | Semantic numeric representations used for similarity/retrieval. | 5 |
| 2.1.04 | Prompt engineering | Shaping model input to improve useful, constrained output. | 5 |
| 2.1.05 | Transformer LLMs | Attention/transformer role at a conceptual level, not architecture mathematics. | 5 | 4 — generative-ai questions 4, 12, 15, 24 |
| 2.1.05a | Transformer encoder, decoder, and causal masking | Roles of encoder/decoder components and masking in autoregressive language generation. | 5 | 3 — cloud-services question 1; generative-ai questions 7, 8 |
| 2.1.05b | Self-attention mechanics | Query/key/value roles, attention-score scaling, and token relationship capture. | 5 | 5 — generative-ai questions 3, 10, 11, 17; machine-learning question 7 |
| 2.1.05c | Positional encoding | Representing token order in transformer input sequences. | 3 | 1 — generative-ai question 18 |
| 2.1.06 | Multimodal models | Models that accept or produce more than one modality. | 3 |
| 2.1.07 | Diffusion models | Generative image/media concept and high-level fit. | 3 |
| 2.1.08 | Content-generation use cases | Image, video, audio, text, code, translation, and summarization use-case fit. | 8 | 3 — generative-ai questions 1, 5, 25 |
| 2.1.09 | AI assistants and customer-service agents | Conversational support use cases, escalation, and business constraints. | 5 |
| 2.1.10 | GenAI search and recommendations | Generative search/answering versus classical retrieval/recommendation. | 4 |
| 2.1.11 | FM lifecycle | Data/model selection through pre-training, fine-tuning, evaluation, deployment, and feedback. | 7 |
| 2.1.12 | Token-based pricing | Input/output token use, model selection, and performance/cost trade-off. | 5 |
| 2.1.13 | Context engineering | Supplying useful context, retrieved evidence, and instructions within context limits. | 5 |
| 2.1.14 | Multi-agent system patterns | Coordinating specialized agents for complex tasks. | 4 |
| 2.1.15 | Model Context Protocol (MCP) | MCP's role connecting agents to external systems/tools. | 3 |
| 2.1.16 | Agent communication, memory, tools, and orchestration | Distinguish these four agentic application concerns. | 7 |

### 2.2 Capabilities and limitations for business problems

| ID | Topic / item / term | Boundary for this item | Max questions | Collection signal |
| --- | --- | --- | ---: | --- |
| 2.2.01 | GenAI adaptability and responsiveness | Value of flexible, conversational, content-producing interfaces. | 3 |
| 2.2.02 | Hallucinations and inaccuracy | Unsupported/incorrect output, impacts, and appropriate mitigations. | 6 |
| 2.2.03 | Interpretability and nondeterminism | Why response variability and opacity affect use-case suitability. | 4 |
| 2.2.04 | Model selection criteria | Model type, capability, performance, constraint, compliance, cost, latency, and complexity. | 9 |
| 2.2.05 | Business value of GenAI | Efficiency, ROI, conversion, revenue per user, customer lifetime value, and accuracy. | 7 |
| 2.2.06 | Cross-domain performance | Evaluating whether a model transfers adequately across business contexts. | 3 |

### 2.3 AWS infrastructure and GenAI technologies

| ID | Topic / item / term | Boundary for this item | Max questions | Collection signal |
| --- | --- | ---: | ---: | --- |
| 2.3.01 | Amazon Bedrock | Managed service role for accessing/building with FMs. | 5 |
| 2.3.02 | SageMaker AI and SageMaker JumpStart | High-level purpose and selection relative to Bedrock. | 5 |
| 2.3.03 | Amazon Quick and Kiro | High-level use in AI-assisted productivity/development workflows. | 4 |
| 2.3.04 | Strands Agents | High-level agent-building role and when it is relevant. | 3 |
| 2.3.05 | Amazon Bedrock AgentCore | High-level purpose for production agent capabilities. | 4 |
| 2.3.06 | AWS GenAI service benefits | Accessibility, speed to market, lower operational barrier, cost-effectiveness, and business fit. | 6 |
| 2.3.07 | AWS infrastructure benefits | Security, compliance, responsibility, and safety as selection factors. | 5 |
| 2.3.08 | GenAI service cost trade-offs | Responsiveness, availability, redundancy, performance, Region coverage, tokens, provisioned throughput, and custom models. | 9 |

## Domain 3 â€” Applications of Foundation Models (28%)

### 3.1 FM application design considerations

| ID | Topic / item / term | Boundary for this item | Max questions | Collection signal |
| --- | --- | --- | ---: | --- |
| 3.1.01 | FM selection: modality and capability | Select model based on required input/output modalities and task capability. | 5 | 1 — generative-ai question 9 |
| 3.1.02 | FM selection: latency, size, complexity, and language | Operational/performance criteria independent of customization. | 6 |
| 3.1.03 | FM selection: input/output length and prompt caching | Context/output requirements and caching implications. | 5 | 1 — additional question 4 |
| 3.1.04 | Temperature | Variation/creativity trade-off in generation. | 4 | 1 — additional question 9 |
| 3.1.05 | Input and output length parameters | Response completeness, context capacity, latency, and cost trade-off. | 4 |
| 3.1.06 | Retrieval-Augmented Generation (RAG) | Retrieve grounded knowledge before generation; business applications and limits. | 7 | 2 — generative-ai questions 14, 21 |
| 3.1.07 | Amazon Bedrock Knowledge Bases | Managed knowledge-base role in RAG applications. | 4 | 1 — additional question 1 |
| 3.1.08 | Vector database service choices | Amazon OpenSearch Service, Aurora, Neptune, and RDS for PostgreSQL as embedding stores. | 8 | 1 — generative-ai question 20 |
| 3.1.09 | FM customization approaches | Pre-training, fine-tuning, in-context learning, RAG, and distillation compared by cost and fit. | 9 |
| 3.1.10 | AI agent role and business applications | Agent selection for orchestrated, tool-using, multi-step tasks. | 5 | 1 — generative-ai question 22 |

### 3.2 Prompt engineering

| ID | Topic / item / term | Boundary for this item | Max questions | Collection signal |
| --- | --- | --- | ---: | --- |
| 3.2.01 | Prompt context and instruction | Roles of background/evidence and explicit task direction. | 5 |
| 3.2.02 | Negative prompts | Constraints describing undesired content or behavior. | 3 |
| 3.2.03 | Zero-shot prompting | Direct instruction without examples. | 3 |
| 3.2.04 | Single-shot and few-shot prompting | One/multiple examples to establish format, behavior, or classification pattern. | 5 |
| 3.2.05 | Chain-of-thought prompting | Reasoning-oriented prompt technique and appropriate safe use at a conceptual level. | 4 |
| 3.2.06 | Prompt templates | Reusable parameterized prompt structure. | 4 |
| 3.2.07 | Prompt best practices | Specificity, concision, iteration/experimentation, and response-quality improvement. | 6 |
| 3.2.08 | Guardrails in prompting | Prompt/output controls as a quality and safety measure. | 4 |
| 3.2.09 | Prompt exposure and poisoning | Confidential prompt leakage and malicious/contaminated prompt content. | 5 |
| 3.2.10 | Prompt hijacking and jailbreaking | Attempts to override intended model instructions or safety constraints. | 5 |
| 3.2.11 | Amazon Bedrock Prompt Management | Prompt versioning, organization, testing, and reuse. | 4 | 1 — additional question 3 |

### 3.3 FM training and fine-tuning

| ID | Topic / item / term | Boundary for this item | Max questions | Collection signal |
| --- | --- | --- | ---: | --- |
| 3.3.01 | FM pre-training | Broad initial learning from large datasets. | 3 | 1 — generative-ai question 6 |
| 3.3.02 | Fine-tuning | Adapting an existing FM to a targeted task/domain. | 4 |
| 3.3.03 | Continuous pre-training | Further broad/domain learning before task-specific adaptation. | 3 |
| 3.3.04 | Model distillation | Transferring capability from a larger model to a smaller model. | 3 |
| 3.3.05 | Instruction tuning | Fine-tuning with instruction/response data to improve instruction following. | 3 |
| 3.3.06 | Domain adaptation and transfer learning | Reusing learned knowledge for a new domain/task. | 4 | 1 — machine-learning question 20 |
| 3.3.07 | Fine-tuning data curation and governance | Data quality, allowed use, and managed preparation for customization. | 5 |
| 3.3.08 | Fine-tuning dataset size, labeling, and representativeness | Dataset sufficiency and balanced representative examples. | 5 |
| 3.3.09 | Reinforcement learning from human feedback (RLHF) | Human preference feedback used to shape FM behavior. | 4 |

### 3.4 FM and FM-application evaluation

| ID | Topic / item / term | Boundary for this item | Max questions | Collection signal |
| --- | --- | --- | ---: | --- |
| 3.4.01 | Human-in-the-loop evaluation | Human judgment in model quality/safety evaluation. | 4 |
| 3.4.02 | Benchmark datasets | Standardized evaluation data and its limitations. | 3 |
| 3.4.03 | Amazon Bedrock Model Evaluation | Managed evaluation capability and correct selection contexts. | 4 |
| 3.4.04 | ROUGE | Overlap-oriented metric for generated-text evaluation. | 3 |
| 3.4.05 | BLEU | N-gram precision-oriented translation/generation metric. | 3 |
| 3.4.06 | BERTScore | Semantic-similarity evaluation metric using contextual embeddings. | 3 |
| 3.4.07 | LLM-as-a-judge | Using an LLM as an evaluator with appropriate caution/validation. | 4 |
| 3.4.08 | Business-objective fitness | Productivity, engagement, and task outcomes as evidence an FM is useful. | 5 |
| 3.4.09 | RAG, agent, and workflow evaluation | Evaluate grounded answer quality, tool/task success, and end-to-end workflow behavior. | 6 |
| 3.4.10 | Task completion, satisfaction, and cost per interaction | Application-level metrics tied to business objectives. | 5 |

## Domain 4 â€” Guidelines for Responsible AI (14%)

### 4.1 Responsible AI development

| ID | Topic / item / term | Boundary for this item | Max questions | Collection signal |
| --- | --- | --- | ---: | --- |
| 4.1.01 | Responsible AI characteristics | Bias, fairness, inclusivity, robustness, safety, and veracity as distinct concerns. | 8 | 2 — additional question 8; machine-learning question 25 |
| 4.1.02 | Amazon Bedrock Guardrails | Using guardrails to enforce content and safety policies. | 5 | 3 — additional question 5; security question 3; generative-ai question 26 |
| 4.1.03 | Environmental considerations and sustainability | Responsible model selection based on resource/environmental impact. | 3 |
| 4.1.04 | GenAI intellectual-property risk | Copyright/IP claims and provenance concerns in generated or training content. | 4 |
| 4.1.05 | Trust, user risk, and hallucination legal risk | Customer trust/end-user harm and risks of incorrect outputs. | 5 |
| 4.1.06 | Inclusive, diverse, curated, and balanced datasets | Dataset traits that reduce exclusion/bias risk. | 5 |
| 4.1.07 | Bias and variance | Group impact, inaccuracy, overfitting, and underfitting. | 6 |
| 4.1.08 | Bias/trustworthiness detection | Label-quality review, human audits, and subgroup analysis. | 5 | 1 — additional question 6 |
| 4.1.09 | Amazon Augmented AI (A2I) | Human review workflows for AI predictions/outputs. | 4 | 2 — additional question 7; machine-learning question 26 |

### 4.2 Transparency and explainability

| ID | Topic / item / term | Boundary for this item | Max questions | Collection signal |
| --- | --- | --- | ---: | --- |
| 4.2.01 | Transparent/explainable versus opaque models | Why a stakeholder can understand a model/result, and why that matters. | 5 |
| 4.2.02 | SageMaker Model Cards | Communicating model purpose, performance, limitations, and provenance. | 4 |
| 4.2.03 | Evaluation, open-source model, data, and licensing evidence | Inputs to assessing transparency/explainability and usage suitability. | 5 |
| 4.2.04 | Safety-transparency trade-offs | Interpretability/performance and disclosure/safety considerations. | 4 |
| 4.2.05 | Human-centered explainable AI | User feedback and clear communication of AI-supported decisions. | 4 |

## Domain 5 â€” Security, Compliance, and Governance for AI Solutions (14%)

### 5.1 Securing AI systems

| ID | Topic / item / term | Boundary for this item | Max questions | Collection signal |
| --- | --- | --- | ---: | --- |
| 5.1.01 | IAM roles, policies, and permissions | Least-privilege access to AI resources/data. | 5 | 1 — security question 2 |
| 5.1.02 | Encryption | Encryption at rest and in transit for AI data and interactions. | 4 | 1 — security question 1 |
| 5.1.03 | Amazon Macie | Sensitive-data discovery role in securing AI data. | 3 |
| 5.1.04 | AWS PrivateLink | Private service connectivity as an AI-system security control. | 3 | 1 — security question 5 |
| 5.1.05 | Shared responsibility model | AWS/customer responsibility boundaries for AI solutions. | 4 | 1 — security question 6 |
| 5.1.06 | AgentCore Identity and Policy in AgentCore | Identity and policy controls for agentic applications. | 4 |
| 5.1.07 | Data lineage and source citation | Recording origins/sources supporting model or generated outputs. | 4 |
| 5.1.08 | Secure data engineering | Data quality, privacy-enhancing technologies, access control, and integrity. | 7 |
| 5.1.09 | Application and infrastructure security | Threat detection, vulnerability management, and infrastructure protection. | 5 |
| 5.1.10 | Data leakage prevention | Preventing unauthorized exposure in prompts, data stores, or responses. | 4 |
| 5.1.11 | Prompt injection | Malicious input influencing a model/application beyond intended instructions. | 5 |
| 5.1.12 | Output filtering, validation, and toxicity | Controls that inspect/block unsafe, unsuitable, or malformed outputs. | 5 |
| 5.1.13 | Audit trails and interaction logging | Records needed for oversight, investigation, and compliance. | 4 | 2 — additional question 10; security question 4 |
| 5.1.14 | Hallucination detection and grounding | RAG grounding, output validation, and confidence scoring for accuracy. | 5 |

### 5.2 Governance and compliance

| ID | Topic / item / term | Boundary for this item | Max questions | Collection signal |
| --- | --- | --- | ---: | --- |
| 5.2.01 | AWS Config | Configuration assessment/compliance role. | 3 |
| 5.2.02 | Amazon Inspector | Vulnerability management role. | 3 |
| 5.2.03 | AWS Artifact | Access to compliance reports/agreements. | 3 |
| 5.2.04 | AWS CloudTrail | API/activity auditing role. | 3 |
| 5.2.05 | AWS Trusted Advisor | Best-practice checks and governance-support role. | 3 |
| 5.2.06 | Data lifecycle, residency, and retention | Where data is stored, how long it is kept, and disposal obligations. | 6 |
| 5.2.07 | Governance logging, monitoring, and observation | Continuous evidence and oversight for AI-system behavior/data use. | 5 |
| 5.2.08 | Policies, review cadence, and review strategy | Recurring governance controls rather than one-time compliance checks. | 5 |
| 5.2.09 | Governance frameworks and transparency standards | Applying a framework, including the Generative AI Security Scoping Matrix, to scope controls. | 5 |
| 5.2.10 | Team training requirements | Training/awareness as a governance control for AI systems. | 3 |

## Coverage ledger template

Use this compact format when a row begins to receive questions. Keep the detailed checklist above as the source of item identity.

| Item ID | Existing questions | Planned questions | Total | Maximum | Status / next action |
| --- | ---: | ---: | ---: | ---: | --- |
| `x.x.xx` | 0 | 0 | 0 | 10 | Not started |

When a row reaches ten questions, only replace or improve questions within that row. To add a new learning objective, create a narrower child item with its own maximum rather than expanding the existing row.
