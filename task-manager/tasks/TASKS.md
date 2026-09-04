# Tasks

This file consolidates active Qolling follow-up work.

Completed tasks move to [`TASKS_DONE.md`](/abs/path/C:/Users/user/java/qolling/task-manager/tasks/TASKS_DONE.md).
Postponed tasks move to [`TASKS_POSTPONED.md`](/abs/path/C:/Users/user/java/qolling/task-manager/tasks/TASKS_POSTPONED.md).

Status values used here:

- `Open`
- `UI improvements`
- `Todo`
- `In progress`

---

## Import Data Quality

### Regenerate per-answer explanation API contract snapshots

- Ticket ID: `ZE-045`
- Description: The Zeus question contract now adds contentType, answer-level explanation, and answer-result explanation data. Regenerate the Swagger snapshots and Hera generated API types through the root pipeline; generated artifacts must not be edited manually.
- Status: `Todo`
- Priority: `Medium`
- Likely files: `pipeline.sh`, `zeus/swagger.yaml`, `zeus/swagger.json`, `hera/swagger.json`, `hera/src/services/generated/**`
- Details: Use the pipeline-owned Swagger export after the backend contract is verified, then confirm Hera consumes the refreshed generated types.
- Acceptance: Generated OpenAPI snapshots expose the new fields and Hera's generated type layer matches them without manual edits.
- Updated: 2026-08-31T00:00:00.000Z

---

### Add required categories to the AWS old-ML import output

- Ticket ID: `ZE-044`
- Description: Every item in `generated-prompts/mandatory/aws-old-ml-import/output` lacks the required `categories` array, so Zeus's admin import validator rejects the otherwise normalized question payloads.
- Status: `Todo`
- Priority: `Medium`
- Likely files: `generated-prompts/mandatory/aws-old-ml-import/output/**`, `generated-prompts/mandatory/aws-old-ml-import/certificate-tagging-summary.md`
- Details: Derive and add at least one nonblank category per question while preserving the existing certificate tags and metadata.
- Acceptance: The full output set passes Zeus admin-import validation, including the required category rule, without adding legacy metadata prefixes to display tags.
- Updated: 2026-08-31T00:00:00.000Z

## Zeus Configuration And Security

### Stop leaking OAuth tokens in redirect URLs

- Ticket ID: `ZE-036`
- Description: OAuth2 login success currently appends access and refresh tokens to the frontend redirect query string, which can leak credentials via browser history, referrers, logs, and monitoring tools.
- Status: `Todo`
- Priority: `Critical`
- Likely files: `zeus/src/main/java/com/ednilo/app/auth/oauth2/handler/OAuth2AuthenticationSuccessHandler.java`, `hera/src/pages/**`, `hera/src/services/**`, `zeus/src/test/java/com/ednilo/app/auth/oauth2/handler/**`
- Details: Replace query-param token transport with a safer mechanism such as `HttpOnly` secure cookies, short-lived one-time code exchange, or fragment flow with immediate in-app scrub plus strict referrer policy.
- Acceptance: OAuth callback no longer exposes bearer tokens in URL query parameters, and tests verify secure post-login token delivery behavior.
- Updated: 2026-05-11T00:00:00.000Z

### Move browser token storage away from localStorage

- Ticket ID: `HE-062`
- Description: Hera currently stores access and refresh tokens in `localStorage`, which turns any XSS into immediate credential exfiltration and account takeover risk.
- Status: `Todo`
- Priority: `High`
- Likely files: `hera/src/utils/AuthContext.tsx`, `hera/src/utils/api.ts`, `hera/src/pages/OAuthCallbackPage.tsx`, `zeus/src/main/java/com/ednilo/app/auth/**`, `zeus/src/test/java/com/ednilo/app/auth/**`
- Details: Move refresh-token handling to `HttpOnly` secure cookies and keep access tokens short-lived and in-memory where possible; update login/refresh/logout flows and associated frontend assumptions.
- Acceptance: No auth tokens are persisted in `localStorage`, authenticated flows still work across login/refresh/logout/OAuth callback, and regression tests cover token lifecycle behavior.
- Updated: 2026-05-11T00:00:00.000Z

### Sanitize OAuth failure redirect payloads

- Ticket ID: `ZE-038`
- Description: OAuth2 failure redirects currently include raw exception messages in query parameters, which can leak internal details and create reflected-content risk.
- Status: `Todo`
- Priority: `Medium`
- Likely files: `zeus/src/main/java/com/ednilo/app/auth/oauth2/handler/OAuth2AuthenticationFailureHandler.java`, `hera/src/pages/OAuthCallbackPage.tsx`, `hera/src/pages/LoginPage.tsx`, `zeus/src/test/java/com/ednilo/app/auth/oauth2/handler/**`
- Details: Replace raw exception text with stable error codes or generic user-safe messages; map codes to friendly UI text on Hera.
- Acceptance: OAuth failure URLs never include raw backend exception text, Hera still shows clear user-safe errors, and tests verify redirect payload sanitization.
- Updated: 2026-05-11T00:00:00.000Z

### Add auth endpoint brute-force and abuse throttling

- Ticket ID: `ZE-039`
- Description: Zeus authentication endpoints currently lack explicit brute-force/rate-limit controls, increasing credential-stuffing and password-spraying risk.
- Status: `Todo`
- Priority: `High`
- Likely files: `zeus/src/main/java/com/ednilo/app/auth/controller/AuthController.java`, `zeus/src/main/java/com/ednilo/app/auth/service/LoginService.java`, `zeus/src/main/java/com/ednilo/app/common/config/**`, `zeus/src/main/resources/application.yml`, `zeus/src/test/java/com/ednilo/app/auth/**`
- Details: Add per-IP and/or per-identifier throttling on login/refresh/logout paths with safe defaults, clear responses, and observability for blocked attempts.
- Acceptance: Repeated failed auth attempts are throttled consistently, normal user flows remain functional, and tests cover throttle behavior and recovery windows.
- Updated: 2026-05-11T00:00:00.000Z

### Normalize refresh-token failure responses

- Ticket ID: `ZE-040`
- Description: Refresh-token validation currently returns distinct failure messages (`not found`, `revoked`, `expired`) that expose token-state details to clients.
- Status: `Todo`
- Priority: `Medium`
- Likely files: `zeus/src/main/java/com/ednilo/app/auth/refresh/RefreshTokenService.java`, `zeus/src/main/java/com/ednilo/app/common/exception/GlobalExceptionHandler.java`, `zeus/src/main/java/com/ednilo/app/auth/refresh/InvalidRefreshTokenException.java`, `zeus/src/test/java/com/ednilo/app/auth/refresh/**`
- Details: Collapse refresh-token validation failures to one generic unauthorized response while preserving detailed diagnostics in internal logs only.
- Acceptance: Refresh-token API responses no longer reveal token state categories, while logs retain enough context for debugging and tests verify generic client-facing behavior.
- Updated: 2026-05-11T00:00:00.000Z

### Remove bundled TLS keystore and weak default keystore password

- Ticket ID: `ZE-037`
- Description: The repository currently ships `src/main/resources/keystore.p12` and a default keystore password fallback, which creates avoidable private key exposure and insecure startup defaults.
- Status: `Todo`
- Priority: `High`
- Likely files: `zeus/src/main/resources/keystore.p12`, `zeus/src/main/resources/application.yml`, deployment/runtime TLS documentation under `zeus/docs/**`
- Details: Remove committed private keystore material from source control, rotate certificates if needed, and require runtime-provided keystore/password without insecure fallback defaults.
- Acceptance: No private keystore material is committed, startup requires explicit secure TLS configuration, and deployment docs describe safe certificate provisioning.
- Updated: 2026-05-11T00:00:00.000Z

### Add frontend edge security headers and HTTPS enforcement

