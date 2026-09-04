# Qolling Technical Question Type Specification

## 1. Purpose

This specification defines the question variations that can be generated for Qolling technical learning content.

The primary goals are:

* create meaningful variation between questions;
* test understanding rather than only memorization;
* support technical subjects such as AWS, Java, Spring, Docker, Kubernetes, SQL, networking, security, etc.;
* avoid generating the same "Which statement is correct?" pattern repeatedly;
* provide clear instructions that an AI question generator can follow.

Every question MUST contain exactly **4 answer options**.

A question MAY have:

* exactly **1 correct answer**, or
* **2–3 correct answers**.

Four correct answers should normally be avoided because there is no meaningful distractor.

---

# 2. Core Question Types

## QT01 — Term → Definition

**Purpose:** Test whether the learner understands the meaning of a technical term, service, concept, or component.

**Correct answers:** 1

**Structure:**

> What is `<term>`?

The answers contain different definitions. Exactly one correctly describes the term.

**Example:**

> What is Amazon SQS?

* A managed message queue service. ✅
* A relational database service.
* A container orchestration platform.
* A DNS resolution service.

**Best for:**

* terminology;
* first exposure to concepts;
* service identification;
* certification fundamentals.

**Generation rule:** Distractors should preferably be definitions of related technologies rather than obviously unrelated nonsense.

---

## QT02 — Definition → Term

**Purpose:** Reverse the normal terminology question.

Instead of giving the term, describe the concept and ask the learner to identify it.

**Correct answers:** 1

**Structure:**

> Which service/concept matches the following description?

**Example:**

> Which AWS service provides managed message queues that allow application components to communicate asynchronously?

* Amazon SQS ✅
* Amazon SNS
* Amazon RDS
* Amazon Route 53

This variation helps prevent simple term-recognition memorization.

---

# 3. Feature Recognition

## QT03 — Feature Identification

**Purpose:** Determine whether the learner understands what a technology provides.

**Correct answers:** 2–3

**Structure:**

> Which of the following are features/capabilities of `<technology>`?

**Example:**

> Which capabilities are provided by Amazon SQS?

* Message queues ✅
* Dead-letter queues ✅
* Visibility timeouts ✅
* Relational joins

This is particularly useful because the learner must evaluate every option independently.

---

## QT04 — Non-Feature / Exception

**Purpose:** Test understanding from the opposite direction.

**Correct answers:** 1

**Structure:**

> Which of the following is NOT a feature of `<technology>`?

**Example:**

> Which capability is NOT provided by Amazon SQS?

* Visibility timeout
* Dead-letter queues
* FIFO queues
* SQL joins ✅

**Important:** Use this type moderately. Negative wording creates cognitive load and should be clearly emphasized with words such as **NOT**.

---

# 4. Responsibility / Purpose Questions

## QT05 — Service Responsibility

**Purpose:** Test what responsibility belongs to a particular component.

**Correct answers:** 1 or multiple

**Structure:**

> What is `<component>` responsible for?

or

> Which responsibilities belong to `<component>`?

**Example:**

> Which responsibility belongs primarily to an Application Load Balancer?

* Distributing HTTP requests across targets ✅
* Persisting relational data
* Compiling Java applications
* Managing DNS zones

---

## QT06 — Service Selection

**Purpose:** Test whether the learner can choose the correct technology for a requirement.

**Correct answers:** 1

**Structure:**

> Which technology/service would you use to achieve `<requirement>`?

**Example:**

> You need a managed AWS service for storing objects such as images and backups. Which service should you use?

* Amazon S3 ✅
* Amazon RDS
* Amazon SQS
* Amazon ECS

This type tests practical recognition rather than definition recall.

---

# 5. Scenario-Based Questions

## QT07 — Basic Scenario Selection

**Purpose:** Apply knowledge to a realistic technical situation.

**Correct answers:** 1

**Structure:**

1. Describe a technical scenario.
2. Give a requirement/problem.
3. Ask for the best solution.

**Example:**

> An application sends jobs to background workers. Workers may temporarily become unavailable, but jobs must not be lost. Which AWS service is the best fit?

