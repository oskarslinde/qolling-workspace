# Frontend-Zeus API Contract Map

Purpose: compact cross-repo map from frontend services to Zeus backend endpoints. Use this before changing an endpoint, DTO, or page flow.

## Global Rules

- Shared frontend API base construction now lives in `frontend-shared/packages/frontend-config`.
- Hera and Athena keep host-local adapters that supply their own frontend id and environment-derived base URL.
- Zeus API base path: `/api/v1` from `spring.mvc.servlet.path`.
- Local dev with Hera proxy commonly uses `VITE_API_BASE_URL=/api`, producing `/api/v1/...`.
- Prefer updating Hera service modules and Zeus controller/DTO tests together.
- Do not display functional IDs/UUIDs/job IDs in Hera UI unless they directly help the user.

## Auth And OAuth

| Hera | Zeus | Notes |
| --- | --- | --- |
| `authService.logoutSession` -> `POST /auth/logout` | `AuthController.logout` | Uses refresh token from local storage. |
| Login page direct auth call -> `POST /auth/login` | `AuthController.login` | Check `LoginPage.jsx` and `API_ENDPOINTS.LOGIN`. |
| Register page direct auth call -> `POST /auth/register` | `AuthController.register` | Check `RegisterPage.jsx` and `API_ENDPOINTS.REGISTER`. |
| Token refresh -> `POST /auth/refresh` | `AuthController.refreshToken` | Used by `fetchWithAuth` flow. |
| `startGoogleOAuthLogin` -> `/oauth2/authorization/google` | Spring OAuth2 via `SecurityConfig` | Actual authorization base is `/api/v1/oauth2/authorization`. |
| OAuth callback route `/oauth/callback` | OAuth success/failure handlers | Zeus redirects back to Hera frontend base URL. |

## Email Verification

| Hera | Zeus | Notes |
| --- | --- | --- |
| `GET /email/verify` | `EmailVerificationController.verifyEmail` | Used by `VerifyEmailPage`. |
| `POST /email/resend-verification` | `EmailVerificationController.resendVerification` | Used by login/register recovery flows. |

## Current User, Profile, Performance

| Hera service | Endpoint | Zeus controller |
| --- | --- | --- |
| `getCurrentUser` | `GET /me` | `UserController` |
| `updateCurrentUser` | `PUT /me` | `UserController` |
| `getUserPerformance` | `GET /me/performance` | `UserPerformanceController` |
| `getOrCreateUserPerformance` | `POST /me/performance` | `UserPerformanceController` |
| `resetUserPerformance` | `DELETE /me/performance/reset` | `UserPerformanceController` |
| `getCurrentUserInteractions` | `GET /me/interactions` | `UserInteractionController` |
| `getUserProfileSummary` | `GET /users/{userId}/summary` | `PublicUserProfileController` |
| `searchUsersByUsername` | `GET /users/search?username=` | `PublicUserProfileController` |

## Friends And Messaging

| Hera service | Endpoint | Zeus controller |
| --- | --- | --- |
| `sendFriendRequest` | `POST /friends/requests` | `FriendController` |
| `acceptFriendRequest` | `POST /friends/requests/{requestId}/accept` | `FriendController` |
| `getPendingFriendRequests` | `GET /friends/requests/pending` | `FriendController` |
| `getFriends` | `GET /friends` | `FriendController` |
| `getFriendActivityFeed` | `GET /friends/feed` | `FriendController` |
| `sendSystemMessage` | `POST /messages/system` | `InAppMessagingController` |
| `broadcastSystemMessage` | `POST /messages/system/broadcast` | `InAppMessagingController` |
| `sendMessage` | `POST /messages` | `InAppMessagingController` |
| `getUnreadMessageCount` | `GET /messages/unread-count` | `InAppMessagingController` |
| `getMessageThreads` | `GET /messages/threads` | `InAppMessagingController` |
| `getMessageThread` | `GET /messages/threads/{threadKey}` | `InAppMessagingController` |
| `markMessageThreadAsRead` | `POST /messages/threads/{threadKey}/read` | `InAppMessagingController` |
| `markInboxMessagesAsRead` | `POST /messages/inbox/read` | `InAppMessagingController` |
| `getInboxMessages` | `GET /messages/inbox` | `InAppMessagingController` |

