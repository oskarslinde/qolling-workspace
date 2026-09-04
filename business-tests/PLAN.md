# TEST 2 Collection Session E2E Screenshot Plan

## Status

- [x] Add a real-user Playwright scenario for the public `TEST 2` collection.
- [x] Capture a screenshot at every navigation, configuration, question, answer-feedback, and results state.
- [x] Verify completed-session results against the number of answered questions.
- [!] Run the scenario against the configured local stack. Blocked locally on 2026-09-01: Playwright/Vite intermittently reports `ERR_ADDRESS_IN_USE`, blank pages, and failed frontend health checks before the full flow can complete.

## Scenario

1. Log in with `PLAYWRIGHT_USER_EMAIL` and `PLAYWRIGHT_USER_PASSWORD`, then capture the authenticated home page.
2. Open Public Collections, search for `TEST 2`, open it, and capture the catalog and collection-detail states.
3. Start a session configured for all questions, sequential order, and fixed answer order; capture the configuration page.
4. For every question, capture the unanswered state, select an answer, verify answer feedback, capture it, and continue.
5. Confirm the session automatically reaches results. Verify all selected questions were answered, none were skipped, and correct plus incorrect equals answered. Capture the results state.

## Output

Screenshots are written per Playwright browser project to:

`<PLAYWRIGHT_SCREENSHOT_DIR>/test-2-collection-session/<project>/`

The default root is `business-tests/artifacts/screenshots`. The scenario requires a public, non-empty collection named `TEST 2` and configured user credentials.

The blocked verification produced the initial home, Public Collections, and `TEST 2` detail screenshots for both mobile and desktop, but did not produce session, answer-feedback, or results screenshots.

## Manual Verification

From `business-tests`, run:

```powershell
npm test -- tests/test-2-collection-session.spec.ts
```