* Amazon SQS ✅
* Amazon Route 53
* Amazon CloudFront
* AWS IAM

---

## QT08 — Scenario: Multiple Required Components

**Purpose:** Test architecture understanding where several choices contribute to the solution.

**Correct answers:** 2–3

**Example:**

> A web application must run containers, distribute incoming HTTP traffic, and automatically replace unhealthy application instances. Which technologies could be part of this solution?

* ECS ✅
* Application Load Balancer ✅
* ECS Service health management ✅
* Amazon Athena

This tests whether the learner understands a combination of services.

---

## QT09 — Best Solution / Trade-Off

**Purpose:** Test architectural judgement.

Several answers may technically work, but one should be the **best** according to the stated requirements.

**Correct answers:** 1

**Structure:**

> Given `<constraints>`, which solution is MOST appropriate?

**Example:**

> A company needs an asynchronous communication mechanism between two microservices. Messages must survive temporary consumer outages. Which solution is most appropriate?

* Amazon SQS ✅
* Direct synchronous HTTP calls
* Store messages in application memory
* DNS-based communication

**Generation rule:** The question must provide enough constraints for there to be an objectively preferable answer.

Avoid vague "best practice" questions without context.

---

# 6. Behaviour and Mechanics

## QT10 — What Happens Next?

**Purpose:** Test understanding of runtime behaviour.

**Correct answers:** 1

**Structure:**

> `<event>` happens. What happens next?

**Example:**

> An SQS consumer receives a message but does not delete it before the visibility timeout expires. What happens?

* The message becomes visible again. ✅
* The message is permanently deleted.
* The queue is deleted.
* The producer receives an exception.

This works particularly well for:

* transactions;
* Docker containers;
* Kubernetes;
* messaging;
* HTTP;
* JVM behaviour;
* database locking.

---

## QT11 — Sequence / Lifecycle

**Purpose:** Test understanding of a process or lifecycle.

**Correct answers:** 1

**Structure:**

> Which sequence correctly describes `<process>`?

Each answer contains a different ordered sequence.

**Example:**

> Which sequence best represents a typical Docker image workflow?

* Dockerfile → build image → run container ✅
* Container → Dockerfile → compile kernel
* Image → Dockerfile → database
* Dockerfile → container → build image

---

## QT12 — Cause → Effect

**Purpose:** Test whether the learner understands consequences.

**Correct answers:** 1 or multiple

**Structure:**

> What can happen when `<technical condition>` occurs?

**Example:**

> What can happen if an SQS visibility timeout is shorter than the processing time?

* The message may become visible while still being processed. ✅
* Another consumer may receive the same message. ✅
* The queue automatically becomes FIFO.
* The message automatically moves to S3.

---

# 7. Configuration Questions

## QT13 — Configuration Purpose

**Purpose:** Test understanding of configuration properties, annotations, flags, CLI parameters, or settings.

**Correct answers:** 1

**Example:**

> What is the purpose of `spring.jpa.hibernate.ddl-auto`?

* Control Hibernate schema-generation behaviour. ✅
* Configure HTTP port forwarding.
* Configure JVM garbage collection.
* Define Docker networking.

---

## QT14 — Correct Configuration

**Purpose:** Test recognition of valid configuration/code.

**Correct answers:** 1

**Example:**

> Which Docker command displays the logs of a running container?

* `docker logs <container>` ✅
* `docker inspect logs <container>`
* `docker build logs <container>`
* `docker attach-image <container>`

This type can contain:

* code fragments;
* YAML;
* SQL;
* CLI commands;
* annotations;
* configuration properties.

---

# 8. Code Understanding

## QT15 — Code Result

**Purpose:** Test understanding of what code actually does.

**Correct answers:** 1

**Structure:**

Provide a short code snippet and ask:

> What happens when this code executes?

Examples include:

* Java;
* SQL;
* Spring;
* shell commands;
* configuration;
* Dockerfiles.

The snippet should be short enough to understand without an IDE.

---

## QT16 — Code Problem Identification

**Purpose:** Find an error, bug, or problematic behaviour.

**Correct answers:** 1

**Example structure:**

