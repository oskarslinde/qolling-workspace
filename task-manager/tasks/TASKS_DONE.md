# Done Tasks

This file contains tasks moved out of `TASKS.md` because their status was `Done`.

---

## Collection Learning Session

### Add confirmation before ending a started session

- Ticket ID: `HE-004`
- Description: If the user already answered questions, require explicit confirmation before ending the session early.
- Status: `Done`
- Summary: Confirmed the play page already requires confirmation once a session has progress, and added a focused
  regression proving untouched sessions still end immediately without showing the confirmation dialog.
- Likely files: `hera/src/pages/CollectionSessionPlayPage.jsx`, `hera/src/components/ui/**`,
  `hera/src/pages/__tests__/CollectionSessionFlow.test.jsx`
- Details: Add a confirmation dialog or confirm flow for sessions with answered/skipped steps; allow immediate exit for
  untouched sessions if desired.
- Acceptance: Ending after progress requires confirmation, cancellation keeps the user on the same question,
  confirmation navigates to results with manual-ended messaging.
- Updated: 2026-04-09T11:30:08.723Z

### Return richer collection playability metadata from Zeus

- Ticket ID: `BO-057`
- Description: Return active-question count and inactive/deleted/skipped counts so Hera can present truthful collection
  availability without inferring from mismatched collection fields.
- Status: `Done`
- Summary: Added Zeus-side collection playability breakdown fields for unavailable, inactive, deleted, and missing
  question ids, backed by a new `QuestionAvailabilitySummary` classifier in `QuestionService` plus focused unit coverage
  for mixed active/inactive/deleted/missing collections.
- Likely files: `zeus/src/main/java/com/ednilo/app/question/collection/dto/QuestionCollectionDTO.java`,
  `zeus/src/main/java/com/ednilo/app/question/collection/service/QuestionCollectionServiceImpl.java`,
  `zeus/src/main/java/com/ednilo/app/question/core/service/QuestionService.java`,
  `zeus/src/test/java/com/ednilo/app/question/collection/service/QuestionCollectionServiceImplTest.java`
- Details: Add a small playability summary DTO or fields that count stored, playable, inactive/deleted, and inaccessible
  questions.
- Acceptance: Collection APIs return enough metadata for Hera to explain playability accurately, with unit tests
  covering mixed active/inactive question ids.
- Updated: 2026-04-09T12:10:31.147Z

### Add a collection-session page loader

- Ticket ID: `HE-002`
- Description: Show a dedicated page loader while the config page is fetching playable questions for large collections.
- Status: `Done`
- Summary: Confirmed the config page already uses a dedicated `PageLoader` with the `Loading collection session setup`
  label and validated the existing focused regression coverage in the collection session flow suite.
- Likely files: `hera/src/pages/CollectionSessionConfigPage.jsx`, `hera/src/components/ui/PageLoader.jsx`,
  `hera/src/components/ui/AsyncSection.jsx`, `hera/src/pages/__tests__/CollectionSessionFlow.test.jsx`
- Details: Ensure the loading state is visible, specific to collection session setup, and does not render empty config
  controls before playable question data arrives.
- Acceptance: During collection/playable-question loading the user sees a clear loader label, and tests cover the
  loading state if practical.
- Updated: 2026-04-09T11:28:22.125Z

### Add frontend loop-mode test

- Ticket ID: `HE-006`
- Description: Add Hera coverage proving that `all + loop` never auto-completes on the final question.
- Status: `Done`
- Summary: Added UI-level regression coverage proving that an `all + loop` session stays on the play page after the
  final question, wraps back to question 1, and increments the visible loop counter; revalidated the existing
  service-level loop coverage.
- Likely files: `hera/src/pages/__tests__/CollectionSessionFlow.test.jsx`,
  `hera/src/features/collections/session/__tests__/collectionLearningSessionService.test.js`,
  `hera/src/pages/CollectionSessionPlayPage.jsx`
- Details: Add UI-level coverage in addition to service-level coverage so the route does not navigate to results after
  the last question in loop mode.
- Acceptance: In loop mode, answering/skipping the final question cycles to the first question and remains on the play
  page.
- Updated: 2026-04-09T11:43:33.851Z

### Add frontend test for manual early termination

- Ticket ID: `HE-005`
- Description: Add Hera test coverage for explicit early session end and verify that results report a manual termination
  correctly.
- Status: `Done`
- Summary: Confirmed the collection session flow suite already covers answered-progress and skipped-progress manual
  early termination, including the manual-ended results copy and preserved partial summary; revalidated the focused UI
  suite after fixing an unrelated random-order assertion.
