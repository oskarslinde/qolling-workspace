# Qolling Product UX Principles

This is the cross-project product source of truth for the Qolling question experience. Keep implementation details in the relevant feature docs and use this file for durable product principles only.

## Product Goal

Qolling should feel fast, clear, lightweight, rewarding, modern, and calm. Engagement should come from competence, progress, and momentum, not manipulative loops or noisy gamification.

## Core Principles

- One screen state should have one obvious primary action.
- One user interaction should produce one immediate visible reaction.
- The play flow should feel like a continuous session, not a series of page navigations.
- Progress should be visible during play through count, progress, score, streak, or summary.
- Reward should reinforce correctness, consistency, improvement, and completion.
- UI should stay trustworthy: no fake urgency, hidden friction, or aggressive variable rewards.

## Play Loop

The target flow is:

```text
Question appears
User taps answer
Answer auto-submits
Result appears
User reviews outcome
User taps next
Next question is ready
```

Skip flow should move directly to the next question without showing a result state for the skipped question.

## Question State

The question state exists to get the user to answer or skip. It should prioritize question text, answer options, optional media, lightweight metadata, progress, and skip.

Answer options should have clear rest, hover, pressed, selected, disabled, correct, and incorrect states. After tap, the selected state should appear immediately, other answers should lock, and submission should start automatically.

## Result State

The result state exists to deliver closure before the next question. Priority order:

1. Outcome: correct or incorrect.
2. Answer clarity: selected answer and correct answer.
3. Explanation or source, when useful.
4. Social and statistics extras.
5. Next action.

Correct feedback should feel rewarding. Wrong feedback should feel informative, not punishing. Keep the result compact enough that the next step remains obvious.

## Motion And Feedback

Motion should support comprehension and perceived speed. Prefer short answer press, lock-in, result emphasis, and next-question transitions. Always respect reduced-motion preferences.

Milestone celebrations can exist, but they should be restrained and reserved for meaningful events such as 3 correct in a row, 5 correct in a row, session completion, or new best streak.

## Loading And Performance

Never show empty dead air in the play flow. Use skeletons for question, answer, and explanation areas. Preload or prefetch the next question as early as safely possible.

Perceived performance targets:

- Answer tap feels instant.
- Result appears without a blank gap.
- Next question transition feels near-instant when prefetch is available.
- Large page shells should not remount or flash between questions.

## Personalization

Personalization should make questions feel increasingly relevant without becoming opaque. Use it for difficulty tuning, category weighting, weaker-area review, and explanation pacing. Avoid obvious repetition, overfitting to easy questions, or removing healthy variety.

## Measurement

Track the play loop so UX friction can be found with evidence:

- question impression
- answer selected
- answer submitted
- answer correct or wrong
- question skipped
- result viewed
- explanation expanded
- next clicked
- session started and ended
- answer tap to result visible
- next click to next question visible
- duplicate taps or abandon during loading

Metrics should avoid unnecessary personal data and should not change product behavior in a manipulative direction.