- Ticket ID: `HE-063`
- Description: Hera nginx config currently serves on port 80 without explicit security headers, increasing risk from XSS, clickjacking, content sniffing, and downgrade/transport weaknesses.
- Status: `Todo`
- Priority: `Medium`
- Likely files: `hera/nginx.conf`, `hera/Dockerfile`, deployment ingress/reverse-proxy config, `hera/docs/**`
- Details: Add and verify baseline edge headers (`Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, frame restrictions via `X-Frame-Options` or `CSP frame-ancestors`) and enforce HTTPS with HSTS at the serving edge once TLS termination is guaranteed.
- Acceptance: Production-serving config emits baseline security headers for all app/API responses, HTTP is redirected or terminated behind HTTPS-only routing, HSTS is enabled in TLS environments, and docs capture expected header/TLS posture.
- Updated: 2026-05-11T00:00:00.000Z

### Normalize security matcher paths around the API prefix

- Ticket ID: `ZE-002`
- Description: Clean up security route matching so public and protected endpoint rules are easier to reason about with
  the `/api/v1` servlet path in place.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/common/config/SecurityConfig.java`,
  `zeus/src/test/java/com/ednilo/app/auth/oauth2/controller/OAuth2EndpointMvcTest.java`,
  `zeus/src/test/java/com/ednilo/app/**/controller/**`
- Details: Audit matcher behavior with `spring.mvc.servlet.path=/api/v1`, remove duplicate prefixed/unprefixed matchers
  where safe, and add regression coverage for public/protected endpoints.
- Acceptance: Security rules are documented by tests and endpoint access does not depend on confusing duplicate path
  variants.
- Updated: 2026-04-09T12:05:44.467Z

### Revisit public image access policy

- Ticket ID: `ZE-003`
- Description: Decide deliberately whether question images should remain public and document/enforce the intended access
  model.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/common/config/SecurityConfig.java`,
  `zeus/src/main/java/com/ednilo/app/common/config/WebConfig.java`,
  `zeus/src/main/java/com/ednilo/app/question/image/service/**`, `zeus/docs/**`
- Details: Decide whether `/images/questions/**` is public, authenticated, signed, or visibility-aware; update security
  rules and documentation accordingly.
- Acceptance: The intended policy is documented, enforced by `SecurityConfig`, and covered by a controller/security test
  where feasible.

## Auth And Principal Handling

### Harden controller principal assumptions

- Ticket ID: `ZE-005`
- Description: Remove direct unsafe assumptions that `@AuthenticationPrincipal` is always a `JwtUser`, especially on
  product-critical endpoints such as feed.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/question/feed/controller/FeedController.java`,
  `zeus/src/main/java/com/ednilo/app/**/controller/*.java`, `zeus/src/main/java/com/ednilo/app/auth/**`,
  `zeus/src/test/java/com/ednilo/app/**/controller/**`
- Details: Introduce a safer current-user resolver or guard pattern, apply it first to feed endpoints, then migrate
  other high-risk controllers.
- Acceptance: Non-`JwtUser` principals return a controlled auth error instead of `NullPointerException` or
  `ClassCastException`, with regression tests.

### Fix MockMvc collection-session auth flow test

- Ticket ID: `ZE-006`
- Description: Align the MockMvc integration test with the actual security model so it authenticates correctly and
  validates the intended business flow instead of failing on auth setup.
- Status: `Open`
- Likely files: `zeus/src/test/java/com/ednilo/app/question/e2e/CollectionLearningSessionMockMvcIntegrationTest.java`,
  `zeus/src/test/java/com/ednilo/app/question/e2e/AbstractE2ETestSupport.java`
- Details: Ensure the test logs in with the real auth path, sends Bearer tokens, and checks session
  start/resume/answer/next/end/results behavior.
- Acceptance: The MockMvc collection-session integration test passes reliably and fails only on real business/security
  regressions.
- Updated: 2026-04-09T11:55:15.929Z

## API Contract And Validation

### Tighten request DTO discipline on weaker endpoints

- Ticket ID: `ZE-007`
- Description: Replace weak or overloaded request contracts with narrower write DTOs where read DTOs or entities are
  still used for mutation flows.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/user/profile/**`,
  `zeus/src/main/java/com/ednilo/app/question/core/dto/**`,
  `zeus/src/main/java/com/ednilo/app/question/collection/dto/**`, `zeus/src/main/java/com/ednilo/app/**/controller/**`
- Details: Replace read DTOs/entities used as request bodies with dedicated update/create request DTOs and map
  explicitly in services.
- Acceptance: Mutation endpoints use dedicated request DTOs and tests confirm unsupported client-supplied read-only
  fields are ignored or rejected.

### Add missing validation on update and multipart endpoints

- Ticket ID: `ZE-008`
- Description: Apply consistent request validation on profile updates, collection updates, question mutations, and other
  weaker API boundary paths.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/user/profile/dto/**`,
  `zeus/src/main/java/com/ednilo/app/question/core/dto/**`,
  `zeus/src/main/java/com/ednilo/app/question/collection/dto/**`, `zeus/src/main/java/com/ednilo/app/**/controller/**`
- Details: Add Jakarta validation annotations, `@Valid` on request bodies, and multipart JSON validation where
  applicable.
- Acceptance: Invalid update payloads return validation errors consistently and controller/service tests cover
  representative bad requests.

### Eliminate entity leakage from controller responses

- Ticket ID: `ZE-009`
- Description: Standardize API responses around DTOs instead of mixing entity returns and DTO returns across the same
  module.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/user/performance/controller/UserPerformanceController.java`,
  `zeus/src/main/java/com/ednilo/app/user/interaction/controller/UserInteractionController.java`,
  `zeus/src/main/java/com/ednilo/app/question/core/controller/QuestionController*.java`,
  `zeus/src/main/java/com/ednilo/app/**/dto/**`
- Details: Inventory entity response types, create safe response DTOs, and update OpenAPI annotations to match.
- Acceptance: Public/controller responses no longer expose persistence entities on targeted endpoints and serialization
  tests/OpenAPI guards stay green.

### Correct semantically inconsistent response signatures

- Ticket ID: `ZE-010`
- Description: Fix endpoints whose declared response type does not match actual behavior, such as no-content responses
  declaring entity bodies.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/question/feed/controller/FeedController.java`,
  `zeus/src/main/java/com/ednilo/app/question/core/controller/QuestionController*.java`,
  `zeus/src/main/java/com/ednilo/app/**/controller/**`, `zeus/src/test/java/com/ednilo/app/documentation/**`
- Details: Align `ResponseEntity` generics, `@ResponseStatus`, OpenAPI responses, and actual response bodies/status
  codes.
- Acceptance: Endpoint signatures accurately describe behavior and documentation guard tests do not flag mismatches.

### Add dedicated admin-user interaction DTO

- Ticket ID: `ZE-011`
- Description: Replace raw interaction entity exposure in admin interaction review with a stable admin-safe response
  DTO.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/user/interaction/dto/AdminUserInteractionDTO.java`,
  `zeus/src/main/java/com/ednilo/app/user/interaction/service/UserInteractionService.java`,
  `zeus/src/main/java/com/ednilo/app/user/profile/AdminUserController.java`,
  `zeus/src/test/java/com/ednilo/app/user/profile/AdminUserControllerTest.java`
- Details: Confirm the admin DTO contains only intended fields, update tests/OpenAPI docs, and remove any remaining raw
  entity exposure for admin interactions.
- Acceptance: Admin interaction review returns `AdminUserInteractionDTO` consistently and no raw `UserInteraction`
  entity is serialized from that endpoint.

### Normalize fallback exception responses to the API error contract

- Ticket ID: `ZE-041`
- Description: Unhandled runtime exceptions currently fall back to a non-standard `{ "error": ... }` body, which breaks
  the otherwise stable `ApiErrorResponse` contract and causes endpoint-specific drift (for example email resend
  user-not-found flows).
- Status: `Todo`
- Priority: `High`
- Likely files: `zeus/src/main/java/com/ednilo/app/common/exception/GlobalExceptionHandler.java`,
  `zeus/src/main/java/com/ednilo/app/email/service/EmailVerificationService.java`,
  `zeus/src/main/java/com/ednilo/app/common/exception/ApiError.java`,
  `zeus/src/test/java/com/ednilo/app/common/exception/GlobalExceptionHandlerTest.java`,
  `zeus/src/test/java/com/ednilo/app/email/controller/EmailVerificationControllerTest.java`
- Details: Route known business failures to typed `ApiException` (or explicit mapped handlers), keep fallback error
  payload shape consistent with `ApiErrorResponse`, and align controller docs/tests with actual status semantics.
- Acceptance: Client-facing error payloads are contract-consistent across handled and fallback paths, and resend-email
  missing-user scenarios return deliberate typed API errors instead of generic 500 fallback bodies.
- Updated: 2026-05-12T00:00:00.000Z

## Collection Truth And Data Consistency

### Eliminate collection count drift

- Ticket ID: `ZE-012`
- Description: Remove or harden duplicated `questionCount` behavior so stored collection metadata cannot drift from the
  actual collection contents and playable state.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/question/collection/entity/QuestionCollection.java`,
  `zeus/src/main/java/com/ednilo/app/question/collection/service/QuestionCollectionServiceImpl.java`,
  `zeus/src/main/java/com/ednilo/app/question/collection/mapper/QuestionCollectionMapper.java`,
  `zeus/src/test/java/com/ednilo/app/question/collection/**`
- Details: Decide whether `questionCount` is derived or stored; if stored, centralize updates and add invariants/tests
  around create/update/add/remove.
- Acceptance: Collection count cannot drift during supported mutation flows, and tests cover create, replace, add,
  remove, and deleted-question scenarios.

### Distinguish stored question membership from playable question state

- Ticket ID: `BO-059`
- Description: Model and expose the difference between questions listed in a collection and questions currently playable
  from that collection.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/question/collection/dto/QuestionCollectionDTO.java`,
  `zeus/src/main/java/com/ednilo/app/question/collection/service/QuestionCollectionServiceImpl.java`,
  `hera/src/pages/ViewCollectionPage.jsx`, `hera/src/features/collections/components/CollectionSummaryCard.jsx`
- Details: Make the API/UI distinction explicit with separate stored count and playable count/summary, and avoid labels
  that imply inactive questions are playable.
- Acceptance: Public collection pages display playable availability separately from total stored membership.

### Add stronger invariants around collection mutation flows

- Ticket ID: `ZE-013`
- Description: Tighten validation and business rules on add/remove/update flows so collection state stays trustworthy as
  the feature grows.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/question/collection/dto/**`,
  `zeus/src/main/java/com/ednilo/app/question/collection/service/QuestionCollectionServiceImpl.java`,
  `zeus/src/test/java/com/ednilo/app/question/collection/service/QuestionCollectionServiceImplTest.java`
- Details: Validate duplicate question ids, null/blank ids, invalid state transitions, ownership, max sizes if needed,
  and question existence/playability expectations.
- Acceptance: Invalid mutation inputs return controlled errors and collection state remains unchanged after rejected
  operations.

### Remove service-level MongoTemplate coupling in badge progress updates

- Ticket ID: `ZE-043`
- Description: Badge progress writes currently use `MongoTemplate` directly inside a service, bypassing the repository
  boundary and weakening portability, testability, and consistency with Zeus data-access rules.
- Status: `Todo`
- Priority: `Medium`
- Likely files: `zeus/src/main/java/com/ednilo/app/user/badge/service/BadgeProgressUpdateService.java`,
  `zeus/src/main/java/com/ednilo/app/user/badge/repository/**`,
  `zeus/src/test/java/com/ednilo/app/user/badge/service/**`
- Details: Move persistence mechanics behind repository methods (derived query / `@Query` + `@Update` where needed) and
  keep service logic focused on orchestration.
- Acceptance: Badge progress service no longer depends on `MongoTemplate`, and regression tests preserve current atomic
  update behavior.
- Updated: 2026-05-12T00:00:00.000Z

## Feed And Performance

### Make feed keyword filtering less wasteful

- Ticket ID: `ZE-014`
- Description: Revisit the current polling loop so keyword filtering does not repeatedly consume preloaded questions in
  a way that distorts feed quality.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/question/feed/service/FeedService.java`,
  `zeus/src/main/java/com/ednilo/app/question/feed/service/PreloaderService.java`,
  `zeus/src/test/java/com/ednilo/app/question/feed/service/FeedServiceTest.java`
- Details: Avoid discarding buffered questions that do not match keyword; consider keyword-aware selection or requeueing
  non-matches safely.
- Acceptance: Keyword filtering returns matching questions when available without silently burning unrelated preloaded
  feed candidates.

### Review feed hot-path lookups

- Ticket ID: `ZE-015`
- Description: Check repeated username resolution and other per-request lookups in the feed path for scaling and caching
  concerns.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/question/feed/service/FeedService.java`,
  `zeus/src/main/java/com/ednilo/app/question/core/service/UsernameLookupHelper.java`,
  `zeus/src/main/java/com/ednilo/app/common/config/CaffeineCacheConfiguration.java`,
  `zeus/src/test/java/com/ednilo/app/question/feed/service/FeedServiceTest.java`
- Details: Review username lookup, user performance reads, interaction summary loads, and preloader behavior for
  repeated work on hot endpoints.
- Acceptance: The hot path has clear caching/batching behavior and tests cover fallback username resolution without
  repeated unnecessary repository calls.

### Strengthen boundaries between feed interactions and non-scoring features

- Ticket ID: `ZE-016`
- Description: Make the separation between normal feed interactions and adjacent learning features more explicit so
  future changes cannot accidentally pollute scoring inputs.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/question/feed/**`,
  `zeus/src/main/java/com/ednilo/app/question/collection/session/**`,
  `zeus/src/test/java/com/ednilo/app/question/e2e/CollectionLearningSessionE2ETest.java`
- Details: Document or enforce that collection-session answers do not write feed interactions, feed items, or user
  performance signals.
- Acceptance: Tests fail if collection session answer/skip/end writes feed scoring inputs.

### Add optimistic-lock collision handling for high-write gameplay aggregates

- Ticket ID: `ZE-042`
- Description: Hot write paths update mutable documents via read-modify-save without bounded collision handling, which
  can surface optimistic-lock failures or lost updates under concurrent play traffic.
- Status: `Todo`
- Priority: `High`
- Likely files: `zeus/src/main/java/com/ednilo/app/question/feed/service/AnswerService.java`,
  `zeus/src/main/java/com/ednilo/app/question/core/entity/Question.java`,
  `zeus/src/main/java/com/ednilo/app/user/performance/service/UserPerformanceService.java`,
  `zeus/src/main/java/com/ednilo/app/question/collection/session/service/CollectionLearningSessionService.java`,
  `zeus/src/test/java/com/ednilo/app/question/feed/service/AnswerServiceTest.java`,
  `zeus/src/test/java/com/ednilo/app/question/collection/session/service/CollectionLearningSessionServiceTest.java`
- Details: Add bounded retry logic for optimistic-lock conflicts on versioned aggregates and explicit concurrency
  strategy for mutable aggregates currently lacking versioning in high-contention flows.
- Acceptance: Concurrent answer/session update scenarios are deterministic and tested, with controlled retry/failure
  behavior instead of intermittent 500s or silent lost updates.
- Updated: 2026-05-12T00:00:00.000Z

## AI And Async Operations

### Validate requested AI model against an allow-list

- Ticket ID: `ZE-017`
- Description: Reject unsupported model values server-side instead of relying on upstream provider failure.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/ai/service/QuestionGenerationService.java`,
  `zeus/src/main/java/com/ednilo/app/ai/service/CloudflareApiClient.java`, `zeus/src/main/resources/application.yml`,
  `zeus/src/test/java/com/ednilo/app/ai/service/QuestionGenerationServiceTest.java`
- Details: Use configured allowed models, reject unknown model values before job publication, and ensure error messages
  do not leak sensitive provider config.
- Acceptance: Unsupported models return a controlled 400-style API error and supported configured models continue to
  work.

### Add admin endpoint for AI generation job status

- Ticket ID: `BO-060`
- Description: Provide a read API so the frontend can query generation job status, errors, and summary results by
  `jobId`.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/ai/controller/QuestionGenerationController.java`,
  `zeus/src/main/java/com/ednilo/app/ai/dto/QuestionGenerationJobStatusResponse.java`,
  `zeus/src/main/java/com/ednilo/app/ai/service/QuestionGenerationService.java`, `hera/src/services/aiService.js`
- Details: Ensure status endpoint is admin-protected if intended, includes pending/completed/failed states, and has a
  stable frontend service method.
- Acceptance: Admin clients can query `jobId` status and receive generated count, requested count, error message, and
  result summary when available.

### Persist better raw AI generation traces

- Ticket ID: `ZE-018`
- Description: Replace weak `toString()`-style persistence of generated output with a more robust raw-response and
  metadata storage strategy.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/ai/entity/AiRawResponse.java`,
  `zeus/src/main/java/com/ednilo/app/ai/service/QuestionGenerationService.java`,
  `zeus/src/main/java/com/ednilo/app/ai/service/CloudflareApiClient.java`, `zeus/src/test/java/com/ednilo/app/ai/**`
- Details: Persist raw provider responses per generation attempt or a structured trace object rather than
  `generated.toString()`, and include useful metadata for debugging.
- Acceptance: Stored AI trace data is machine-readable, tied to the job id/model/topic, and does not rely on Java object
  `toString()` output.

### Improve observability for async and AI flows

- Ticket ID: `ZE-020`
- Description: Add enough logs, identifiers, and state visibility to debug failures in event-driven and AI-related flows
  efficiently.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/ai/**`, `zeus/src/main/java/com/ednilo/app/common/messaging/**`,
  `zeus/src/main/java/com/ednilo/app/email/infrastructure/messaging/**`, `zeus/src/main/resources/application.yml`
- Details: Ensure logs include job ids/event ids without logging sensitive raw payloads; add counters or status fields
  where they add operational value.
- Acceptance: A failed AI generation or email event can be traced from request to listener failure/dead-letter using
  logged ids and persisted status.

## Logging, Documentation, And Operations

### Reduce noisy default logging

- Ticket ID: `ZE-021`
- Description: Revisit debug-level defaults and request logging so the baseline runtime behavior is quieter and safer.
- Status: `Open`
- Likely files: `zeus/src/main/resources/application.yml`, `zeus/src/main/resources/application-prod.yml`,
  `zeus/src/main/java/com/ednilo/app/common/config/ApiLoggingInterceptor.java`,
  `zeus/src/main/java/com/ednilo/app/common/config/WebConfig.java`
- Details: Reduce default `DEBUG` logging, make API interceptor opt-in where appropriate, and avoid logging sensitive
  payloads or raw AI responses by default.
- Acceptance: Default runtime logging is INFO/WARN-oriented, production is quiet, and debug logging can still be enabled
  intentionally.

### Improve README accuracy and reduce stale operational instructions

- Ticket ID: `ZE-022`
- Description: Clean up duplicate, outdated, or inconsistent setup and run instructions in the Zeus README.
- Status: `Open`
- Likely files: `zeus/README.md`, `docs/codex/quick-reference.md`, `docker-compose.yml`, `.env.dev`
- Details: Align README with current profiles, env vars, OAuth callback paths, actuator health path, Docker/Maven
  commands, and local development assumptions.
- Acceptance: A new contributor can follow README setup without hitting known stale instructions, and env var names
  match current config.

### Reassess public test/debug endpoints

- Ticket ID: `ZE-023`
- Description: Review endpoints such as email test utilities and ensure they are hidden, non-production, or properly
  protected.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/email/controller/EmailTestController.java`,
  `zeus/src/main/java/com/ednilo/app/common/config/SecurityConfig.java`, `zeus/src/main/resources/application-*.yml`,
  `zeus/src/test/java/com/ednilo/app/**`
- Details: Remove, profile-gate, or secure `/test/email` and any similar operational/debug endpoint; update OpenAPI
  visibility if retained.
- Acceptance: Test/debug endpoints are not publicly reachable in production and the intended access model is covered by
  security tests.

### Document the intended auth-state model for contributors

- Ticket ID: `ZE-024`
- Description: Add clear backend documentation for the JWT, refresh token, OAuth2, and session interaction model to
  reduce future confusion.
- Status: `Open`
- Likely files: `zeus/docs/**`, `zeus/README.md`, `zeus/AGENTS.md`
- Details: Document login/register, refresh tokens, OAuth2 callback token issuance, session usage, logout behavior, and
  how controllers should resolve principals.
- Acceptance: Contributor docs describe the auth model clearly enough to implement new protected endpoints without
  guessing.

## Frontend UX

### Add global device-type detection and display it on profile

- Ticket ID: `HE-007`
- Description: Create simple global logic that detects whether the user appears to be on mobile or PC so all pages can
  later consume the value, and initially display the detected value on the My Profile page.
- Status: `Open`
- Likely files: `hera/src/App.jsx`, `hera/src/main.jsx`, `hera/src/context/**`, `hera/src/hooks/**`,
  `hera/src/pages/ProfilePage.jsx`, `hera/src/pages/__tests__/ProfilePage.test.jsx`
- Details: Create a small provider or hook based on viewport/user-agent, expose a normalized value such as `mobile` or
  `pc`, and keep the API reusable for future pages.
- Acceptance: My Profile displays the detected device type, the value updates or is stable according to the chosen
  detection approach, and tests cover at least one expected output.

### Make registration page consistent with login page

- Ticket ID: `HE-008`
- Description: Align the registration page layout, styling, and interaction patterns with the login page for a more
  consistent authentication experience.
- Status: `Open`
- Likely files: `hera/src/pages/LoginPage.jsx`, `hera/src/pages/RegisterPage.jsx`,
  `hera/src/pages/__tests__/LoginPage.test.jsx`, `hera/src/pages/__tests__/RegisterPage.test.jsx`,
  `hera/src/components/ui/**`
- Details: Compare login/register structure, copy, spacing, button styles, error placement, secondary links, and loading
  states; prefer shared auth page patterns where simple.
- Acceptance: Register and login pages use consistent layout and visual treatment, while retaining registration-specific
  fields and validation behavior.

### Keep PlayPage answer feedback visible after selecting an answer

- Ticket ID: `HE-009`
- Description: Fix the PlayPage behavior where the correct/incorrect result disappears too quickly after the user
  selects an answer.
- Status: `Open`
- Likely files: `hera/src/pages/PlayPage/**`, `hera/src/features/play/components/PlayQuestionPanel.jsx`,
  `hera/src/features/play/components/PlayAnswerFeedback.jsx`, `hera/src/features/play/components/PlayAnswerList.jsx`,
  `hera/src/pages/PlayPage/__tests__/PlayPage.test.jsx`, `hera/src/features/play/components/__tests__/**`
- Details: Trace whether feedback is cleared by selection state reset, automatic next-question prefetch/navigation,
  answer result state replacement, or component remounting; keep the result visible until the user explicitly advances
  or the next question is loaded.
- Acceptance: After selecting an answer on PlayPage, the correct/incorrect feedback remains visible long enough for the
  user to read it and does not disappear until the intended next action/state transition.

### Complete favorite questions feature

- Ticket ID: `BO-061`
- Description: Make the PlayPage star turn golden when a question is favorited, and add a Favorite Questions page under
  the Question Editor menu where users can view all questions they favorited.
- Status: `Open`
- Likely files: `hera/src/pages/PlayPage/**`, `hera/src/features/play/components/PlayQuestionPanel.jsx`,
  `hera/src/services/questionService.js`, `hera/src/constants/apiConstants.js`, `hera/src/components/Navbar.jsx`,
  `hera/src/pages/**FavoriteQuestions**`, `hera/src/pages/__tests__/**`,
  `zeus/src/main/java/com/ednilo/app/question/core/controller/QuestionController*.java`,
  `zeus/src/main/java/com/ednilo/app/question/favorite/**`
- Details: Track favorite state in the play UI, style the star as golden when favorited, avoid duplicate favorite calls,
  add a route/page for favorite questions, add navigation from the Question Editor menu, and wire the page to the
  backend favorite-question list endpoint or add one if missing.
- Acceptance: Clicking the star favorites the current question and immediately shows a golden star; revisiting a
  favorited question preserves the golden state; Favorite Questions is reachable from the Question Editor menu and lists
  the authenticated userâ€™s favorited questions.

### Collapse page filters behind a Filter toggle

- Ticket ID: `HE-010`
- Description: On My Questions and other pages with filtering controls, show a Filter button first and let users open or
  close the filter panel so pages do not load cluttered with filter options.
- Status: `Open`
- Likely files: `hera/src/pages/ViewMyQuestionsPage.jsx`, `hera/src/pages/ViewAllCollectionsPage.jsx`,
  `hera/src/pages/ViewMyCollectionsPage.jsx`, `hera/src/pages/AdminUsersPage.jsx`, `hera/src/components/ui/**`,
  `hera/src/pages/__tests__/**`
- Details: Inventory pages with filter/search controls, create or reuse a collapsible filter panel pattern, preserve
  active filter state when the panel is closed, and ensure mobile/desktop layouts remain usable.
- Acceptance: Pages with filters initially show a clear Filter button instead of expanded controls; opening the panel
  reveals the controls; closing the panel does not clear applied filters unless the user explicitly resets them.

## Task Manager Board UX

### Add board search and filter controls

- Ticket ID: `HE-012`
- Description: Add text search and status/section filters to the task-manager board so large backlogs are manageable.
- Status: `Open`
- Likely files: `task-manager/public/**`, `task-manager/src/server.js`
- Details: Support fast filtering by title, ticket id, status, and section without breaking current drag/move flow.
- Acceptance: Users can narrow visible cards quickly by query and structured filters.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Support creating new tasks from the browser UI

- Ticket ID: `BO-072`
- Description: Add create-task support to task-manager UI and API.
- Status: `Open`
- Likely files: `task-manager/public/**`, `task-manager/src/server.js`, `task-manager/src/taskStore.js`
- Details: Allow creating tasks with section, title, status, ticket id assignment, and metadata fields.
- Acceptance: A new task can be created from UI and persists into markdown files.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Support editing task details from the browser UI

- Ticket ID: `BO-073`
- Description: Add edit flow for task title/description/details/acceptance fields in task-manager UI.
- Status: `Open`
- Likely files: `task-manager/public/**`, `task-manager/src/server.js`, `task-manager/src/taskStore.js`
- Details: Keep markdown formatting stable after edits and preserve unknown extra lines.
- Acceptance: Existing task details are editable in UI and persisted safely.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Add explicit task ordering controls within a status column

- Ticket ID: `BO-074`
- Description: Add explicit ordering controls so tasks can be prioritized within the same status.
- Status: `Open`
- Likely files: `task-manager/public/**`, `task-manager/src/taskStore.js`
- Details: Introduce stable order metadata or deterministic markdown ordering strategy.
- Acceptance: Users can re-order tasks in a column and order persists.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Make likely-file references actionable in the task dialog

- Ticket ID: `BO-075`
- Description: Convert `Likely files` references into actionable/clickable items in task details UI.
- Status: `Open`
- Likely files: `task-manager/public/**`
- Details: Parse markdown-like file references and render them as links/buttons.
- Acceptance: File references are easy to open from the board dialog.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Harden markdown parsing and write-back for malformed task files

- Ticket ID: `BO-076`
- Description: Make task-manager parser resilient to malformed markdown and partial edits.
- Status: `Open`
- Likely files: `task-manager/src/taskStore.js`, `task-manager/test/**`
- Details: Fail safely, preserve recoverable tasks, and avoid destructive rewrites.
- Acceptance: Malformed file segments no longer wipe unrelated tasks.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Use real atomic writes with rollback-friendly temp files

- Ticket ID: `BO-077`
- Description: Implement atomic write strategy using temp-file + rename to reduce corruption risk.
- Status: `Open`
- Likely files: `task-manager/src/taskStore.js`, `task-manager/src/executionStore.js`
- Details: Ensure writes are durable and fallback/rollback remains possible.
- Acceptance: Task writes avoid truncation on interruption.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Add bulk selection and bulk status moves

- Ticket ID: `BO-078`
- Description: Add multi-select and bulk status changes in task-manager board UI.
- Status: `Open`
- Likely files: `task-manager/public/**`, `task-manager/src/server.js`
- Details: Support selecting many tasks and moving all in one action.
- Acceptance: Bulk move works across statuses and preserves task metadata.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Add keyboard-first board interactions and non-drag status changes

- Ticket ID: `BO-079`
- Description: Improve accessibility and speed with keyboard-driven status changes.
- Status: `Open`
- Likely files: `task-manager/public/**`
- Details: Add hotkeys/focus handling for selecting tasks and moving status without drag-and-drop.
- Acceptance: Core board operations are fully usable without mouse drag.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Add server/API regression tests above the task store layer

- Ticket ID: `BO-080`
- Description: Add tests for HTTP API behavior, not just store/parser internals.
- Status: `Open`
- Likely files: `task-manager/test/**`, `task-manager/src/server.js`
- Details: Cover task list, status update, execute flow, and error handling scenarios.
- Acceptance: API-level regressions are caught by automated tests.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Generate a compact execution packet for the next task

- Ticket ID: `BO-087`
- Description: Add a task-manager action that produces one tight execution packet for the next selected task so
  implementation can start without repeated board/file re-reading.
- Status: `Open`
- Likely files: `task-manager/public/**`, `task-manager/src/server.js`, `task-manager/src/taskStore.js`,
  `task-manager/README.md`
- Details: Include ticket id, title, status, likely files, acceptance criteria, and a short recent-history summary in a
  compact export/copy block designed for low-token handoff.
- Acceptance: Users can generate a concise task packet from the board, and it contains enough context to execute the
  task without reopening multiple task files or restating the same metadata in chat.

### Support bounded batch execution for multiple Todo tasks

- Ticket ID: `BO-088`
- Description: Let task-manager prepare and track a small user-chosen batch of Todo tasks so several low-risk tasks can
  be completed in one conversation instead of one turn per task.
- Status: `Open`
- Likely files: `task-manager/public/**`, `task-manager/src/server.js`, `task-manager/src/executionStore.js`,
  `task-manager/README.md`
- Details: Support selecting the next `N` Todo tasks, show ordered execution context, and preserve batch progress as
  tasks move to `Done`.
- Acceptance: Users can start a bounded execution batch from the board, see the ordered task list and progress, and
  finish several queued tasks with fewer manual execute/restart turns.

### Add standardized completion summaries and reusable verification templates

- Ticket ID: `BO-089`
- Description: Add task-manager support for structured completion summaries so final reports are short, predictable, and
  do not require repeated manual recap generation.
- Status: `Open`
- Likely files: `task-manager/public/**`, `task-manager/src/server.js`, `task-manager/src/taskStore.js`,
  `task-manager/README.md`
- Details: Capture changed areas, verification commands, result status, and follow-up notes in a consistent template
  that can be copied directly into the final task closeout.
- Acceptance: Completing a task produces a concise summary template with changed files/areas, tests run, and task
  status, reducing repeated custom writeups and follow-up clarification turns.

## Local Data Environment

### Switch local development to Docker Mongo by default

- Ticket ID: `BO-081`
- Description: Use local Docker Mongo for default local development/testing.
- Status: `Open`
- Likely files: `docker-compose.yml`, `.env.dev`, `zeus/README.md`, `docs/**`
- Details: Provide standard local DB startup and runtime wiring docs.
- Acceptance: Fresh local setup runs against local Mongo with documented commands.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Add a repeatable cloud-to-local Mongo import workflow

- Ticket ID: `BO-082`
- Description: Document and script repeatable import from cloud Mongo into local Docker Mongo.
- Status: `Open`
- Likely files: `docs/**`, `scripts/**`, `docker-compose.yml`
- Details: Cover export/import commands, mapping, and local restore validation.
- Acceptance: Team can consistently seed local DB with cloud snapshot data.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Stop tracking real local/cloud credentials in the shared dev env file

- Ticket ID: `ZE-030`
- Description: Remove real credentials from shared env files and keep examples only.
- Status: `Open`
- Likely files: `.env.dev`, `README.md`, `zeus/README.md`
- Details: Replace sensitive values with placeholders and update setup docs.
- Acceptance: Repository no longer contains real runtime secrets in shared env files.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

## Hera UI Architecture

### Finish GenerateQuestionPage shell modernization

- Ticket ID: `HE-013`
- Description: Bring `GenerateQuestionPage` fully in line with shared page shell/layout conventions.
- Status: `Open`
- Likely files: `hera/src/pages/GenerateQuestionPage.jsx`, `hera/src/components/PageShell.jsx`,
  `hera/src/pages/__tests__/**`
- Details: Align spacing, containers, actions, and empty/loading states with current Hera guidelines.
- Acceptance: Generate page uses the standard shell and passes focused UI tests.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Eliminate or migrate `PageContainer` from routed pages

- Ticket ID: `HE-014`
- Description: Remove remaining routed-page usage of legacy `PageContainer` in favor of current shell primitives.
- Status: `Open`
- Likely files: `hera/src/pages/**`, `hera/src/components/PageContainer*`, `hera/src/components/PageShell.jsx`
- Details: Keep behavior while migrating to one canonical page layout approach.
- Acceptance: Routed pages no longer depend on legacy container abstractions.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Resolve placeholder routes in the Hera router

- Ticket ID: `HE-015`
- Description: Remove or implement placeholder route entries so route map is production-truthful.
- Status: `Open`
- Likely files: `hera/src/config/routes.jsx`, `hera/src/App.jsx`
- Details: Audit temporary routes and align navbar/deep-link behavior with supported pages.
- Acceptance: Route config has no ambiguous placeholders left.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Remove developer-facing explanatory copy from admin collection surfaces

- Ticket ID: `HE-016`
- Description: Remove debug/developer explanatory text from admin collection review screens.
- Status: `Open`
- Likely files: `hera/src/pages/Admin*.jsx`, `hera/src/features/collections/**`
- Details: Keep only user-facing product copy and compact metadata.
- Acceptance: Admin collection pages no longer expose dev-oriented helper text.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Make collection session results layout denser and easier to scan

- Ticket ID: `HE-018`
- Description: Improve results density/readability, especially for longer sessions.
- Status: `Open`
- Likely files: `hera/src/pages/CollectionSessionResultsPage.jsx`, `hera/src/styles/**`
- Details: Compact metadata and score presentation while preserving mobile readability.
- Acceptance: Results page is easier to scan without losing clarity.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Improve semantic structure of profile fact sections

- Ticket ID: `HE-019`
- Description: Present profile facts with semantic key/value structure.
- Status: `Open`
- Likely files: `hera/src/pages/ProfilePage.jsx`, `hera/src/pages/UserProfilePage.jsx`, `hera/src/pages/__tests__/**`
- Details: Use definition-list style or equivalent accessible grouping.
- Acceptance: Profile facts become more semantic without visual regression.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Clarify or remove the `/users` route without a user id

- Ticket ID: `HE-020`
- Description: Decide behavior of `/users` without `userId` and remove ambiguity.
- Status: `Open`
- Likely files: `hera/src/config/routes.jsx`, `hera/src/pages/UserProfilePage.jsx`
- Details: Redirect intentionally, support a defined page, or remove the route.
- Acceptance: `/users` has deterministic behavior.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Fix EditQuestionPage category-shape handling

- Ticket ID: `HE-021`
- Description: Align edit flow with real backend category payload shape.
- Status: `Open`
- Likely files: `hera/src/pages/CreateQuestionPage/EditQuestionPage.jsx`, `hera/src/services/questionService.js`,
  `hera/src/pages/__tests__/QuestionEditingFlow.test.jsx`
- Details: Normalize singular/plural category shape handling and add regression coverage.
- Acceptance: Edit form loads existing category data reliably.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Make AdminUsers scale beyond in-memory filtering

- Ticket ID: `HE-022`
- Description: Move AdminUsers page toward server-side search/pagination or document strict size limits.
- Status: `Open`
- Likely files: `hera/src/pages/AdminUsersPage.jsx`, `hera/src/services/userService.js`,
  `zeus/src/main/java/com/ednilo/app/user/profile/**`
- Details: Avoid implicit assumption that full user list always stays small.
- Acceptance: Admin user management has an explicit scaling strategy.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

## Suggested Improvements And API Sync

### Sync frontend API map for topic mastery endpoint

- Ticket ID: `FE-001`
- Description: Zeus now exposes `GET /me/topic-mastery` for Athena collection mastery; confirm shared frontend API documentation/maps include the additive contract and that non-Athena clients intentionally ignore it.
- Status: `Todo`
- Priority: `Medium`
- Likely files: `docs/reference/api-contract-map.md`, `hera/src/services/**`, `frontend-shared/packages/frontend-config/**`
- Details: Document the endpoint shape, auth requirement, and Athena-only usage; add a Hera/shared client only if another frontend needs to call it.
- Acceptance: Frontend API contract references are aligned with the new endpoint, and Hera has either no dependency or an explicit typed integration.
- Updated: 2026-05-22T00:00:00.000Z

### Add a component catalog for shared Hera UI primitives

- Ticket ID: `HE-023`
- Description: Add Storybook or equivalent visual catalog for shared UI primitives.
- Status: `Open`
- Likely files: `hera/package.json`, `hera/src/components/ui/**`, `hera/docs/**`
- Details: Provide a local review surface for shared components and states.
- Acceptance: Shared primitives have a documented visual catalog workflow.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Add a Playwright smoke test for orientation and back-navigation flows

- Ticket ID: `HE-024`
- Description: Add e2e smoke test for key navigation continuity flow.
- Status: `Open`
- Likely files: `business-tests/tests/**`, `business-tests/playwright.config.ts`,
  `hera/scenarios/30_back_navigation_orientation_continuity.md`
- Details: Cover `/home` to collection browsing/detail and back-navigation.
- Acceptance: Smoke test fails on navigation/back-stack regressions.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Add end-to-end coverage for editing an existing question

- Ticket ID: `HE-025`
- Description: Add e2e test for My Questions -> Edit -> Save success flow.
- Status: `Open`
- Likely files: `business-tests/tests/**`, `hera/scenarios/14_edit_existing_question.md`
- Details: Validate route, prefilled form, save behavior, and success feedback.
- Acceptance: Edit flow is covered by executable business test.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Consume `includePrefetch` metadata in the play flow

- Ticket ID: `HE-026`
- Description: Use additive `includePrefetch` signal from feed API in Hera play flow.
- Status: `Open`
- Likely files: `hera/src/pages/PlayPage/**`, `hera/src/services/feedService.js`
- Details: Improve next-question readiness without changing correctness.
- Acceptance: Play flow safely consumes `includePrefetch`.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Add a typed breadcrumb client and route-level metadata cache

- Ticket ID: `HE-027`
- Description: Add typed navigation metadata client and cache.
- Status: `Open`
- Likely files: `hera/src/services/navigationService.js`, `hera/src/config/routes.jsx`, `hera/src/utils/**`
- Details: Reduce repeated route metadata recomputation and align with backend permissions.
- Acceptance: Breadcrumb metadata comes via typed client with route-aware caching.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Expose and consume an AI model catalog instead of hardcoded options

- Ticket ID: `BO-083`
- Description: Replace hardcoded model list in Hera with backend-driven model catalog.
- Status: `Open`
- Likely files: `zeus/src/main/java/com/ednilo/app/ai/**`, `hera/src/pages/GenerateQuestionPage.jsx`,
  `hera/src/services/aiService.js`
- Details: Render available models from API and hide unsupported options.
- Acceptance: Hera model choices are backend-driven.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Add a traceability matrix from Hera scenarios to automated coverage

- Ticket ID: `BO-084`
- Description: Maintain mapping from `hera/scenarios/*.md` flows to automated tests.
- Status: `Open`
- Likely files: `hera/scenarios/README.md`, `business-tests/README.md`, `docs/**`
- Details: Track coverage type and ownership for each scenario.
- Acceptance: Matrix clearly shows covered and uncovered flows.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Add a CI guard that checks scenario and executable-test catalog drift

- Ticket ID: `BO-085`
- Description: Add CI check for scenario/test mapping drift.
- Status: `Open`
- Likely files: `.github/**`, `business-tests/**`, `hera/scenarios/**`, `scripts/**`
- Details: Fail CI when scenario catalog and executable tests diverge without explicit disposition.
- Acceptance: Drift is detected automatically in CI.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Add an overflow strategy for dense play-question metadata

- Ticket ID: `HE-028`
- Description: Prevent long metadata lists from pushing answer UI below fold.
- Status: `Open`
- Likely files: `hera/src/features/play/components/PlayQuestionPanel.jsx`, `hera/src/styles/**`
- Details: Clamp/collapse long lists with compact expander while preserving accessibility.
- Acceptance: Narrow screens keep answer area usable.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Add a shared `IconButton` with tooltip and accessibility defaults

- Ticket ID: `HE-029`
- Description: Add shared icon-button primitive with tooltip and `aria-label` defaults.
- Status: `Open`
- Likely files: `hera/src/components/ui/**`, `hera/src/components/__tests__/**`
- Details: Centralize icon action behavior for consistency and accessibility.
- Acceptance: Reusable `IconButton` exists and at least one consumer is migrated.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Add focused UI regression coverage for PlayQuestionPanel header layout

- Ticket ID: `HE-030`
- Description: Add focused test for play-panel header alignment at narrow widths.
- Status: `Open`
- Likely files: `hera/src/features/play/components/PlayQuestionPanel.jsx`,
  `hera/src/features/play/components/__tests__/**`
- Details: Cover title, favorite action, and metadata layout on small screens.
- Acceptance: Regressions in header layout are caught by automated UI tests.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Consume `feedPhase` in Hera profile and performance state

- Ticket ID: `HE-032`
- Description: Read and use additive `feedPhase` field from `/api/v1/me/performance`.
- Status: `Open`
- Likely files: `hera/src/services/userProfileService.js`, `hera/src/pages/ProfilePage.jsx`,
  `hera/src/services/__tests__/**`
- Details: Handle `START_PHASE` and `ADAPTIVE_PHASE` safely with backward compatibility.
- Acceptance: Hera consumes `feedPhase` without older payload breakage.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Integrate question-like endpoints into Hera engagement UX

- Ticket ID: `HE-033`
- Description: Integrate like/unlike endpoints into question detail and engagement surfaces.
- Status: `Open`
- Likely files: `hera/src/services/questionService.js`, `hera/src/pages/**`, `hera/src/features/questions/**`
- Details: Add optimistic updates, unauthorized handling, and counts/state synchronization.
- Acceptance: Hera supports question likes end-to-end.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Integrate question-comment endpoints into Hera question detail UX

- Ticket ID: `HE-034`
- Description: Add frontend support for question comment CRUD against Zeus APIs.
- Status: `Open`
- Likely files: `hera/src/services/questionService.js`, `hera/src/features/questions/**`, `hera/src/pages/**`
- Details: Add paginated comments, owner/admin affordances, and input validation parity.
- Acceptance: Hera exposes working comment create/list/edit/delete flows.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Consume the admin AI generation job-status endpoint in Hera

- Ticket ID: `HE-035`
- Description: Update admin generation UX to poll and display AI generation job status.
- Status: `Open`
- Likely files: `hera/src/pages/GenerateQuestionPage.jsx`, `hera/src/services/aiService.js`
- Details: Poll by `jobId`, stop on terminal states, and show completion/failure details.
- Acceptance: Admin generation flow reflects backend async status without manual refresh.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Adapt Hera admin interaction review to the DTO contract

- Ticket ID: `HE-036`
- Description: Align admin interaction review page with `AdminUserInteractionDTO`.
- Status: `Open`
- Likely files: `hera/src/pages/UserProfileAdminPage.jsx`, `hera/src/services/userService.js`
- Details: Use `questionSummary` and `active` semantics instead of raw entity assumptions.
- Acceptance: Admin interaction review renders correctly for active/inactive questions.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Decide the fate of question endpoints exposed by Zeus but unused in Hera

- Ticket ID: `BO-086`
- Description: Decide whether currently unused exposed question endpoints should be wired, de-scoped, or removed.
- Status: `Open`
- Likely files: `docs/reference/api-contract-map.md`, `docs/reference/api-contract-map.md`, `hera/src/services/**`,
  `zeus/src/main/java/com/ednilo/app/question/**`
- Details: Explicitly disposition endpoints like `GET /questions`, `GET /questions/favorites`, `DELETE /questions/{id}`.
- Acceptance: Each currently unused exposed endpoint has documented disposition.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

## Hera Navigation Architecture

### Flatten top-level navbar to direct links and section defaults

- Ticket ID: `HE-037`
- Description: Remove top-level dropdown behavior and use direct section-entry routes.
- Status: `Open`
- Likely files: `hera/src/components/Navbar.jsx`, `hera/src/config/menuConfig.js`, `hera/src/config/routes.jsx`
- Details: `Play -> /home`, `Questions -> /questions/me`, `Collections -> /collections/my`, `Profile -> /profile`, admin
  entry route defined.
- Acceptance: Navbar has direct links only and existing deep links remain reachable.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Build a reusable section sub-navigation system (tabs desktop, selector mobile)

- Ticket ID: `HE-038`
- Description: Add shared section sub-navigation component driven by route metadata.
- Status: `Open`
- Likely files: `hera/src/components/ui/**`, `hera/src/components/PageShell.jsx`, `hera/src/config/routes.jsx`
- Details: Render tabs on desktop and compact selector on mobile with active-state handling.
- Acceptance: One shared subnav component supports all section pages consistently.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

### Apply section sub-navigation to Questions, Collections, Profile, and Admin

- Ticket ID: `HE-039`
- Description: Roll out shared sub-navigation pattern to target sections, including admin landing page.
- Status: `Open`
- Likely files: `hera/src/pages/ViewMyQuestionsPage.jsx`, `hera/src/pages/ViewAllCollectionsPage.jsx`,
  `hera/src/pages/ProfilePage.jsx`, `hera/src/pages/Admin*.jsx`, `hera/src/config/routes.jsx`
- Details: Questions and collections need dual tabs; profile/admin follow same pattern with role-aware visibility.
- Acceptance: Section defaults and subnav work consistently across target sections.
- Recovery: Reconstructed on 2026-04-09 from surviving board snapshots and session history.

## Hera Legal And Compliance

### Review drafted public legal copy before production reliance

- Ticket ID: `HE-064`
- Description: Hera now has production-style Terms and Privacy Policy drafts, but the wording still needs qualified legal/product review before it is relied on as final public policy.
- Status: `Todo`
- Priority: `Medium`
- Likely files: `hera/src/pages/LegalPage.tsx`, `hera/docs/legal-pages.md`
- Details: Confirm operator identity, jurisdiction choices, privacy disclosures, retention language, user-rights handling, age language, and any required region-specific notices with the appropriate owner or counsel.
- Acceptance: The published Terms and Privacy Policy are owner-approved for production use, and any required wording changes are reflected in Hera plus the legal-pages documentation.
- Updated: 2026-05-15T00:00:00.000Z

## UI Improvements

### Make PlayPage result state compact and unmistakable

- Ticket ID: `HE-041`
- Description: Differentiate answer review from question answering without adding bulky vertical layout.
- Status: `UI improvements`
- Likely files: `hera/src/pages/PlayPage/PlayPage.jsx`, `hera/src/features/play/components/PlayResultView.jsx`,
  `hera/src/features/play/components/PlayActionBar.jsx`, `hera/src/pages/PlayPage/__tests__/PlayPage.test.jsx`
- Details: Use compact state language, answer correctness clarity, and an explicit next action while preserving the
  current narrow PlayPage rhythm. Source: `docs/product/ux-principles.md` and `hera/docs/play-ui.md`.
- Acceptance: Users can distinguish answering from reviewing at a glance, result content does not feel bulky, and
  focused PlayPage tests cover the result-state copy and CTA.

### Add always-visible play session progress

- Ticket ID: `HE-042`
- Description: Show lightweight progress during the play loop so users know where they are in the session.
- Status: `UI improvements`
- Likely files: `hera/src/pages/PlayPage/**`, `hera/src/features/play/components/**`,
  `hera/src/services/feedService.js`, `zeus/src/main/java/com/ednilo/app/question/feed/**`
- Details: Add a compact progress mechanic such as question count, progress bar, score, or streak indicator, with any
  missing backend data handled deliberately. Source: `docs/product/ux-principles.md`.
- Acceptance: At least one progress signal is visible during question and result states, remains mobile-friendly, and
  has UI test coverage.

### Add restrained correct and incorrect reward feedback

- Ticket ID: `HE-045`
- Description: Make correctness feedback feel satisfying without becoming noisy or childish.
- Status: `UI improvements`
- Likely files: `hera/src/features/play/components/AnswerOutcome.jsx`,
  `hera/src/features/play/components/PlayResultView.jsx`, `hera/src/styles/**`
- Details: Add soft success emphasis for correct answers and informative, non-punishing wrong-answer feedback; avoid
  constant confetti or harsh failure language. Source: `docs/product/ux-principles.md`.
- Acceptance: Correct and incorrect result states have distinct restrained feedback, copy remains calm, and
  reduced-motion behavior is respected.

### Add restrained milestone moments

- Ticket ID: `HE-047`
- Description: Add stronger but still tasteful feedback for streak or session milestones.
- Status: `UI improvements`
- Likely files: `hera/src/pages/PlayPage/**`, `hera/src/features/play/components/**`, `hera/src/styles/**`
- Details: Trigger milestone moments for events like 3 correct in a row, 5 correct in a row, session completed, or new
  best streak once the underlying data exists. Source: `docs/product/ux-principles.md`.
- Acceptance: Milestone feedback appears only on meaningful milestones, does not block the next action, and can be
  disabled by reduced-motion preferences.

### Add a play session summary layer

- Ticket ID: `HE-048`
- Description: Provide a compact end-of-session summary for score, progress, and completion reward.
- Status: `UI improvements`
- Likely files: `hera/src/pages/PlayPage/**`, `hera/src/features/play/components/**`,
  `hera/src/services/feedService.js`, `zeus/src/main/java/com/ednilo/app/question/feed/**`
- Details: Summarize completion, correct/wrong counts, streak, or score when a bounded session concept exists. Source:
  `docs/product/ux-principles.md`.
- Acceptance: A completed session gives clear closure and next-step options without adding friction to normal question
  progression.

### Improve explanation progressive disclosure in play results

- Ticket ID: `HE-049`
- Description: Make explanations easy to access after correctness is understood without overwhelming the result state.
- Status: `UI improvements`
- Likely files: `hera/src/features/play/components/PlayResultView.jsx`,
  `hera/src/features/play/components/ExplanationBlock.jsx`, `hera/src/pages/PlayPage/__tests__/**`
- Details: Keep outcome and answer clarity first, then show explanation with compact progressive disclosure and source
  labeling where available. Source: `docs/product/ux-principles.md`.
- Acceptance: Explanation content appears after outcome clarity, can be expanded/collapsed accessibly, and long
  explanations do not push the next action out of reach on mobile.

### Keep social and statistics secondary in play results

- Ticket ID: `HE-050`
- Description: Ensure likes, comments, and community stats do not compete with outcome clarity or the next action.
- Status: `UI improvements`
- Likely files: `hera/src/features/play/components/PlayResultView.jsx`,
  `hera/src/features/questions/components/QuestionEngagementPanel.jsx`,
  `hera/src/features/play/components/QuestionStats.jsx`
- Details: Place social and statistics affordances after the main result content with compact defaults. Source:
  `docs/product/ux-principles.md`.
- Acceptance: Result screen hierarchy remains outcome, answer clarity, explanation, extras, next; stats/social remain
  usable but visually secondary.

### Reduce unnecessary PlayPage rerenders and remount feel

- Ticket ID: `HE-053`
- Description: Improve perceived performance by keeping the play loop lightweight during answer and next transitions.
- Status: `UI improvements`
- Likely files: `hera/src/pages/PlayPage/**`, `hera/src/features/play/components/**`, `hera/src/services/feedService.js`
- Details: Audit remounts, state resets, heavy derived work, and asset loading during the question/result loop. Source:
  `docs/product/ux-principles.md`.
- Acceptance: Answer tap and next-question transitions stay responsive, avoid full-page flash/reload feel, and
  performance-sensitive behavior is covered where practical.

### Add core play-flow analytics events

- Ticket ID: `HE-054`
- Description: Emit product events needed to measure play-flow friction and completion.
- Status: `UI improvements`
- Likely files: `hera/src/pages/PlayPage/**`, `hera/src/services/**`, `zeus/src/main/java/com/ednilo/app/**`
- Details: Track question impressions, answer selected/submitted/correct/wrong, skipped, result viewed, explanation
  expanded, next clicked, session started, and session ended. Source: `docs/product/ux-principles.md`.
- Acceptance: Events are emitted from stable points in the UI flow, payloads avoid sensitive data, and analytics calls
  are testable/mocked.

### Add play-flow UX diagnostic metrics

- Ticket ID: `HE-055`
- Description: Capture timing and friction diagnostics for the play loop.
- Status: `UI improvements`
- Likely files: `hera/src/pages/PlayPage/**`, `hera/src/services/**`, `zeus/src/main/java/com/ednilo/app/**`
- Details: Measure answer tap to result visible, next click to next question visible, duplicate/rage taps, and
  abandon/back navigation during result load. Source: `docs/product/ux-principles.md`.
- Acceptance: Diagnostic metrics can identify slow or confusing play-flow steps without collecting unnecessary personal
  data.

### Surface adaptive personalization feedback

- Ticket ID: `HE-056`
- Description: Give users light feedback when difficulty or category adaptation affects the question flow.
- Status: `UI improvements`
- Likely files: `hera/src/pages/PlayPage/**`, `hera/src/pages/ProfilePage.jsx`,
  `hera/src/services/userProfileService.js`, `zeus/src/main/java/com/ednilo/app/user/performance/**`
- Details: Make adaptive behavior feel understandable, such as brief labels for level fit, weak-area review, or category
  weighting, without adding settings clutter. Source: `docs/product/ux-principles.md`.
- Acceptance: Users can understand why the feed feels tailored, copy stays transparent, and the UI avoids opaque or
  repetitive personalization signals.

### Add optional subtle sound and haptic feedback controls

- Ticket ID: `HE-057`
- Description: Explore optional sound or haptic feedback for tap, success, and milestone moments.
- Status: `UI improvements`
- Likely files: `hera/src/pages/PlayPage/**`, `hera/src/features/play/**`, `hera/src/utils/**`,
  `hera/src/pages/ProfilePage.jsx`
- Details: Keep feedback subtle, opt-in or easy to disable, and never required for comprehension. Source:
  `docs/product/ux-principles.md`.
- Acceptance: Any sound/haptic behavior has an accessible off switch, respects user preferences, and does not fire
  constantly during normal navigation.

## Backend Build Hygiene

### Fix backend compile failure from `-Werror` + serialization warnings

- Ticket ID: `ZE-032`
- Description: Maven compile fails because `-Werror` treats `-Xlint:all` serialization warnings as errors.
- Status: `Todo`
- Likely files: `zeus/pom.xml`, `zeus/src/main/java/com/ednilo/app/auth/refresh/InvalidRefreshTokenException.java`,
  `zeus/src/main/java/com/ednilo/app/auth/service/CustomUserDetails.java`,
  `zeus/src/main/java/com/ednilo/app/common/exception/ApiException.java`,
  `zeus/src/main/java/com/ednilo/app/user/performance/exception/UserPerformanceNotFoundException.java`
- Details: Choose whether to suppress `-serial` warnings at the compiler level, or fix them explicitly (e.g. add
  `serialVersionUID` where appropriate and ensure serializable classes do not retain non-serializable fields).
- Acceptance: `mvn -f zeus/pom.xml -DskipTests compile` succeeds when warning-fail is enabled (e.g. with
  `-Dquality.failOnWarning=true`).
- Updated: 2026-04-23T09:12:20.000Z

## Cross-Project Development Efficiency

### Add reusable feature-slice templates for Hera plus Zeus work

- Ticket ID: `BO-091`
- Description: Create one standard implementation template for cross-stack features so new work does not repeatedly
  re-derive file layout, test strategy, and API wiring patterns.
- Status: `Open`
- Likely files: `docs/**`, `hera/docs/**`, `zeus/README.md`, `hera/README.md`, `scripts/**`
- Details: Define a canonical slice covering backend DTO/controller/service/tests, frontend
  service/page/component/tests, and closeout verification expectations for new features and bug fixes.
- Acceptance: A documented feature-slice template exists, references real repo examples, and is usable as the default
  starting pattern for work spanning Zeus and Hera.
- Updated: 2026-04-20T12:13:06.181Z

### FE follow-up: messaging + friends endpoints
- Ticket ID: `ZE-FE-MSG-001`
- Description: Integrate new `/friends/**` and `/messages/**` APIs (friend requests, inbox, friend-only sends, admin system messages) into Hera social UX.
- Status: `Todo`
- Updated: 2026-05-04

## Migrated Codex Follow-ups

### Reduce remaining SpotBugs issue count after fixing DTO exposure findings

- Ticket ID: `ZE-033`
- Description: `mvn -f zeus/pom.xml spotbugs:check` still reports issues after fixing most `EI_EXPOSE_REP*` DTO findings.
- Status: `Todo`
- Priority: `Medium`
- Likely files: `zeus/src/main/java/com/ednilo/app/question/feed/model/ScoredQuestion.java`, `zeus/src/main/java/com/ednilo/app/question/image/service/S3ImageService.java`, and remaining SpotBugs offenders from the current report.
- Acceptance: SpotBugs succeeds with zero findings, or the project has an agreed baseline with documented suppressions.
- Updated: 2026-05-07T00:00:00.000Z

### Refresh collection edit data when opening from create flow

- Ticket ID: `HE-058`
- Description: After creating a collection, the edit page can keep using stale `location.state.collection` and skip fetching the latest backend collection.
- Status: `Todo`
- Priority: `Medium`
- Likely files: `hera/src/pages/EditCollectionPage.jsx`, collection edit page tests.
- Acceptance: Opening or reloading `/collections/my/:collectionId/edit` always reconciles with backend collection state, including after create-flow navigation.
- Updated: 2026-05-07T00:00:00.000Z

### Add conversation endpoint for grouped inbox threads

- Ticket ID: `BO-093`
- Description: The inbox needs a conversation endpoint that returns full two-way thread history for a selected system entity or friend.
- Status: `Todo`
- Priority: `Medium`
- Likely files: `zeus/src/main/java/com/ednilo/app/messaging/**`, `hera/src/pages/MessagesPage.jsx`, `hera/src/services/messageService.js`.
- Acceptance: Messages can open grouped conversation threads for system and friend entities, with full backend history and friend inline replies.
- Updated: 2026-05-07T00:00:00.000Z

### Optimize profile resolution with batch API endpoint

- Ticket ID: `BO-094`
- Description: `useResolvedUserNames` makes individual API calls for each missing user ID instead of batching them.
- Status: `Todo`
- Priority: `Critical`
- Likely files: `hera/src/pages/messages/useResolvedUserNames.js`, `hera/src/services/userProfileService.js`, `zeus/src/main/java/com/ednilo/app/user/profile/**`.
- Acceptance: A batch profile summary endpoint returns multiple summaries, Hera batches missed IDs, and page load uses one request instead of N profile requests.
- Updated: 2026-05-07T00:00:00.000Z

### Normalize remaining local datetime API fields to offset timestamps

- Ticket ID: `ZE-034`
- Description: Some Zeus DTOs still serialize local datetime values without an offset, which browsers can parse as local time.
- Status: `Todo`
- Priority: `Medium`
- Likely files: `zeus/src/main/java/com/ednilo/app/question/collection/**`, `zeus/src/main/java/com/ednilo/app/question/core/dto/QuestionDraftDTO.java`, Hera date/time display tests.
- Acceptance: User-facing collection and draft timestamps include explicit offsets and Hera displays them correctly across non-UTC browser time zones.
- Updated: 2026-05-07T00:00:00.000Z

### Address race condition in message thread summaries

- Ticket ID: `ZE-035`
- Description: `InAppMessagingService.getThreadSummaries()` fetches messages without a consistent snapshot, risking missed messages or unread count drift.
- Status: `Todo`
- Priority: `Critical`
- Likely files: `zeus/src/main/java/com/ednilo/app/messaging/service/InAppMessagingService.java`, `zeus/src/main/java/com/ednilo/app/messaging/repository/InAppMessageRepository.java`.
- Acceptance: Thread summaries consistently reflect all messages up to one point-in-time snapshot and unread counts cannot miss newly inserted messages.
- Updated: 2026-05-07T00:00:00.000Z

### Extend error handling for message sending failures

- Ticket ID: `HE-059`
- Description: Messaging pages handle `FRIENDSHIP_REQUIRED` specifically but fall back to generic text for other known API errors.
- Status: `Todo`
- Priority: `High`
- Likely files: `hera/src/pages/MessagesComposePage.jsx`, `hera/src/pages/MessagesThreadPage.jsx`, possibly a shared messages utility.
- Acceptance: Known messaging API error codes have user-friendly messages and focused tests verify each error path.
- Updated: 2026-05-07T00:00:00.000Z

### Add unit tests for new messaging pages

- Ticket ID: `HE-060`
- Description: The messaging pages and utilities need focused unit coverage.
- Status: `Todo`
- Priority: `Medium`
- Likely files: `hera/src/pages/__tests__/MessagesComposePage.test.jsx`, `hera/src/pages/__tests__/MessagesFriendsPage.test.jsx`, `hera/src/pages/__tests__/MessagesThreadPage.test.jsx`, `hera/src/pages/messages/__tests__/`.
- Acceptance: Tests cover happy paths, error states, loading states, race-sensitive behavior, and hook caching/batch behavior.
- Updated: 2026-05-07T00:00:00.000Z

### Complete Hera strict TypeScript hardening after JS-to-TS rename

- Ticket ID: `HE-061`
- Description: Hera now runs as TS-only source, but enabling full strict-null/no-implicit-any gates still reports a large diagnostics set and blocks strict-hard completion.
- Status: `Todo`
- Priority: `High`
- Likely files: `hera/tsconfig.json`, `hera/src/components/**`, `hera/src/hooks/**`, `hera/src/pages/**`, `hera/src/services/**`, `hera/src/utils/**`, `hera/src/**/*.test.ts*`.
- Details: Remove temporary non-strict compiler overrides, add explicit state/ref generics and domain interfaces, and replace residual implicit/loose typing with stable contracts (prefer Swagger DTO-backed types on API edges).
- Acceptance: `npm run typecheck` passes with `strict: true` and without `noImplicitAny`/`strictNullChecks` fallback overrides; `npm run lint`, `npm run test:ui:report`, and `npm run build` remain green.
- Updated: 2026-05-11T00:00:00.000Z