> What is the main problem with this code?

Possible topics:

* concurrency bug;
* incorrect transaction handling;
* SQL issue;
* null handling;
* Spring dependency configuration;
* resource leak.

Avoid questions based purely on obscure compiler trivia.

---

## QT17 — Code Improvement

**Purpose:** Identify the most appropriate improvement.

**Correct answers:** 1

**Example:**

> This Java method creates a new database connection for every item in a loop. Which change would most likely improve the implementation?

The learner evaluates alternatives rather than merely spotting syntax.

---

# 9. Comparison Questions

## QT18 — Technology Comparison

**Purpose:** Understand differences between similar technologies.

**Correct answers:** 1 or multiple

**Example:**

> Which statements correctly describe differences between Amazon SQS and Amazon SNS?

* SQS primarily uses queues. ✅
* SNS supports publish/subscribe delivery. ✅
* SQS is a relational database.
* SNS executes Docker containers.

Useful comparisons:

* SQS vs SNS;
* ECS vs EKS;
* optimistic vs pessimistic locking;
* SQL vs NoSQL;
* REST vs messaging;
* Docker image vs container.

---

## QT19 — When to Use A Instead of B

**Purpose:** Test decision-making between technologies that overlap.

**Correct answers:** 1

**Example:**

> When would SQS generally be preferred over SNS?

* When messages should wait in a queue for consumers to process them. ✅
* When relational queries are required.
* When DNS records must be managed.
* When static files must be cached globally.

---

# 10. Constraint-Based Questions

## QT20 — Requirement Matching

**Purpose:** Identify which solutions satisfy explicit requirements.

**Correct answers:** 2–3

**Example:**

> A workload requires horizontal scaling. Which approaches can support this?

* Run multiple stateless application instances. ✅
* Place instances behind a load balancer. ✅
* Store all application state only in local memory.
* Use autoscaling. ✅

This encourages the learner to reason about several independent conditions.

---

## QT21 — Limitation Recognition

**Purpose:** Understand what a technology cannot do or where it has constraints.

**Correct answers:** 1 or multiple

**Example:**

> Which limitations should be considered when designing around `<technology>`?

This is particularly useful for advanced questions because expertise often depends on understanding limitations rather than features.

---

# 11. Troubleshooting Questions

## QT22 — Symptom → Likely Cause

**Purpose:** Develop debugging ability.

**Correct answers:** 1

**Structure:**

> `<symptom>` occurs. What is the most likely cause?

**Example:**

> A Docker container exits immediately after starting. What is a likely explanation?

* Its main process terminated. ✅
* Docker automatically deletes all running containers after startup.
* DNS cannot contain uppercase letters.
* The image must always expose port 80.

---

## QT23 — Symptom → Diagnostic Action

**Purpose:** Test what the developer should inspect first.

**Correct answers:** 1

**Example:**

> A containerized service fails during startup. Which command would most directly help inspect its application output?

* `docker logs <container>` ✅
* `docker build`
* `docker push`
* `docker volume create`

This is highly practical for engineering learning.

---

## QT24 — Fix Selection

**Purpose:** Choose the correct response to a technical problem.

**Correct answers:** 1

**Structure:**

> `<problem>` is occurring. Which change would most directly solve it?

The distractors should represent plausible but incorrect troubleshooting steps.

---

# 12. Architecture Questions

## QT25 — Component Placement

**Purpose:** Understand where a component belongs within an architecture.

**Correct answers:** 1

**Example:**

> Which component would normally sit between external HTTP clients and multiple backend service instances?

* Load balancer ✅
* Database migration script
* Maven compiler
* Object storage bucket

---

## QT26 — Architecture Responsibility Mapping

**Purpose:** Determine which components fulfil particular architectural responsibilities.

**Correct answers:** 2–3

**Example:**

> Which components could contribute to making an application highly available?

* Multiple service instances ✅
* Load balancer ✅
* Health checks ✅
* Hard-coded localhost addresses

---

## QT27 — Architecture Failure Scenario

**Purpose:** Understand how systems behave when something fails.

**Correct answers:** 1

**Example:**

