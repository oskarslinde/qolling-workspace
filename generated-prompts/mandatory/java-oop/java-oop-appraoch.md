Use a **coverage matrix**.

## Best approach

1. **Turn each subtopic into a row**

    * Example: `Encapsulation`, `Polymorphism`, `equals/hashCode`, `Composition vs inheritance`.

2. **Add question-type columns**

    * Conceptual
    * Code-reading
    * Coding task
    * Debugging
    * Design/scenario

3. **Assign required count per cell**

    * Based on weight:

        * Weight 5 → 8–12 questions
        * Weight 4 → 5–8 questions
        * Weight 3 → 3–5 questions
        * Weight 2 → 1–3 questions
        * Weight 1 → 1 question

4. **Tag every generated question**
   Each question should have metadata:

```json
{
  "topicPath": "Java / OOP",
  "subtopic": "equals() and hashCode()",
  "difficulty": "middle",
  "questionType": "debugging",
  "importance": "mandatory",
  "coverageTags": ["hash-based collections", "mutable keys"]
}
```

5. **Track coverage automatically**
   After generation, validate:

    * every subtopic has questions
    * every mandatory subtopic has enough questions
    * every difficulty level is covered
    * every question type is represented where relevant
    * no subtopic is overrepresented too much

6. **Explain every incorrect answer**
   Every generated multiple-choice question must include `wrongAnswerExplanation` on each of the 3 incorrect answers.
   Do not add `wrongAnswerExplanation` to the correct answer.
   Keep each explanation specific to that answer so the UI can show “Why other options are wrong” even when answers are shuffled.

## Simple rule

For every important subtopic, generate at least:

```text
1 conceptual
1 code-reading
1 debugging
1 practical/design question
```

For heavy topics like `equals/hashCode`, `polymorphism`, `interfaces`, and `composition vs inheritance`, add more scenario and trap-based questions.

Think of it like test coverage, but for developer brains. Mutation testing included: weird inheritance puzzles.
