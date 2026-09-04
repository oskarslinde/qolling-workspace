# Play Flow

## Purpose

The play flow should feel fast, clear, lightweight, rewarding, modern, and calm. Engagement should come from competence, progress, and momentum, not manipulative loops or noisy gamification.

## Target Loop

```text
Question appears
├─ Single choice: user taps one answer → answer auto-submits
└─ Multiple choice: user selects the complete set → user checks answers
Result appears
User reviews outcome
User taps next
Next question is ready
```

Skip moves directly to the next question without a result state.

## Hera Responsibilities

- Keep question state focused on answering or skipping.
- State whether the question expects one answer or all applicable answers.
- Auto-submit single-choice answers, but grade multi-select answers only when the user submits the complete selected set.
- Show immediate selected/pressed feedback before the answer request completes.
- Lock answer options during submit and make correctness visible without relying only on color.
- Keep result state compact: outcome, selected answer, correct answer, explanation/source when useful, then next action.
- Use structured skeletons and prefetch-ready transitions instead of blank gaps.
- Respect reduced motion and maintain keyboard reachability.

Hera-only details live in [../../hera/docs/play-ui.md](../../hera/docs/play-ui.md).

## Zeus Responsibilities

- `GET /feed/next` returns enough question data for Hera to render immediately.
- `POST /feed/answer` returns enough data for a complete result state without avoidable synchronous follow-up calls.
- `POST /feed/skip` records skip semantics separately from wrong answers and enables the next question quickly.
- Prefetch support must not consume or score a question until the user actually sees or acts on it.
- Progress and personalization fields should be compact and explainable.

## Measurement

Useful events include question impression, answer selected, answer submitted, correctness, skip, result viewed, explanation expanded, next clicked, session started/ended, and key timing spans such as answer tap to visible result.

Metrics must avoid tokens, unnecessary personal data, and manipulative behavior changes.
