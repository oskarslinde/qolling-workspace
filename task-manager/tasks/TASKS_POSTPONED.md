# Postponed Tasks

This file contains tasks moved out of `TASKS.md` because their status was `Postponed`.

---

## Collection Learning Session

### Improve empty-state reason for unplayable collections

- Ticket ID: `BO-056`
- Description: When a public collection has questions recorded in metadata but zero currently playable active questions,
  show a clear explanation instead of a confusing generic message.
- Status: `Postponed`
- Likely files: `hera/src/pages/CollectionSessionConfigPage.jsx`, `hera/src/pages/ViewCollectionPage.jsx`,
  `hera/src/features/collections/components/CollectionSummaryCard.jsx`,
  `zeus/src/main/java/com/ednilo/app/question/collection/dto/QuestionCollectionDTO.java`
- Details: Distinguish truly empty collections from collections whose questions are inactive, private, deleted, or
  waiting for approval.
- Acceptance: A collection with `questionCount > 0` and `playableQuestionCount === 0` shows a specific message
  explaining that no questions are currently playable.
- Updated: 2026-04-20T12:29:53.681Z

### Add per-question results review

- Ticket ID: `BO-069`
- Description: Add a per-question review view on collection learning session results.
- Status: `Postponed`
- Details: Deferred while prioritizing core learning-session and feed parity work.

### Add visible progress rail or index

- Ticket ID: `HE-003`
- Description: Show lightweight session progress so users can see where they are within the selected question run.
- Status: `Postponed`
- Likely files: `hera/src/pages/CollectionSessionPlayPage.jsx`, `hera/src/features/play/components/**`,
  `hera/src/pages/__tests__/CollectionSessionFlow.test.jsx`
- Details: Add or refine a compact progress index such as `Question X of Y`, answered/skipped counts, and loop cycle
  label without overwhelming the play UI.
- Acceptance: Users can always tell their current position and completion progress during non-loop sessions, and loop
  sessions show a sensible cycle indicator.
- Updated: 2026-04-09T11:22:49.733Z

### Add visible progress rail or index

- Ticket ID: `HE-011`
- Description: Add a visible progress rail or index during collection learning sessions.
- Status: `Postponed`
- Details: Deferred as a UX enhancement after core flow stabilization.

### Consider public-safe unauthenticated collection sessions

- Ticket ID: `BO-070`
- Description: Evaluate whether public-safe unauthenticated collection sessions should be supported.
- Status: `Postponed`
- Details: Requires explicit product/security policy before implementation.

## Security And Runtime Safety

### Remove committed secrets from default config

- Ticket ID: `ZE-025`
- Description: Remove any real credentials or sensitive values from default/shared config files.
- Status: `Postponed`
- Details: Deferred due to dependency on environment and deployment rotation plan.

### Rotate previously committed credentials

- Ticket ID: `ZE-026`
- Description: Rotate credentials that may have been previously committed.
- Status: `Postponed`
- Details: Deferred pending coordinated infra/runtime rollout.

### Make test execution incapable of reaching real MongoDB by accident

- Ticket ID: `ZE-027`
- Description: Harden test runtime so it cannot connect to real MongoDB instances unintentionally.
- Status: `Postponed`
- Details: Requires profile/env hardening and CI alignment.

### Change the baseline runtime profile to a safe default

- Ticket ID: `ZE-028`
- Description: Set the default runtime profile to a safer baseline for local and CI.
- Status: `Postponed`
- Details: Deferred until profile and secret handling are finalized.

### Move CORS configuration to environment-driven settings

- Ticket ID: `ZE-029`
- Description: Externalize CORS configuration so environments can be configured without code edits.
- Status: `Postponed`
- Details: Deferred pending broader deployment configuration cleanup.

## Question Difficulty

### Plan migration and compatibility for existing `difficulty=0` questions

- Ticket ID: `BO-071`
- Description: Plan data migration and compatibility handling for legacy questions with `difficulty=0`.
- Status: `Postponed`
- Details: Deferred after deciding to prioritize ongoing adaptive difficulty implementation first.