> One instance behind a load balancer fails its health check. What should normally happen?

* Traffic stops being routed to that instance. ✅
* All DNS records are deleted.
* The database is recreated.
* All other instances stop.

---

# 13. Security Questions

## QT28 — Security Responsibility

**Purpose:** Understand what a security mechanism protects against or controls.

**Correct answers:** 1 or multiple

Examples:

* authentication;
* authorization;
* IAM;
* encryption;
* TLS;
* CSRF;
* CORS;
* network security groups.

---

## QT29 — Security Risk Identification

**Purpose:** Identify insecure patterns.

**Correct answers:** 1 or multiple

**Example:**

> Which practices introduce security risks?

* Storing passwords in plaintext. ✅
* Giving every IAM user administrator access. ✅
* Encrypting traffic with TLS.
* Rotating credentials.

---

# 14. Performance and Scalability

## QT30 — Bottleneck Identification

**Purpose:** Determine which component is causing or could cause a performance problem.

**Correct answers:** 1

**Example structure:**

> `<performance symptoms>`. Which component is the most likely bottleneck?

---

## QT31 — Scaling Strategy

**Purpose:** Understand vertical/horizontal scaling, caching, batching, concurrency, etc.

**Correct answers:** 1 or multiple

**Example:**

> Which approaches could reduce database load?

* Caching frequently requested data. ✅
* Batching appropriate requests. ✅
* Increasing unnecessary database queries.
* Reusing calculated results. ✅

---

# 15. Data and Persistence

## QT32 — Data Model Selection

**Purpose:** Choose an appropriate persistence mechanism based on data requirements.

**Correct answers:** 1

Example requirements:

* relational consistency;
* key/value access;
* documents;
* object storage;
* temporary caching.

---

## QT33 — Transaction Behaviour

**Purpose:** Test understanding of transaction semantics.

**Correct answers:** 1

Topics may include:

* commit;
* rollback;
* isolation;
* optimistic locking;
* pessimistic locking;
* atomicity.

---

## QT34 — Query Behaviour

**Purpose:** Understand what a SQL or persistence operation produces.

**Correct answers:** 1

Can contain:

* SQL queries;
* JPA behaviour;
* joins;
* indexes;
* fetch strategies.

---

# 16. Concept Relationship Questions

## QT35 — Concept Relationship

**Purpose:** Test understanding of how two technical concepts interact.

**Correct answers:** 1

**Example:**

> What is the relationship between a Docker image and a Docker container?

* A container is a running instance created from an image. ✅
* An image is created from a running Kubernetes cluster.
* They are unrelated concepts.
* A container stores Dockerfiles.

---

## QT36 — Dependency Recognition

**Purpose:** Identify what something depends on or requires.

**Correct answers:** 1 or multiple

**Example:**

> Which components are normally required for an HTTPS connection?

* TLS certificate ✅
* TLS negotiation ✅
* SQL database
* Message queue

---

# 17. Statement Evaluation

## QT37 — Correct Statements

**Purpose:** Test several pieces of knowledge about one subject simultaneously.

**Correct answers:** 2–3

**Structure:**

> Which statements about `<concept>` are correct?

This should be one of the primary multiple-correct-answer formats.

**Example:**

> Which statements about Docker images are correct?

* Images are used to create containers. ✅
* Images can contain multiple filesystem layers. ✅
* An image must always contain a database.
* Images can be stored in container registries. ✅

---

## QT38 — Incorrect Statement

**Purpose:** Detect a misconception.

**Correct answers:** 1

**Structure:**

> Which statement about `<concept>` is incorrect?

Use moderately, because negative questions are slightly harder to parse.

---

# 18. Misconception Questions

## QT39 — Common Misconception

**Purpose:** Explicitly target mistakes developers commonly make.

**Correct answers:** 1

**Example:**

> Which statement about Kubernetes Pods is correct?

The distractors should represent common misconceptions such as:

* a Pod always contains exactly one container;
* a Pod is equivalent to a physical server;
* Kubernetes permanently modifies failed Pods instead of replacing them.

This category is especially valuable because wrong answers represent knowledge gaps that developers realistically have.

