# Auth and Onboarding

## Purpose

Auth gets a user into a secure session. Onboarding completes the profile and preference data needed for a useful first play experience.

## Current Flow

- Registration requires terms acceptance and creates a user that still requires onboarding.
- Login and OAuth responses include `firstLogin`, `requiresOnboarding`, and `requiresTermsAcceptance`.
- Hera redirects authenticated users who still need onboarding or terms acceptance to `/onboarding`.
- Normal authenticated routes remain blocked until onboarding and required terms acceptance are complete.

## Main Contracts

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /email/verify`
- `POST /email/resend-verification`
- `GET /me`
- `PUT /me`
- `PUT /me/onboarding`
- `POST /me/terms-acceptance`
- `GET /countries`

`PUT /me/onboarding` stores profile fields, country, gender, and preferred categories. Hera submits a `countryCode`; Zeus resolves the display name from deterministic country options.

## Key Rules

- Do not add fallback auth, relaxed assertions, alternate credentials, or bypass flows without explicit approval.
- Keep terms acceptance separate from profile editing.
- Keep onboarding completion separate from ordinary profile updates so completion semantics stay explicit.
- Do not hide missing runtime configuration by disabling auth or changing product behavior.
- Preferred categories can influence early feed selection, but feed behavior changes should be planned and tested independently.

## Important Files

- Hera: `src/utils/AuthContext.jsx`, `src/PrivateRoute.jsx`, `src/components/RouteElement.jsx`, `src/pages/OnboardingPage.jsx`.
- Zeus: `auth/**`, `email/**`, `user/profile/**`, `user/performance/**`.
- Tests: Hera onboarding/login/OAuth route tests and Zeus auth/user profile tests.