- Likely files: `hera/src/pages/__tests__/CollectionSessionFlow.test.jsx`,
  `hera/src/pages/CollectionSessionPlayPage.jsx`, `hera/src/pages/CollectionSessionResultsPage.jsx`
- Details: Simulate starting a session, answering or skipping at least one question, ending manually, and checking the
  results copy and counts.
- Acceptance: The test proves manual termination shows the manual-ended message and preserves the partial session
  summary.
- Updated: 2026-04-09T11:33:31.706Z

### Add backend controller coverage for collection play questions

- Ticket ID: `ZE-001`
- Description: Add backend controller-level automated test coverage for `/question-collections/{id}/play-questions`.
- Status: `Done`
- Summary: Confirmed `QuestionCollectionControllerMvcTest` already covers unauthenticated access, owner access,
  authenticated public access, private non-owner denial, missing collection, and response JSON fields for the
  `/play-questions` endpoint; validated the focused Maven test successfully.
- Likely files: `zeus/src/test/java/com/ednilo/app/question/collection/controller/**`,
  `zeus/src/main/java/com/ednilo/app/question/collection/controller/QuestionCollectionController.java`,
  `zeus/src/main/java/com/ednilo/app/question/collection/controller/QuestionCollectionApi.java`
- Details: Cover authenticated access, public collection access, private non-owner denial, missing collection, and only
  playable active questions returned.
- Acceptance: Controller-level tests validate status codes and response JSON for the play-questions endpoint.
- Updated: 2026-04-09T11:31:48.729Z

### Add a "restart same config" action

- Ticket ID: `BO-054`
- Description: Allow users to restart a collection learning session with the same settings directly from the results
  page.
- Status: `Done`
- Summary: `Restart same config` now works from backend-loaded historical results as well as local stored results,
  reuses any active local session for the same collection, and is covered by focused CollectionSessionFlow regression
  tests.
- Likely files: `hera/src/pages/CollectionSessionResultsPage.jsx`, `hera/src/pages/CollectionSessionConfigPage.jsx`,
  `hera/src/services/collectionService.js`,
  `zeus/src/main/java/com/ednilo/app/question/collection/session/service/CollectionLearningSessionService.java`
- Details: Add a results-page action that starts a new session using the prior question limit, order, and loop values;
  handle conflicts if the old session is still active.
- Acceptance: Clicking restart starts a new session with the same config and navigates to play, while the previous
  results remain intact.
- Updated: 2026-04-09T11:20:59.183Z

### Support question images in collection sessions

- Ticket ID: `BO-055`
- Description: Render question images in collection learning sessions using the same rules as the main play flow.
- Status: `Done`
- Summary: Confirmed the shared play panel and collection-session normalization already preserve and render `imageUrl`;
  added collection-session UI and service regression tests to lock that behavior for session play flows.
- Likely files: `hera/src/features/play/components/PlayQuestionPanel.jsx`,
  `hera/src/features/collections/session/collectionLearningSessionService.js`,
  `hera/src/features/questions/components/QuestionCardReadOnly.jsx`,
  `zeus/src/main/java/com/ednilo/app/question/core/dto/MultipleChoiceQuestionDTO.java`
- Details: Preserve `imageUrl` through session normalization and render it in the shared play question panel with
  accessible alt text and responsive sizing.
- Acceptance: Collection session questions with `imageUrl` display the image, questions without images remain unchanged,
  and a frontend test covers the image path.
- Updated: 2026-04-09T11:23:56.183Z

### Include author information in collection session question payloads

- Ticket ID: `BO-058`
- Description: Include enough author identity data in collection-session question responses to support profile
  navigation or attribution in the session UI.
- Status: `Done`
- Summary: Confirmed the collection play-question contract already carries `createdByUserId` and `createdByUsername`,
  and added Hera collection-session regressions to lock author metadata preservation plus author-profile navigation from
  session play.
- Likely files: `zeus/src/main/java/com/ednilo/app/question/core/dto/MultipleChoiceQuestionDTO.java`,
  `zeus/src/main/java/com/ednilo/app/question/core/service/MultipleChoiceQuestionMapper.java`,
  `hera/src/features/collections/session/collectionLearningSessionService.js`,
  `hera/src/features/play/components/PlayQuestionPanel.jsx`
- Details: Ensure question responses include stable author id plus display username, and map both fields consistently in
  Hera session normalization.
- Acceptance: Author attribution in collection sessions can navigate to the author profile when author id is present.
- Updated: 2026-04-09T11:27:14.542Z

## Zeus Configuration And Security