User-to-user messages require accepted friendship. System message send and broadcast require admin role.

## Admin Users

| Hera service | Endpoint | Zeus controller |
| --- | --- | --- |
| `getAllUsers` | `GET /admin/users` | `AdminUserController` |
| `getAdminUserById` | `GET /admin/users/{userId}` | `AdminUserController` |
| `blockAdminUser` | `PATCH /admin/users/{userId}/block` | `AdminUserController` |
| `getAdminUserQuestions` | `GET /admin/users/{userId}/questions?page=&size=` | `AdminUserController` |
| `getAdminUserInteractions` | `GET /admin/users/{userId}/interactions` | `AdminUserController` |

Important: Zeus `SecurityConfig` currently has `/admin/**` role enforcement commented out. Verify backend authorization before assuming admin UI checks are sufficient.

## Questions

| Hera service | Endpoint | Zeus controller |
| --- | --- | --- |
| `getAllQuestions` | `GET /questions` | `QuestionControllerImpl` |
| `getAllMyQuestions` | `GET /questions/my?page=&size=&keyword=&status=` | `QuestionControllerImpl` |
| `getQuestionById` | `GET /questions/{id}` | `QuestionController` |
| `addQuestion` | `POST /questions` multipart `question` JSON + optional `image` | `QuestionController` |
| `updateQuestion` | `PUT /questions/{id}` JSON or multipart | `QuestionController` |
| `submitQuestionForApproval` | `PUT /questions/{id}/submit-for-approval` | `QuestionController` |
| `hideQuestion` | `PATCH /questions/hide/{id}` | `QuestionController` |
| `getAllNotApprovedQuestions` | `GET /questions/not-approved?page=&size=&keyword=` | `QuestionController` |
| `approveQuestion` | `PUT /questions/{id}/approve` | `QuestionController` |
| `declineQuestion` | `PUT /questions/{id}/decline` | `QuestionController` |
| `favoriteQuestion` | `POST /questions/{id}/favorite` | `QuestionController` |
| `getFavoriteQuestions` | `GET /questions/favorites` | `QuestionController` |
| `getAllCategories` | `GET /categories` | `CategoryController` |

Question form note: Hera shared `QuestionForm` is used for manual create, edit, and AI-generated drafts. New questions are saved as unpublished `PRIVATE` drafts; owners submit them for admin review later from My Questions via `submitQuestionForApproval`, which changes the visible moderation status to `IN_REVIEW`.

## Question Engagement

| Hera service | Endpoint | Zeus controller |
| --- | --- | --- |
| `getQuestionLikeSummary` | `GET /questions/{id}/likes` | `QuestionLikeController` |
| `likeQuestion` | `POST /questions/{id}/likes` | `QuestionLikeController` |
| `unlikeQuestion` | `DELETE /questions/{id}/likes` | `QuestionLikeController` |
| `getQuestionLikeUsers` | `GET /questions/{id}/likes/users?page=&size=` | `QuestionLikeController` |
| `getQuestionComments` | `GET /questions/{id}/comments?page=&size=` | `QuestionCommentController` |
| `createQuestionComment` | `POST /questions/{id}/comments` body `{ content }` | `QuestionCommentController` |
| `updateQuestionComment` | `PUT /questions/{id}/comments/{commentId}` body `{ content }` | `QuestionCommentController` |
| `deleteQuestionComment` | `DELETE /questions/{id}/comments/{commentId}` | `QuestionCommentController` |

## Feed / Play

| Hera service | Endpoint | Zeus controller |
| --- | --- | --- |
| `getNextFeedItem` | `GET /feed/next` | `FeedController` |
| `submitFeedAnswer` | `POST /feed/answer` body `{ feedItemId, selectedAnswer }` | `FeedController` |
| `skipFeedItem` | `POST /feed/skip` body `{ feedItemId }` | `FeedController` |

Hera adds `Idempotency-Key` headers for answer/skip operations in `feedService.js`.

## Collections

