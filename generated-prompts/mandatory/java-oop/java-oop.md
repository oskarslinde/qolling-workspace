You are a senior Java backend engineer, interviewer, and curriculum designer.

I am building a structured question suite for Java software developers.

The goal is:
Generate a complete interview/practice question suite for Java software developers.

Analyze the following topic/subtopic:

Topic path:
Java / OOP

Importance tag:
Mandatory

Target level:
All levels

Your task is to describe, in detail, what a Java software developer should know about this topic so that I can later generate interview questions, quiz questions, coding tasks, and scenario-based questions from it.
But don't necessarily reference "Your a Java developer" in every question, because some question could later be reused in other paths, for example in frontend dev paths we could also reuse Linux terms.

Return the answer in the following structure:

# Java / OOP

## 1. Topic scope

Explain what this topic includes and what it does not include.

Be precise. If the topic overlaps with another topic, mention the boundary.

Example:
- For "Java / Collections API", include List, Set, Map, Queue, iteration, sorting, immutability, concurrent collections basics.
- Do not deeply cover algorithm theory unless directly relevant.

## 2. Why this topic matters for Java developers

Explain why this topic is important in real Java software development.

Cover:
- daily coding relevance
- production relevance
- interview relevance
- common failure points

## 3. Required knowledge areas

Create a detailed list of concrete knowledge areas the developer should understand.

For each item, include:
- name
- short explanation
- whether it is beginner, intermediate, or advanced
- whether it is theoretical, practical, or both

Format as a table:

| Knowledge area | Level | Type | What the developer should know |
|---|---|---|---|

## 4. Practical skills

List practical things the developer should be able to do with this topic.

Use action-oriented wording.

Examples:
- Implement X
- Debug Y
- Configure Z
- Explain tradeoff between A and B
- Identify bug caused by C
- Refactor code that does D

## 5. Common interview angles

List the main ways this topic is usually tested in interviews.

Split them into:

### Conceptual questions
Questions that test understanding.

### Code-reading questions
Questions where the developer must inspect code and explain behavior.

### Coding tasks
Small implementation tasks.

### Debugging scenarios
Broken or risky code that must be fixed.

### System/design scenarios
Larger practical situations where this topic affects architecture or production behavior.

If a category does not fit this topic, say "Not usually applicable".

## 6. Common mistakes and misconceptions

List common mistakes Java developers make with this topic.

For each mistake, include:
- mistake
- why it is wrong or risky
- better approach

Format as a table:

| Mistake | Why it is wrong/risky | Better approach |
|---|---|---|

## 7. Real-world examples

Give realistic examples where this topic appears in backend Java development.

Prefer examples from:
- Spring Boot applications
- REST APIs
- database-backed systems
- microservices
- messaging/event-driven systems
- cloud/container deployments
- production debugging

## 8. Subtopics to generate questions for

Break this topic into smaller question-generation units.

For each subtopic, include:
- subtopic name
- short description
- suggested importance: mandatory, optional, or advanced optional
- suggested question count weight from 1 to 5

Format as a table:

| Subtopic | Description | Importance | Weight |
|---|---|---|---|

Weight meaning:
1 = only a few questions needed
2 = small coverage
3 = normal coverage
4 = strong coverage
5 = heavy coverage required

## 9. Difficulty progression

Describe how questions for this topic should progress from easy to hard.

Use this format:

### Beginner
What a beginner should know.

### Middle
What a middle-level developer should know.

### Senior
What a senior developer should know.

## 10. Must-have question themes

List the essential question themes that must exist in the final question suite.

Each theme should be specific enough to generate multiple questions.

Example:
Bad: "HashMap"
Good: "How HashMap uses equals() and hashCode(), and what breaks when keys are mutable"

## 11. Edge cases worth testing

List important edge cases, tricky details, or production traps related to this topic.

Examples:
- null handling
- concurrency issues
- transaction boundaries
- serialization problems
- lazy loading problems
- memory leaks
- security risks
- performance traps
- configuration mistakes

Only include edge cases relevant to this topic.

## 12. Related topics

List related topic paths that should be linked to this topic.

For each related topic, explain the relationship briefly.

Example:
- Java / Generics — used heavily by collections
- Java / Concurrency — relevant for concurrent collections
- JVM / Memory model — relevant for thread safety

## 13. What not to ask

List things that should usually not be asked for this topic because they are:
- too outdated
- too academic
- too unrelated to Java software development
- too tool-specific
- too obscure for normal interviews

## 14. Final structured summary

Return a compact JSON-like summary at the end:

{
  "topicPath": "Java / OOP",
  "importance": "Mandatory",
  "targetLevel": "All levels",
  "recommendedQuestionCountWeight": 1-5,
  "coreKnowledgeAreas": [],
  "practicalSkills": [],
  "mustHaveQuestionThemes": [],
  "advancedOnlyAreas": [],
  "relatedTopics": []
}

Important rules:
- Be specific to Java software development.
- Do not give generic textbook content.
- Prefer Spring Boot/backend/production examples where relevant.
- Split broad topics into clear subtopics.
- Avoid including frontend-only, Excel, office productivity, or unrelated business-tool knowledge.
- Do not generate actual quiz questions yet.
- The output should prepare the topic for later question generation.