### Reduce actuator exposure and health detail leakage

- Ticket ID: `ZE-004`
- Description: Keep health available when needed, but avoid exposing more operational detail than necessary on publicly
  reachable environments.
- Status: `Done`
- Summary: Restricted public actuator access to `/actuator/health`, removed public `/actuator/info`, tightened health
  detail visibility (`when_authorized` default and `never` in prod), updated README health-check URL/policy, and added
  security MVC regression coverage.
- Likely files: `zeus/src/main/resources/application.yml`, `zeus/src/main/resources/application-prod.yml`,
  `zeus/src/main/java/com/ednilo/app/common/config/SecurityConfig.java`, `zeus/README.md`
- Details: Review `management.endpoints.web.exposure.include`, `management.endpoint.health.show-details`, and whether
  `/actuator/info` should be public.
- Acceptance: Public actuator exposure is minimal, production health details are not overly verbose, and README reflects
  the intended health-check URL.
- Updated: 2026-04-20T12:25:29.417Z

## Hera Navigation Architecture

### Add regression coverage and docs for two-level navigation behavior

- Ticket ID: `HE-040`
- Description: Add tests/docs to lock two-level navigation behavior.
- Status: `Done`
- Summary: Added deep-link and non-section route coverage in `sectionNavigation` tests, added dedicated `SectionSubnav`
  UI tests for desktop active state and mobile selector navigation, and documented the two-level navigation contract in
  `hera/docs/HERA_NAVIGATION_CONTRACT.md`.
- Likely files: `hera/src/components/__tests__/**`, `hera/src/pages/__tests__/**`, `hera/docs/**`
- Details: Cover desktop tabs, mobile selector, active state, role-based admin visibility, and deep-link compatibility.
- Acceptance: Navigation contract regressions are caught by tests and documented clearly.
- Updated: 2026-04-09T10:53:22.582Z
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.
- Execution log: Implemented tests+docs for two-level nav contract; validated via targeted vitest suite.

## Cross-Project Development Efficiency

### Generate typed Hera client contracts from Zeus APIs

- Ticket ID: `BO-090`
- Description: Reduce repeated frontend/backend contract rediscovery by generating or deriving typed Hera service
  contracts directly from Zeus API definitions.
- Status: `Done`
- Summary: Added a Zeus-swagger-driven Hera generator script for collection contracts, committed the generated contract
  module, wired `collectionService` to generated endpoints plus runtime response validation, and added focused service
  tests to catch contract-shape drift early.
- Likely files: `zeus/swagger.json`, `zeus/swagger.yaml`, `hera/src/services/**`, `hera/package.json`, `docs/**`
- Details: Choose a stable codegen or schema-driven approach for high-value endpoints first, wire it into Hera service
  usage, and document how contract updates should happen when Zeus endpoints change.
- Acceptance: Hera consumes generated or schema-backed typed contracts for a meaningful subset of Zeus APIs, and common
  payload/field mismatches are caught before manual debugging.
- Updated: 2026-04-09T12:19:32.996Z

### Add smoke coverage for highest-churn end-to-end flows

- Ticket ID: `BO-092`
- Description: Add a small set of executable smoke tests for the most frequently changed Hera and Zeus integration paths
  so regressions are caught before long manual debugging sessions.
- Status: `Done`
- Summary: Expanded the Playwright smoke suite into a dedicated `test:smoke` command covering public auth entry,
  authenticated core-route navigation, admin AI-generation entry, and optional collection-session setup using
  env-provided credentials and a known public collection id, with README/env guidance for running the subset reliably.
- Likely files: `business-tests/tests/**`, `business-tests/playwright.config.ts`, `hera/scenarios/**`,
  `zeus/src/test/java/com/ednilo/app/question/e2e/**`
- Details: Prioritize flows like auth, play/feed, collection session start/play/results, and admin generation/status;
  keep the suite intentionally small and stable.
- Acceptance: A focused smoke suite covers the highest-churn cross-stack flows and fails quickly on integration
  regressions that would otherwise require multi-turn investigation.
- Updated: 2026-04-09T12:22:40.058Z

## Suggested Improvements And API Sync

### Fix the OpenAPI schema for admin collection review responses

- Ticket ID: `ZE-031`
- Description: Correct `/question-collections/admin/review` documented 200 schema.
- Status: `Done`
- Summary: Added explicit `PageCollectionReviewSummaryDTO` OpenAPI 200 schema for `getAdminReviewCollections` and
  updated the documentation contract test to enforce it.
- Likely files: `zeus/src/main/java/com/ednilo/app/question/collection/controller/**`, `zeus/swagger.json`,
  `zeus/swagger.yaml`
