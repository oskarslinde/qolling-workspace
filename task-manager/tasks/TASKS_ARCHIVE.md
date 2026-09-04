# Archived Tasks

This file contains tasks archived out of the active task workflow.

---

## Frontend UX

### Replace header text navigation with Coolicons

- Ticket ID: `BO-068`
- Description: After task 57 is complete, replace header text menu items with Coolicons and show each item name on
  hover.
- Status: `Archive`
- Summary: Hera header navigation now uses Coolicons for brand, main menu items, auth actions, and logout, with
  accessible labels plus hover/focus tooltips for the item names.
- Updated: 2026-04-09T10:43:18.270Z
- Execution log: Status sweep 2026-04-09: implemented in codebase, moved to Archive.

### Rename navigation menu items for questions and collections

- Ticket ID: `BO-067`
- Description: Change the menu item label `Question Editor` to `Questions` and `Question Collections` to `Collections`.
- Status: `Archive`
- Summary: Hera navigation now labels those dropdowns as `Questions` and `Collections` while preserving the same routes
  and role behavior.
- Updated: 2026-04-09T10:43:18.227Z
- Execution log: Status sweep 2026-04-09: implemented in codebase, moved to Archive.

### Move About page access to footer and adjust public actions

- Ticket ID: `BO-066`
- Description: Move the About page entry point to the footer, make the page public, keep the existing buttons for
  logged-in users, and show login/sign-up actions instead when the visitor is not logged in.
- Status: `Archive`
- Summary: Hera now exposes About from the footer instead of the authenticated header menu, keeps `/about` public, shows
  login/sign-up CTAs for anonymous visitors, and preserves the existing Start playing/Create question CTAs for logged-in
  users.
- Updated: 2026-04-09T10:43:18.164Z
- Execution log: Status sweep 2026-04-09: implemented in codebase, moved to Archive.

## Logging, Documentation, And Operations

### Keep the documentation-guard pattern and expand it where useful

- Ticket ID: `BO-065`
- Description: Preserve the existing API documentation guard tests and consider extending the same discipline to other
  high-value contract areas.
- Status: `Archive`
- Summary: Zeus already has a strong documentation-guard pattern in place through explicit OpenAPI guard tests. This
  should be preserved as an established quality baseline.
- Updated: 2026-04-09T10:43:18.044Z
- Execution log: Status sweep 2026-04-09: implemented in codebase, moved to Archive.

## Collection Learning Session

### Add a session history page

- Ticket ID: `BO-064`
- Description: Let users review previous collection learning runs without mixing those results into their main profile
  analytics.
- Status: `Archive`
- Likely files: `zeus/src/main/java/com/ednilo/app/question/collection/session/**`, `hera/src/pages/**`,
  `hera/src/services/**`, `hera/src/constants/apiConstants.js`, `hera/src/App.jsx`
- Details: Add a backend read contract for ended sessions if one does not exist, add Hera service methods, add a
  route/page for session history, and decide whether history is per collection or user-wide.
- Acceptance: A logged-in user can open a history page, see prior ended collection sessions, open results for a
  historical session, and no normal profile analytics are shown or mutated.
- Updated: 2026-04-09T10:43:18.008Z
- Execution log: Execution batch 6bf2743f-aaf8-4e9e-ac95-f12224cb2769 started this task on 2026-04-08T03:28:06.028Z.
- Execution log: Execution batch 6bf2743f-aaf8-4e9e-ac95-f12224cb2769 completed this task on 2026-04-08T03:28:07.296Z.
- Execution log: Status sweep 2026-04-09: implemented in codebase, moved to Archive.

### Ensure collection learning sessions do not affect normal feed performance

- Ticket ID: `BO-063`
- Description: Keep targeted collection learning separate from user interactions, user performance, and feed-serving
  logic so practice sessions do not distort the normal recommendation flow.
- Status: `Archive`
- Summary: The session feature was implemented as a separate backend flow and its E2E coverage explicitly verifies that
  `UserInteraction`, `UserPerformance`, and feed state are not mutated by collection sessions.
- Updated: 2026-04-09T10:43:17.984Z
- Execution log: Status sweep 2026-04-09: implemented in codebase, moved to Archive.

### Persist collection learning sessions in the backend

- Ticket ID: `BO-062`
- Description: Replace purely temporary client-side session handling with a real backend session contract that supports
  start, resume, progress tracking, ending, and persisted results.