---

# 19. Practical Decision Questions

## QT40 — Developer Action

**Purpose:** Ask what a developer/operator should do.

**Correct answers:** 1

**Structure:**

> You need to `<goal>`. What should you do?

Unlike a pure service-selection question, this can involve commands, configuration changes, architecture decisions, or debugging steps.

---

# 20. Question Dimensions

Question type and question difficulty should be considered separately.

For example:

`QT07 Scenario Selection`

can exist as:

* beginner;
* intermediate;
* advanced.

### Beginner

Tests one clear concept.

Example:

> Which AWS service stores objects?

### Intermediate

Combines concept + requirement.

Example:

> Which AWS service should store large files that need durable object storage?

### Advanced

Introduces several competing requirements.

Example:

> A system must store immutable application artifacts cheaply, replicate them across regions, and make them available to deployment pipelines. Which AWS service is most appropriate?

The generator SHOULD therefore select:

`topic + question type + difficulty`

rather than generating a question directly from the topic.

---

# 21. Recommended Question-Type Groups

To create real variation, question types can also be grouped by the cognitive skill being tested.

| Group           | What is tested                        |
| --------------- | ------------------------------------- |
| Recall          | Terminology and definitions           |
| Recognition     | Features and responsibilities         |
| Understanding   | Behaviour and relationships           |
| Application     | Scenario-based selection              |
| Analysis        | Troubleshooting and failure scenarios |
| Comparison      | Differences and trade-offs            |
| Evaluation      | Best solution under constraints       |
| Practical skill | Commands, configuration and code      |

A good generated collection should contain questions from several groups.

---

# 22. Generator Distribution

The generator SHOULD avoid producing a collection consisting mostly of simple terminology questions.

For a general technical question collection, a useful default distribution is approximately:

* **15%** terminology and definitions;
* **15%** features/responsibilities;
* **25%** scenario/application questions;
* **15%** behaviour/mechanics;
* **10%** troubleshooting;
* **10%** comparison/trade-off;
* **10%** code/configuration/practical questions.

These percentages are guidance rather than strict rules.

For beginner content, terminology may increase.

For advanced content, scenarios, troubleshooting and trade-offs should increase.

---

# 23. Correct Answer Distribution

The generator SHOULD deliberately mix single-answer and multiple-answer questions.

Suggested default:

* **60–70%** one correct answer;
* **30–40%** multiple correct answers.

For multiple-answer questions:

* usually 2 correct + 2 incorrect;
* sometimes 3 correct + 1 incorrect.

Avoid repeatedly using the same pattern.

The correct answer SHOULD NOT consistently appear in the same position.

---

# 24. Distractor Rules

Distractor quality is one of the most important parts of question generation.

A distractor SHOULD be:

* technically plausible;
* related to the topic;
* something a learner with incomplete knowledge might choose;
* clearly incorrect once the concept is understood.

A distractor SHOULD NOT be:

* humorous;
* obviously absurd;
* unrelated to the subject;
* grammatically different enough to reveal the answer;
* substantially longer or more detailed than the correct answer without reason.

### Good distractor

Question about SQS:

> Sends messages directly to all subscribers.

This is plausible because it describes SNS.

### Bad distractor

> Makes your computer run faster using magic.

Technically incorrect, but educational value approximately equals `null`.

---

# 25. Answer Independence

For multiple-correct questions, every answer should ideally represent an independent claim.

Good:

> Which features does SQS support?

* FIFO queues
* dead-letter queues
* visibility timeout
* SQL joins

Bad:

* Supports queues and visibility timeouts
* Supports queues
* Supports dead-letter queues
* Does not support databases

Combining several facts inside one option makes scoring and reasoning unnecessarily complicated.

---

# 26. Avoid Answer Leakage

The generator MUST avoid clues such as:

### Length leakage

Correct answer is significantly longer and more detailed than all distractors.

### Grammar leakage

Question:

> Which service **is** used...

Answers:

* Amazon SQS is...
* S3
* EC2
* DynamoDB

### Absolute-language leakage

Incorrect answers repeatedly use:

* always;
* never;
* completely;
* only.