- Details: Ensure docs reference concrete response DTO schema.
- Acceptance: OpenAPI exposes correct response shape for admin review.
- Updated: 2026-04-20T12:20:18.508Z
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Refactor PublicCollectionsPage to the standard narrow main container

- Ticket ID: `HE-031`
- Description: Align PublicCollectionsPage with single narrow main container layout rule.
- Status: `Done`
- Summary: Switched `PublicCollectionsPage` to `PageShell width=\"narrow\"` so it follows the standard centered narrow
  container pattern; validated with focused page tests (`CollectionStateFilters.test.jsx`, 9 passing).
- Likely files: `hera/src/pages/PublicCollectionsPage.jsx`, `hera/docs/design-system.md`
- Details: Match desktop/mobile central-column conventions used by newer pages.
- Acceptance: Public collections page follows shared narrow-container layout.
- Updated: 2026-04-20T13:50:38.790Z
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

## Hera UI Architecture

### Standardize destructive confirmations across Hera

- Ticket ID: `HE-017`
- Description: Use consistent confirmation UX for delete/hide/destructive actions.
- Status: `Done`
- Summary: Replaced `window.confirm` destructive prompts in profile reset and collection delete flows with the shared
  `ConfirmationDialog`, standardized destructive cancel wording to `Cancel`, and added/updated targeted UI tests
  covering the new confirmation behavior.
- Likely files: `hera/src/components/ui/**`, `hera/src/pages/**`, `hera/src/features/**`
- Details: Unify wording, button order, and cancellation behavior.
- Acceptance: Destructive actions follow one consistent confirmation pattern.
- Updated: 2026-04-20T12:30:19.592Z
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

## AI And Async Operations

### Add retry/backoff strategy for async event handlers

- Ticket ID: `ZE-019`
- Description: Add resilient handling for critical async flows such as email delivery and AI generation listeners.
- Status: `Done`
- Summary: Added a shared `AsyncRetryExecutor` with configurable attempts/backoff and dead-letter persistence, wired it
  into AI generation and email verification async listeners, added focused listener + retry tests, and fixed a corrupted
  `EmailVerificationEventListenerTest` file encoding so the targeted test suite compiles and passes.
- Likely files: `zeus/src/main/java/com/ednilo/app/common/messaging/deadletter/AsyncRetryExecutor.java`,
  `zeus/src/main/java/com/ednilo/app/ai/infrastructure/messaging/QuestionGenerationEventListener.java`,
  `zeus/src/main/java/com/ednilo/app/email/infrastructure/messaging/EmailVerificationEventListener.java`,
  `zeus/src/test/java/com/ednilo/app/common/messaging/deadletter/AsyncRetryExecutorTest.java`
- Details: Confirm retry behavior, backoff configuration, dead-letter payloads, and listener-specific failure handling
  for email and AI.
- Acceptance: Async listener failures retry according to config and persist a dead-letter record when attempts are
  exhausted.
- Updated: 2026-04-20T13:23:15.273Z

## UI Improvements

### Refine answer option interaction states

- Ticket ID: `HE-043`
- Description: Make answer option states feel immediate and clear across rest, hover, pressed, selected, disabled,
  correct, and incorrect states.
- Status: `Done`
- Summary: Added explicit non-color answer state badges (`Selected`, `Your answer`, `Correct`, `Incorrect`, `Locked in`)
  in `PlayAnswerList`, added stronger press feedback, and updated focused Play answer and Play page tests to verify
  lock-in and result markings.
- Likely files: `hera/src/features/play/components/PlayAnswerList.jsx`,
  `hera/src/features/play/components/PlayQuestionView.jsx`, `hera/src/features/play/components/PlayResultView.jsx`,
  `hera/src/pages/PlayPage/__tests__/**`
- Details: Improve visual feedback after tap, lock non-selected options during submit, and avoid relying only on color
  for correctness. Source: `docs/product/ux-principles.md`.
- Acceptance: Answer selection gives immediate visual feedback, disabled/result states are accessible, and tests verify
  lock-in and result markings.
- Updated: 2026-04-20T14:46:10.324Z

### Add structured play loading skeletons

- Ticket ID: `HE-051`
- Description: Replace dead-air loading moments in the play flow with intentional skeleton states.
- Status: `Done`
- Summary: Added a dedicated `PlayTransitionSkeleton` and replaced the spinner-only transition overlay in `PlayPage`
  with structured question/action skeleton placeholders; added PlayPage test coverage asserting transition skeleton
  rendering.
