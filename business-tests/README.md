# Business Tests

This is the dedicated root-level Playwright project for Qolling business flows.

## Repo structure

- `hera`: frontend application
- `zeus`: backend application
- `business-tests`: browser-based business test project

## Purpose

- Keep browser business tests isolated from Hera unit/component tests.
- Exercise the full running stack through real user-facing flows.
- Prefer mobile-first coverage because the product is planned as a mobile-native web app.

## Structure

- `tests/`: runnable Playwright specs
- `features/`: Gherkin feature files used as business scenario source material
- `support/`: shared helpers, fixtures, auth helpers, and test data utilities
- `.env.example`: local environment template
- `playwright.config.ts`: browser projects and runtime settings

## Local setup

1. Install dependencies:

   ```bash
   cd business-tests
   npm install
   npm run install:browsers
   ```

2. Copy the environment file:

   ```bash
   copy .env.example .env
   ```

3. Start the app stack separately.

   Expected local targets:
   - Hera: `http://127.0.0.1:5173`
   - Zeus: `http://127.0.0.1:8080`

4. Run tests:

   ```bash
   npm test
   ```

## Screenshot capture (mocked data)

Capture deterministic screenshots for core flows (guest + user + admin) in both Playwright projects:

```bash
npm run screenshots
```

Output defaults to:

- `business-tests/artifacts/screenshots/mobile-chromium`
- `business-tests/artifacts/screenshots/desktop-chromium`

Environment options:

- `PLAYWRIGHT_SCREENSHOT_DIR`: overrides screenshot output directory.
- `PLAYWRIGHT_SCREENSHOT_FILTER`: comma-separated filter by case id or role (`guest`, `user`, `admin`).

Examples:

```bash
PLAYWRIGHT_SCREENSHOT_FILTER=admin npm run screenshots
PLAYWRIGHT_SCREENSHOT_FILTER=home,profile npm run screenshots
```

## Credentials

- `tests/login.spec.ts` uses `PLAYWRIGHT_USER_EMAIL` and `PLAYWRIGHT_USER_PASSWORD`
- keep those in `business-tests/.env`
- if they are missing, login and authenticated smoke tests fail immediately with a clear config error
- `tests/smoke.spec.ts` also supports:
- `PLAYWRIGHT_ADMIN_EMAIL` and `PLAYWRIGHT_ADMIN_PASSWORD` for admin smoke coverage
- `PLAYWRIGHT_PUBLIC_COLLECTION_ID` for collection-session setup smoke coverage

## Smoke suite

Run the fast smoke subset with:

```bash
npm run test:smoke
```

The smoke spec covers public auth entry, authenticated core navigation, admin generation entry, and collection-session setup. If `PLAYWRIGHT_PUBLIC_COLLECTION_ID` is not set, it resolves the first visible public collection dynamically.

## Feature Scenario Coverage

- Scenario catalog tests live in `tests/feature-scenarios.spec.ts`.
- Every `features/*.feature` file must map to one executable test marker in the form `[F##]`.
- Run coverage guard:

```bash
npm run check:feature-coverage
```

- CI runs this guard before executing Playwright.

## Writing rules

- Keep tests business-oriented: full flows, permissions, state transitions, and user-visible outcomes.
- Prefer stable role/text/test-id selectors over CSS selectors.
- Cover mobile behavior first. Desktop is secondary unless the flow is desktop-specific.
- Seed data through API/helpers when UI setup would make the scenario noisy.
- Keep one spec focused on one business capability.