| Hera service | Endpoint | Zeus controller |
| --- | --- | --- |
| `getPublicCollections` | `GET /question-collections/public?page=&size=&keyword=&state=&sort=` | `QuestionCollectionController` |
| `getMyCollections` | `GET /question-collections/my?page=&size=&keyword=&state=&sort=` | `QuestionCollectionController` |
| `getCollection` | `GET /question-collections/{id}` | `QuestionCollectionController` |
| `getCollectionPlayQuestions` | `GET /question-collections/{id}/play-questions` | `QuestionCollectionController` |
| `getAdminReviewCollections` | `GET /question-collections/admin/review?page=&size=&sort=` | `QuestionCollectionController` |
| `createCollection` | `POST /question-collections` | `QuestionCollectionController` |
| `updateCollection` | `PUT /question-collections/{id}` | `QuestionCollectionController` |
| `deleteCollection` | `DELETE /question-collections/{id}` | `QuestionCollectionController` |
| `addQuestionsToCollection` | `POST /question-collections/{id}/questions` body `{ questionIds }` | `QuestionCollectionController` |
| `removeQuestionFromCollection` | `DELETE /question-collections/{id}/questions/{questionId}` | `QuestionCollectionController` |

Contract note: collection DTOs expose `questionCount` for stored membership and `playableQuestionCount` for active, non-deleted questions. Public learner-facing UI should use `playableQuestionCount`; management/authored collection UI can use `questionCount`.

## Collection Learning Sessions

Zeus has backend endpoints:

- `POST /question-collections/{collectionId}/learning-sessions`
- `GET /question-collections/{collectionId}/learning-sessions/current`
- `POST /question-collections/{collectionId}/learning-sessions/{sessionId}/answer`
- `POST /question-collections/{collectionId}/learning-sessions/{sessionId}/next`
- `POST /question-collections/{collectionId}/learning-sessions/{sessionId}/end`
- `GET /question-collections/{collectionId}/learning-sessions/{sessionId}/results`

Current Hera collection session flow uses frontend/sessionStorage service in `src/features/collections/session/collectionLearningSessionService.js`, not these Zeus endpoints. If moving to backend sessions, update Hera pages and tests together.

## AI Generation

| Hera service | Endpoint | Zeus controller |
| --- | --- | --- |
| `getAvailableModels` | `GET /admin/ai/models` | `QuestionGenerationController` |
| `generateQuestion` | `POST /admin/ai/generate-question?topic=&questionCount=&model=` | `QuestionGenerationController` |
| `getGenerationJobStatus` | `GET /admin/ai/generation-jobs/{jobId}` | `QuestionGenerationController` |

Current contract: async status can include `generatedQuestions`; Hera maps the first generated question into `QuestionForm`. Do not show the job ID in default UI.

## Navigation

| Hera service | Endpoint | Zeus controller |
| --- | --- | --- |
| `getBreadcrumbMetadata` | `GET /navigation/breadcrumbs?route=` | `BreadcrumbController` |

## Images And Static Assets

- Hera question create/update sends multipart form data with `question` JSON and optional `image`.
- Zeus image storage is under `question.image`; local default writes under `uploads/images`.
- Public image access is permitted for `/images/questions/**` in `SecurityConfig`.

## Cross-Repo Change Checklist

1. Update Zeus controller/service/DTO/repository.
2. Add or update Zeus focused tests for the touched domain.
3. Update Hera `API_ENDPOINTS` only if the path changes.
4. Update Hera service wrapper and page/component mapping.
5. Add or update Hera focused UI/service tests.
6. Run focused Maven and Vitest commands before broader lint/compile.
7. Update this map if endpoint shape, auth, or async behavior changes.

## Useful Searches

```bash
# Zeus endpoints
rg -n "@RequestMapping|@GetMapping|@PostMapping|@PutMapping|@DeleteMapping|@PatchMapping" zeus/src/main/java

# Hera endpoint consumers
rg -n "API_ENDPOINTS|fetchWithAuth|generateQuestion|getPublicCollections|getAllMyQuestions" hera/src/services hera/src/constants

# Cross-repo AI
rg -n "generation-jobs|generate-question|generatedQuestions|QuestionGeneration" hera/src zeus/src/main/java zeus/src/test/java

# Cross-repo collections
rg -n "question-collections|play-questions|QuestionCollection|CollectionSummaryCard" hera/src zeus/src/main/java zeus/src/test/java
```