- Likely files: `hera/src/features/play/components/PlayQuestionSkeleton.jsx`, `hera/src/pages/PlayPage/PlayPage.jsx`,
  `hera/src/features/play/components/**`
- Details: Use skeleton placeholders for question, answer options, and explanation/result blocks where data is loading.
  Source: `docs/product/ux-principles.md`.
- Acceptance: Initial and transition loading states keep page structure visible, avoid blank/spinner-only dead air, and
  are covered by UI tests.
- Updated: 2026-04-20T14:49:14.347Z

### Add reduced-motion-aware PlayPage transitions

- Ticket ID: `HE-044`
- Description: Add subtle continuity motion between question, result, and next-question states.
- Status: `Done`
- Summary: Added keyed `play-surface-transition` enter animation for question/result/transition surfaces, replaced
  overlay stacking with in-place content transition containers, and added reduced-motion fallback (`animation: none`)
  under `prefers-reduced-motion` with focused PlayPage regression tests.
- Likely files: `hera/src/pages/PlayPage/PlayPage.jsx`, `hera/src/features/play/components/**`, `hera/src/styles/**`
- Details: Use short fade/slide/content replacement motion that supports comprehension and respects
  `prefers-reduced-motion`. Source: `docs/product/ux-principles.md`.
- Acceptance: Transitions make the play loop feel continuous, reduced-motion users receive non-distracting alternatives,
  and no layout shift is introduced.
- Updated: 2026-04-20T14:55:55.326Z

### Add a current-session streak indicator

- Ticket ID: `HE-046`
- Description: Track and show consecutive correct answers within the current play session.
- Status: `Done`
- Summary: Implemented session streak state in `usePlaySession` (increment on correct, reset on wrong, no reset on skip
  per product choice), added a compact `Streak: N` indicator in PlayPage, and added focused PlayPage + hook integration
  tests for increment/reset/skip behavior.
- Likely files: `hera/src/pages/PlayPage/hooks/usePlaySession.js`, `hera/src/pages/PlayPage/PlayPage.jsx`,
  `hera/src/features/play/components/**`, `hera/src/pages/PlayPage/__tests__/**`
- Details: Increment on correct answers, reset on wrong or skip according to product choice, and keep the display
  lightweight. Source: `docs/product/ux-principles.md`.
- Acceptance: Current streak updates correctly during the session, reset behavior is tested, and the UI does not compete
  with the question.
- Updated: 2026-04-20T15:04:32.791Z

### Preload the next play question earlier

- Ticket ID: `HE-052`
- Description: Make the next question ready before the user taps next whenever the API contract allows it.
- Status: `Done`
- Summary: Added safe client-side next-question prefetch in `useQuestions` keyed by current `feedItemId`, so
  `fetchNextQuestion` consumes cached data when valid, ignores stale in-flight prefetch results, and falls back to
  normal API fetch when needed; added hook tests for prefetch use and stale-prefetch safety.
- Likely files: `hera/src/pages/PlayPage/hooks/useQuestions.js`, `hera/src/pages/PlayPage/hooks/usePlaySession.js`,
  `hera/src/services/feedService.js`, `zeus/src/main/java/com/ednilo/app/question/feed/**`
- Details: Coordinate with `HE-026` and use prefetch metadata or safe client caching to reduce next-question wait.
  Source: `docs/product/ux-principles.md`.
- Acceptance: Next-question transition feels near-instant when prefetch data is available, stale prefetched data is
  handled safely, and fallback behavior still works.
- Updated: 2026-04-20T15:22:33.068Z

## Migrated Codex Follow-ups

### Wire AI generation tone slider into Zeus prompt contract

- Ticket ID: `ZE-036`
- Description: Hera exposes a 1-5 Style slider on the question generation page, and Zeus accepts the matching `seriousness` request parameter for prompt tone.
- Status: `Done`
- Priority: `Medium`
- Likely files: `zeus/src/main/java/com/ednilo/app/ai/controller/QuestionGenerationController.java`, `zeus/src/main/java/com/ednilo/app/ai/service/QuestionGenerationService.java`, `zeus/src/main/java/com/ednilo/app/ai/service/PromptBuilder.java`, `hera/src/services/aiService.js`.
- Acceptance: Zeus accepts and validates a 1-5 tone value, prompt instructions vary from fun to serious, Hera sends the selected slider value, and focused backend/frontend tests cover the request contract.
- Summary: Added Hera `seriousness` request wiring, Zeus persistence/status/event propagation, and prompt-builder difficulty/seriousness instruction mappings.
- Updated: 2026-05-07T00:00:00.000Z