- Status: `Archive`
- Summary: Zeus now has a dedicated collection learning session backend flow with start, resume, submit answer, advance,
  end, and results endpoints, backed by persisted session state and explicit `STARTED` / `IN_PROGRESS` / `ENDED`
  statuses.
- Updated: 2026-04-09T10:43:17.962Z
- Execution log: Status sweep 2026-04-09: implemented in codebase, moved to Archive.

### Resume an unfinished session after browser refresh

- Ticket ID: `HE-001`
- Description: Make the user experience resilient so an in-progress session can be restored after refresh or returning
  to the app.
- Status: `Archive`
- Summary: The backend already supports persisted active-session lookup and resume, and the Zeus response contract was
  started to expose current-step state more explicitly for frontend restoration. The remaining work is to finish the
  Hera integration so refresh and return-to-session behavior consistently reconnect to the active backend session.
- Likely files: `hera/src/pages/CollectionSessionConfigPage.jsx`, `hera/src/pages/CollectionSessionPlayPage.jsx`,
  `hera/src/features/collections/session/collectionLearningSessionService.js`, `hera/src/services/collectionService.js`,
  `hera/src/constants/apiConstants.js`
- Details: Replace or wrap the local `sessionStorage` flow with Zeus start/current/answer/next/end/results calls,
  preserve loading/error states, and handle no-active-session and already-ended-session cases.
- Acceptance: Refreshing the play page restores the same backend session, the current question and answer state are
  preserved, and returning to a collection with an active session can resume instead of creating duplicate sessions.
- Updated: 2026-04-09T10:43:17.886Z
- Execution log: Status sweep 2026-04-09: implemented in codebase, moved to Archive.

### Add a session history page

- Ticket ID: `BO-052`
- Description: Let users review previous collection learning runs without mixing those results into their main profile
  analytics.
- Status: `Archive`
- Likely files: `zeus/src/main/java/com/ednilo/app/question/collection/session/**`, `hera/src/pages/**`,
  `hera/src/services/**`, `hera/src/constants/apiConstants.js`, `hera/src/App.jsx`
- Details: Add a backend read contract for ended sessions if one does not exist, add Hera service methods, add a
  route/page for session history, and decide whether history is per collection or user-wide.
- Acceptance: A logged-in user can open a history page, see prior ended collection sessions, open results for a
  historical session, and no normal profile analytics are shown or mutated.
- Updated: 2026-04-09T10:43:17.797Z
- Execution log: Status sweep 2026-04-09: implemented in codebase, moved to Archive.

### Expand results metadata

- Ticket ID: `BO-053`
- Description: Show richer run metadata on the results page, including selected count, order mode, total available
  questions, and loop mode.
- Status: `Archive`
- Summary: The backend already stores and returns core session metadata such as question limit, order mode, loop flag,
  sequence size, cycle count, and timestamps. Hera still needs to present that data fully in the results UI.
- Likely files: `hera/src/pages/CollectionSessionResultsPage.jsx`,
  `hera/src/features/collections/session/collectionLearningSessionService.js`,
  `zeus/src/main/java/com/ednilo/app/question/collection/session/dto/CollectionLearningSessionResultsResponse.java`
- Details: Display question limit, order, loop enabled, total selected questions, cycle count, started time, ended time,
  and manual/completed reason where available.
- Acceptance: Results page clearly shows the session configuration and timestamps, and the UI works for completed,
  manually ended, and loop-mode sessions.
- Updated: 2026-04-09T10:43:17.858Z
- Execution log: Status sweep 2026-04-09: implemented in codebase, moved to Archive.

## Suggested Improvements And API Sync

### Run a final Hera-Zeus contract parity cleanup pass

- Ticket ID: `BO-087`
- Description: Final parity pass across Hera constants/services and Zeus controllers/OpenAPI.
- Status: `Archive`
- Likely files: `docs/reference/api-contract-map.md`, `docs/reference/api-contract-map.md`, `hera/src/services/**`,
  `hera/src/constants/apiConstants.js`
- Details: Remove duplicated constants/wrappers and close missing integrations.
- Acceptance: Supported flows are in FE/BE contract parity.
- Updated: 2026-04-09T10:43:17.906Z
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.
- Done summary: Removed duplicated `/me` constant surface, added missing `/me/interactions` wrapper parity, and updated
  API sync docs with focused test coverage.
- Execution log: Status sweep 2026-04-09: implemented in codebase, moved to Archive.
