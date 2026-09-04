import { CATEGORIES, EDUCATIONAL_ANGLES } from "./constants.mjs";
import { chooseRoundRobin } from "./utils.mjs";

export function buildQuestionPrompt({ category, difficulty, index, topic }) {
  const angle = chooseRoundRobin(EDUCATIONAL_ANGLES, index);
  const topicLine = topic ? `Requested batch topic: ${topic}` : `Category: ${category}`;

  return `Create one educational multiple-choice question for Qolling.

${topicLine}
Allowed category: ${category}
Difficulty: ${difficulty} on a 1-5 scale
Angle: ${angle}

The question must be engaging and informative, not a bare fact recall and not a personal preference.
Phrase it with the curiosity and surprise of a fun fact or "did you know" hook, but do not routinely include "did you know" in the question text.
It must be easy to illustrate with a neutral educational image.

Return only JSON with this exact shape:
{
  "question": "string",
  "answers": [
    { "text": "string", "correct": true },
    { "text": "string", "correct": false },
    { "text": "string", "correct": false },
    { "text": "string", "correct": false }
  ],
  "answerDescription": "short explanation of the correct answer",
  "answerSource": "credible source name, book, institution, article, or URL",
  "tags": ["two", "to four", "lowercase", "keywords"],
  "imagePrompt": "neutral educational image prompt, no logos, no copyrighted characters, no real living person likeness"
}

Rules:
- Exactly 4 answers and exactly one correct answer.
- Wrong answers should be plausible but clearly wrong after learning the concept.
- Use one category from this list only: ${CATEGORIES.join(", ")}.
- Avoid entertainment IP, celebrity likenesses, brand logos, and personal preference questions.
- Avoid vague wording like "What is true about...".
- Keep answerSource specific enough to audit.
- If answerSource is a website, include a link when available.`;
}

export function buildPictureQuestionPrompt({ category, difficulty, index, topic }) {
  const angle = chooseRoundRobin(EDUCATIONAL_ANGLES, index);
  const topicLine = topic ? `Requested batch topic: ${topic}` : `Category: ${category}`;

  return `Create one image-dependent multiple-choice question for Qolling.

${topicLine}
Allowed category: ${category}
Difficulty: ${difficulty} on a 1-5 scale
Angle: ${angle}

The question must require looking at an image to answer. The image will be found later with Google image search, so do not invent an image URL.

Difficulty guidance:
- Difficulty 1: identify a widely recognizable person, object, animal, sport, instrument, artwork style, food, or simple place from a clear image.
- Difficulty 2: identify a city, landmark, country, historical object, scientific object, or cultural item from a distinctive visual clue.
- Difficulty 3: infer a more specific concept from the image, such as an architectural style, art movement, ecosystem, tool, technique, or historical period.
- Difficulty 4-5: require expert visual recognition, but keep the answer auditable and not obscure trivia.

Return only JSON with this exact shape:
{
  "question": "string",
  "answers": [
    { "text": "string", "correct": true },
    { "text": "string", "correct": false },
    { "text": "string", "correct": false },
    { "text": "string", "correct": false }
  ],
  "answerDescription": "short explanation of why the image points to the correct answer",
  "answerSource": "credible source name, book, institution, article, or URL",
  "tags": ["two", "to four", "lowercase", "keywords"],
  "imageSearchQuery": "specific Google image search query that should return a clear, non-ambiguous picture for the question",
  "imageAlt": "short neutral description of the target image"
}

Examples:
- Question: "Who is the actor shown in this image?" Correct answer: "Jim Carrey". imageSearchQuery: "Jim Carrey portrait"
- Question: "Which city is shown in this image?" Correct answer: "Paris". imageSearchQuery: "Eiffel Tower Paris photo"

Rules:
- Exactly 4 answers and exactly one correct answer.
- Wrong answers should be visually plausible, especially for location/person/object recognition questions.
- Use one category from this list only: ${CATEGORIES.join(", ")}.
- Do not ask about private people.
- Avoid copyrighted entertainment characters, brand logos, and personal preference questions.
- Keep the image search query specific enough that the correct answer is visually likely in the first results.
- Keep answerSource specific enough to audit.
- If answerSource is a website, include a link when available.`;
}

export function buildImagePrompt(question) {
  return `${question.imagePrompt}

Educational quiz image for this question: ${question.question}
Style: clear, polished, classroom-friendly visual, no text labels unless essential, no logos, no copyrighted characters, no real living person likeness.`;
}