### Category leakage

Three answers are AWS services and one answer is a Java keyword.

Distractors should generally belong to the same conceptual category.

---

# 27. Scenario Quality Rules

Scenario questions MUST include information that affects the answer.

Bad scenario:

> John works at a company. The company uses AWS. Which service provides queues?

The scenario contributes nothing.

Better:

> A payment service must submit jobs to workers asynchronously. Workers may be temporarily unavailable, but requests must not be lost. Which AWS service fits this requirement?

Every sentence contributes to the technical decision.

---

# 28. Scope Control

Each question SHOULD primarily test one learning objective.

Avoid:

> Which AWS service supports queues, how does its visibility timeout work, when would you choose FIFO, and how does pricing work?

Instead split this into several questions.

One question = one primary knowledge target.

---

# 29. Question Generator Input Model

A future Qolling generator could conceptually receive:

```text
Topic: Amazon SQS

Difficulty: Intermediate

Question count: 10

Allowed question types:
QT03 Feature Identification
QT07 Scenario Selection
QT10 What Happens Next
QT18 Technology Comparison
QT22 Symptom → Likely Cause
QT37 Correct Statements
```

The generator then chooses different types rather than generating ten variations of:

> What is Amazon SQS?

---

# 30. Suggested Generator Workflow

For every generated question:

### Step 1 — Select learning objective

Example:

`Understand SQS visibility timeout`

### Step 2 — Select question type

Example:

`QT10 — What Happens Next?`

### Step 3 — Determine answer cardinality

Example:

`1 correct answer`

### Step 4 — Generate the correct answer

Example:

`The message becomes visible again.`

### Step 5 — Generate misconception-based distractors

Example:

* message is automatically deleted;
* queue pauses;
* producer must resend it.

### Step 6 — Validate

Check:

* exactly four answers;
* correct answer count is valid;
* no ambiguous answers;
* no duplicate answers;
* no answer leakage;
* learning objective matches question;
* distractors are technically plausible;
* question can be answered from technical knowledge rather than guessing.

---

# 31. Recommended Core Types for Initial Implementation

Although this specification defines many variations, Qolling does not need to implement all of them as separate software entities.

For generation purposes, the following set provides particularly strong variation:

1. `TERM_DEFINITION`
2. `DEFINITION_TERM`
3. `FEATURE_IDENTIFICATION`
4. `SERVICE_SELECTION`
5. `SCENARIO_SELECTION`
6. `MULTI_COMPONENT_SCENARIO`
7. `BEST_SOLUTION`
8. `BEHAVIOUR_RESULT`
9. `CAUSE_EFFECT`
10. `CONFIGURATION_PURPOSE`
11. `CODE_RESULT`
12. `CODE_PROBLEM`
13. `TECHNOLOGY_COMPARISON`
14. `REQUIREMENT_MATCHING`
15. `TROUBLESHOOT_CAUSE`
16. `TROUBLESHOOT_ACTION`
17. `ARCHITECTURE_FAILURE`
18. `SECURITY_RISK`
19. `CORRECT_STATEMENTS`
20. `MISCONCEPTION`
21. `DEVELOPER_ACTION`

These 21 types provide enough structural difference that generated collections should feel substantially more diverse while still using Qolling's simple four-answer model.

---

# 32. Fundamental Principle

The generator should not ask:

> "How can I generate another question about SQS?"

It should ask:

> "What different kind of understanding about SQS can I test?"

For the same concept, this could generate:

**Terminology**

> What is an SQS visibility timeout?

**Feature**

> Which SQS features affect message retry behaviour?

**Behaviour**

> What happens when the visibility timeout expires?

**Scenario**

> A worker takes longer to process messages than the configured visibility timeout. What problem can occur?

**Troubleshooting**

> The same SQS message is being processed simultaneously by multiple workers. What configuration should you investigate?

**Architecture**

> Why might a microservice place SQS between an API and background workers?

**Comparison**

> When would SQS be preferable to SNS?

All seven questions concern the same technology, but they exercise different forms of knowledge.

That is the primary mechanism Qolling should use to create genuinely varied technical learning content.
